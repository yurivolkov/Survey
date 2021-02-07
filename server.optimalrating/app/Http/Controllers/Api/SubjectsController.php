<?php

namespace App\Http\Controllers\Api;

use App\CustomObjects\ApiPagination;
use App\Service\CustomJsonResponse;
use App\Service\KeywordService;
use App\Subject;
use App\Validator\SubjectValidator;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Http\Response;

class SubjectsController extends Controller
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
     * Display a listing of the resource.
     *
     * @return array
     */
    public function index()
    {
        $model = Subject::all();

        $pagination = new ApiPagination(request("limit", 20), count($model), request("offset", 0));

        $this->jsonResponse->setData(
            200,
            'msg.info.list.subjects', $model, null, $pagination->getConvertObject()
        );

        return $this->jsonResponse->getResponse();
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param Request $request
     * @return array
     */
    public function store(Request $request)
    {
        $validator = new SubjectValidator();

        if($response = $validator->validate())
            return $response;

        $subject = new Subject();
        $subject->title = $request->json('title');
        $subject->translate_key = 'subject.'.str_slug($subject->title);
        $keyword = new KeywordService($subject->translate_key, $subject->title, 'subject');
        $subject->save();
        if($subject){
            $this->jsonResponse->setData(200,  'msg.info.subject.created', $subject);
            return $this->jsonResponse->getResponse();
        }

    }

    /**
     * Display the specified resource.
     *
     * @param Subject $subject
     * @return array
     */
    public function show(Subject $subject)
    {
        $this->jsonResponse->setData(200,   'msg.info.success.subject.show', $subject);
        return $this->jsonResponse->getResponse();
    }

    /**
     * Update the specified resource in storage.
     *
     * @param Request $request
     * @param Subject $subject
     * @return array
     */
    public function update(Request $request, Subject $subject)
    {
        //update the subject title if needed
        $subject->title = $request->json('title');
        $subject->translate_key = 'subject.'.str_slug($subject->title);

        $updated = $subject->update();

        $keyword = new KeywordService($subject->translate_key, $subject->title, 'subject');

        if($updated){
            $this->jsonResponse->setData(200,  'msg.subject.updated', $subject);
            return $this->jsonResponse->getResponse();
        }
    }

    public function subjectHasSurvey($slug)
    {
        $survey = Subject::with([
            'surveys.choices.votes',
            'surveys.comments.comments.user.userDetails',
            'surveys.comments.user.userDetails',
            'surveys.comments.likes.user'
        ])->where('slug','=', $slug)->first();

        $this->jsonResponse->setData(200,  'msg.subject.list', $survey);
        return $this->jsonResponse->getResponse();
    }
    /**
     * Remove the specified resource from storage.
     *
     * @param Subject $subject
     * @return array
     * @throws \Exception
     */
    public function destroy(Subject $subject)
    {
        $deleted = $subject->delete();

        if($deleted){
            $this->jsonResponse->setData(200,  'msg.subject.deleted', $subject);
            return $this->jsonResponse->getResponse();
        }

    }
}
