<?php

namespace App\Http\Controllers\Api;

use App\Service\CustomJsonResponse;
use App\Survey;
use App\SurveyChoice;
use App\SurveyVote;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class SurveyVotesController extends Controller
{
    /**
     * @var CustomJsonResponse
     */
    private $customJsonResponse;

    public function __construct(CustomJsonResponse $customJsonResponse)
    {
        $this->customJsonResponse = $customJsonResponse;
    }

    /**
     * @param Survey $survey
     * @return array
     */
    public function vote(Survey $survey)
    {
        //validate survey vote
        //save survey vote
        $choice =  SurveyChoice::find(request()->json('choice_id'));
        $choice->votes()->create([
            'user_id' => auth()->id()
        ]);

        return $this->customJsonResponse->setData(200, 'msg.info.survey_vote.created', $survey)->getResponse();
    }

    /**
     * @param $survey
     * @return array
     * @throws \Exception
     */
    public function submitVote($survey)
    {
        $choice = self::surveyVote($survey, \request('choice_id'));

        if (!is_null($choice)) {
            $choice->delete();
        }

        $user = \auth()->user();
        if ($user->status !== 'approved') {
            return $this->customJsonResponse->setData(400,'msg.info.not_approved')->getResponse();
        }

        $vote = new SurveyVote();
        $vote->survey_id = $survey;
        $vote->user_id = auth()->id();

        $vote->choice_id = \request('choice_id');
        $vote->mark = \request('mark');

        $vote->save();

        return $this->customJsonResponse->setData(200, 'msg.info.survey_vote.created', $vote)->getResponse();
    }

    /**
     * @param $survey
     * @param $choiceId
     * @param CustomJsonResponse $jsonResponse
     * @return array
     */
    public function checkVote($survey, $choiceId, CustomJsonResponse $jsonResponse)
    {
        $choice = self::surveyVote($survey, $choiceId);

        if (!is_null($choice)) {
            $jsonResponse->setData(200,'msg.info.already_vote', $choice);
            return $jsonResponse->getResponse();
        }

        return $this->customJsonResponse->setData(400,'msg.info.not_found')->getResponse();
    }

    /**
     * @param $survey
     * @param $choiceId
     * @param CustomJsonResponse $jsonResponse
     * @return array
     * @throws \Exception
     */
    public function cancelVote($survey, $choiceId, CustomJsonResponse $jsonResponse)
    {
        $choice = self::surveyVote($survey, $choiceId);

        if (!is_null($choice)) {
            $choice->delete();
            $jsonResponse->setData(200,'msg.info.already_vote', $choice);
            return $jsonResponse->getResponse();
        }

        return $this->customJsonResponse->setData(400,'msg.info.not_found')->getResponse();
    }

    /**
     * @param $survey
     * @param $choice
     * @return SurveyVote|\Illuminate\Database\Eloquent\Builder
     */
    private function surveyVote($survey, $choice)
    {
        $choice = SurveyVote::with('choice')
            ->where('choice_id','=',$choice)
            ->where('survey_id','=',$survey)
            ->where('user_id','=', auth()->id());
        return $choice->first();
    }
}
