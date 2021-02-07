<?php

namespace App\Http\Controllers\Api;

use App\Category;
use App\CustomObjects\ApiPagination;
use App\Repositories\SurveyRepository;
use App\Service\CountryService;
use App\Service\CustomJsonResponse;
use App\Survey;
use App\SurveyChoice;
use App\SurveyVote;
use App\User;
use App\Validator\SurveyValidator;
use App\Http\Controllers\Controller;
use App\Validator\SurveyVoteValidator;
use Carbon\Carbon;
use Illuminate\Http\Request;

class SurveysController extends Controller
{
    /**
     * @var CustomJsonResponse
     */
    private $jsonResponse;

    public function __construct(CustomJsonResponse $jsonResponse)
    {
        $this->jsonResponse = $jsonResponse;
    }

    /**
     * List of survey collection
     *
     * @param string $type
     * @param Request $request
     * @return array
     */
    public function index($type = 'normal', Request $request)
    {
        $model = Survey::with('choices.votes')->where('type', $type);

        if(request('year')){
            $model->whereMonth('start_at', request('year'));
        }

        if(request('month')){
            $model->whereMonth('start_at', request('month'));
        }

        if(request('status') !== null){
            $model->whereStatus(request('status', 0));
        }

        if(request('category') !== null){
            $model->where('category_id', request('category'));
        }


        if(auth()->user()->hasRole('country_admin')){
            $model->where('country_id', auth()->user()->country_id);
        } else {
            $model->where('country_id', null);
        }

        $pagination = new ApiPagination(request("limit", 20), count($model->get()), request("offset", 0));

        $this->jsonResponse->setData(
            200,
            'msg.info.list.surveys',
            $model->get(),
            null,
            $pagination->getConvertObject()
        );

        return $this->jsonResponse->getResponse();
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param Survey $survey
     * @return array
     */
    public function store(Survey $survey, Request $request)
    {

        $validator = new SurveyValidator();

        if($response = $validator->validate())
            return $response;

        if(request('type') == 'special' && !auth()->user()->hasAnyRole(['super_admin', 'country_admin'])){
            return $this->surveyError('You are not allowed to add special survey');
        }

        $survey = $this->saveSurvey($request);

        //store the choices

        $this->addSurveyChoices($survey,null, $request);

        if($survey){
            // add survey subject
            if($subjects = request('subjects')){
                foreach($subjects as $subject)
                    $survey->subjects()->attach($subject);
            }
            $this->jsonResponse->setData(200,  'msg.info.survey.created', $survey);
            return $this->jsonResponse->getResponse();
        }
    }

    /**
     * @param $id
     * @return array
     */
    public function detail($id)
    {
        $model = Survey::with([
            'choices.votes',
            'subjects',
            'comments.comments.user.userDetails',
            'comments.user.userDetails',
            'comments.likes.user',
            'user.userDetails'
        ])->where('id', $id)->first();
        $this->jsonResponse->setData(
            200,
            'msg.info.list.surveys',
            $model,
            null, null
        );

        return $this->jsonResponse->getResponse();
    }

    /**
     * @param Survey $survey
     * @param Request $request
     * @return array
     */
    public function update(Survey $survey, Request $request)
    {
        $surveyRepository = new SurveyRepository();

        $fillable = request()->only($survey->getFillable());

        $fillable["start_at"] = date("Y-m-d H:i:s", strtotime($fillable["start_at"] ));
        $fillable["expire_at"] = date("Y-m-d H:i:s", strtotime($fillable["expire_at"] ));

        $update = $surveyRepository->updateData($survey, $fillable);

        if($update){
            //update the choices
            $this->addSurveyChoices($survey, 'update', $request);

            $this->jsonResponse->setData(
                200,
                'msg.info.list.surveys',
                $survey,
                null, null
            );
        }

        return $this->jsonResponse->getResponse();
    }

    public function pushVote()
    {
        $validator = new SurveyVoteValidator();

        if($response = $validator->validate())
            return $response;

        $vote = SurveyVote::where('survey_id', '=', request('survey_id'))
            ->where('user_id','=',auth()->id())->first();


        if (!is_null($vote) && $vote->choice_id == request('choice_id')) {
            $this->jsonResponse->setData(200,  'msg.info.survey.vote.already');
            return $this->jsonResponse->getResponse();
        }


        if (!is_null($vote)) {
            $vote->choice_id = request('choice_id');
            $vote->update();
        } else {

            $vote = new SurveyVote();
            $vote->survey_id = request('survey_id');
            $vote->choice_id = request('choice_id');
            $vote->country_id = auth()->user()->country_id;
            $vote->user_id   = auth()->id();

            $vote->save();
        }

        $this->jsonResponse->setData(200,  'msg.info.survey.vote.success');
        return $this->jsonResponse->getResponse();
    }

    public function homeSpecialSurvey(Request $request)
    {
        $country = (new CountryService($request))->getCountry();
        $now = (new Carbon());

        $model = Survey::with([
            'choices.votes',
            'subjects',
            'comments.comments.likes',
            'comments.comments.user.userDetails',
            'comments.user.userDetails',
            'comments.likes.user'
        ])
        ->where('show_on_home', 1)
        ->where('type','=','special')

        ->where('expire_at', '>',$now)
        ->where('start_at', '<', $now)
        ->whereIn('country_id', [auth()->user()->country_id, null])
        ->orderBy('id', 'desc')
        ->first();

        if ($model)
            $model->comments  = self::prepareTree($model->comments);

        $this->jsonResponse->setData(
            200,
            'msg.info.list.surveys',
            $model,
            null, null
        );

        return $this->jsonResponse->getResponse();
    }

    public function homeSurveyApproval(Request $request)
    {
        $country = (new CountryService($request))->getCountry();
        $vote = SurveyVote::groupBy('survey_id')
            ->selectRaw('survey_id, sum(mark) as sum')
            ->where('country_id','=', auth()->user()->country_id ? auth()->user()->country_id : null)
            ->orderBy('sum', 'desc')
            ->first();

        if (!$vote) {
            $this->jsonResponse->setData(
                200,
                'msg.warning.survey.not_found',
                null,
                null,
                null
            );

            return $this->jsonResponse->getResponse();
        }

        $model = Survey::with([
            'choices.votes',
            'subjects',
            'comments.comments.user.userDetails',
            'comments.user.userDetails',
            'comments.comments.likes',
            'comments.likes.user'
        ])
            /*->whereHas('choices', function($q){
                $q->where('status', '=', true);
            })*/
            ->where('status','=', true)
            ->where('type','=','normal');

        if (!is_null($vote)):
            $model->where('id',$vote->survey_id);
        endif;

        $model->where('country_id','=', auth()->user()->country_id ? auth()->user()->country_id : null);

        $model = $model->first();

        if ($model){
            $model->comments  = self::prepareTree($model->comments);
        }


        $this->jsonResponse->setData(
            200,
            'msg.info.list.surveys',
            $model,
            null, null
        );

        return $this->jsonResponse->getResponse();
    }

    private function prepareTree($comments)
    {
        $allComments = [];
        foreach ($comments as $key => $comment){
            self::prepareTree($comment->comments);
            $allComments[] = $comment;
        }

        return $allComments;
    }

    private function addSurveyChoices($survey, $type = null, $request)
    {
        if($survey){
            foreach (request()->json('choices') as $choice) {

                if (is_null($choice['id']) || $choice['id'] == "" ) {
                    $choiceSaved = SurveyChoice::create([
                        'choice_title' => $choice['choice_title'],
                        'survey_id' => $survey->id ?? request('id'),
                        'choice_image' => !empty($choice['choice_image']) ? $choice['choice_image'] : null,
                        'choice_description' => $choice['choice_description']
                    ]);
                }else {
                    $choiceSaved = SurveyChoice::find($choice['id']);
                    $choiceSaved->choice_title = $choice['choice_title'];
                    $choiceSaved->choice_description = $choice['choice_description'];
                    $choiceSaved->choice_image = $choice['choice_image'] ?? null;
                    $choiceSaved->save();
                }

                $country = (new CountryService($request))->getCountry();

                $country = !is_null(auth()->user()->country_id) ? auth()->user()->country_id : ($country ? $country->id : 0);

                $vote = new SurveyVote();
                $vote->survey_id = $survey->id ?? request('id');
                $vote->choice_id = $choiceSaved->id;
                $vote->user_id   = auth()->id();
                $vote->country_id = $country;

                if (!empty($choice['marking'])) {
                    $vote->mark = $choice['marking'];
                }

                $vote->save();
            }
        }
    }

    /**
     * @return mixed
     */
    private function saveSurvey($request)
    {
        if(request('type') === 'special') {
            // self::homeUpdate($request);
        }

        $createData = [
            'title' => request('title'),
            'description' => request('description'),
            'user_id' => auth()->id(),
            'category_id' => request('category_id'),
            'status' => request('type') == 'normal' ? 0 : request('status', 0),
            'type' => request('type'),
            'start_at' => date('Y-m-d', strtotime(request('start_at'))),
            'expire_at' => date('Y-m-d', strtotime(request('expire_at'))),
            'show_on_home' => request('show_on_home'),
            'country_id' => auth()->user()->country_id
        ];
        $survey = Survey::create($createData);
        return $survey;
    }

    /**
     * @param Request $request
     * @param Survey $survey
     * @return array
     */
    public function statusUpdate(Survey $survey)
    {
        $survey->update([
            'status' => (int)request('status')
        ]);

        $this->jsonResponse->setData(200,  'msg.info.category.confirmation', $survey);
        return $this->jsonResponse->getResponse();
    }

    /**
     * @param Request $request
     * @param Survey $survey
     * @return array
     */
    public function showOnHomeUpdate(Survey $survey, Request $request)
    {
        //$this->homeUpdate($request);

        $survey->update([
            'show_on_home' => (int)request('show_on_home')
        ]);


        $this->jsonResponse->setData(200,  'msg.info.category.confirmation', $survey);
        return $this->jsonResponse->getResponse();
    }

    public function homeUpdate($request)
    {
        $country = (new CountryService($request))->getCountry();

        $forUpdate = Survey::where('show_on_home','=', true)
            ->where('country_id', '=', auth()->user()->country_id ? auth()->user()->country_id : null)->first();
        if ($forUpdate) {
            $forUpdate->show_on_home = false;
            $forUpdate->save();
        }

    }

    public function hasSurvey($id)
    {
        $survey = Survey::where('category_id','=',$id)->get();
        $this->jsonResponse->setData(200,  'msg.info.survey.list', $survey);
        return $this->jsonResponse->getResponse();
    }

    public function newest(Request $request)
    {
        $country = (new CountryService($request))->getCountry();
        $model = Survey::where(
            'created_at','>=', Carbon::now()->subDays(30)->toDateTimeString()
        )
            ->where('country_id','=', auth()->user()->country_id ? auth()->user()->country_id : null)
            ->get();

        $this->jsonResponse->setData(200,  'msg.info.survey.list', $model);
        return $this->jsonResponse->getResponse();
    }

    public function topVoted()
    {
        $votes = SurveyVote::groupBy('survey_id')
            ->selectRaw('survey_id, sum(mark) as sum')
            ->orderBy('sum', 'desc')
            ->get();

        $ids = [];

        foreach ($votes as $id) {
            $ids[] = $id->survey_id;
        }

        $surveys = Survey::whereIn('id', $ids)->get();

        $this->jsonResponse->setData(200,  'msg.info.survey.list', $surveys);
        return $this->jsonResponse->getResponse();
    }

    public function fake($id)
    {
        $survey = Survey::with('choices')->find($id);

        $countVoteds = SurveyVote::whereHas('users', function ($relation){
            $relation->where('social_type', '=','fake');
        })
            ->where('survey_id', '=', $id)
            ->where('choice_id', '=', \request('choice_id'))->get();

        $usersId = [];
        foreach ($countVoteds as $countVoted) {
            $usersId[] = $countVoted->user_id;
        }

        if ($countVoteds->count() > \request('count')) {
            foreach ($countVoteds as $countVoted) {
                $users[] = $countVoted->user_id;
                $countVoted->delete();
            }
        }

        $users =  User::whereNotIn('id',$usersId)
            ->where('country_id','=', auth()->user()->country_id)
            ->where('social_type','=','fake')
            ->take(\request('count'))
            ->get();

        foreach ($users as $user) {

            $vote = new SurveyVote();
            $vote->survey_id = $survey->id;
            $vote->choice_id = \request('choice_id');
            $vote->user_id = $user->id;
            $vote->country_id = auth()->user()->country_id;
            if ($survey->type === 'normal') {
                $vote->mark = \request('mark');
            }
            $vote->save();
        }

        $this->jsonResponse->setData(200,  'msg.info.survey.success');
        return $this->jsonResponse->getResponse();
    }

    /**
     * @param Survey $survey
     * @return array
     * @throws \Exception
     */
    public function destroy(Survey $survey)
    {
        //delete survey votes
        $survey->votes()->delete();
        //delete survey choices
        $survey->choices()->delete();
        //delete survey
        $survey->delete();

        $this->jsonResponse->setData(200,  'msg.info.survey.delete');
        return $this->jsonResponse->getResponse();
    }

    public function specialDateRange()
    {
        $all = Survey::select('surveys.start_at', 'surveys.expire_at')->where('country_id','=',auth()->user()->country_id)->get();
        $this->jsonResponse->setData(200, 'msg.success.dateRage.list',$all );
        return $this->jsonResponse->getResponse();
    }
    /**
     * @param null $msg
     * @return array
     */
    private function surveyError($msg = null)
    {
        $this->jsonResponse->setData(200, 'msg.error.occured:', '', [$msg] );
        return $this->jsonResponse->getResponse();
    }

    public function hitSurvey($category, Request $request)
    {
        $country = (new CountryService($request))->getCountry();
        $votes = SurveyVote::groupBy('survey_id')
            ->selectRaw('survey_id, sum(mark) as sum')
            ->where('country_id','=', auth()->user()->country_id ? auth()->user()->country_id : null)
            ->orderBy('sum', 'desc')
            ->get();

        $category = Category::where('slug', $category)->first();

        if (!$category) {
            $this->jsonResponse->setData(400, 'msg.error.list', []);
            return $this->jsonResponse->getResponse();
        }

        foreach ($votes as $vote) {
            $survey = Survey::with([
                'choices.votes',
                'subjects',
                'comments.comments.user.userDetails',
                'comments.user.userDetails',
                'comments.comments.likes',
                'comments.likes.user'
            ])->find($vote['survey_id']);

            if (is_null($survey)) {
                continue;
            }

            if (!is_null($survey) && $survey->category_id == $category->id) {
                $this->jsonResponse->setData(200, 'msg.success.list', $survey);
                return $this->jsonResponse->getResponse();
            }
        }
        $this->jsonResponse->setData(200, 'msg.category_list_is_empty', []);
        return $this->jsonResponse->getResponse();
    }
}
