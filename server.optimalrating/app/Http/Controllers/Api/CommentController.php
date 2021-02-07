<?php

namespace App\Http\Controllers\Api;

use App\Category;
use App\Comment;
use App\CustomObjects\ApiPagination;
use App\Service\CustomJsonResponse;
use App\Survey;
use App\Validator\CategoryValidator;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class CommentController extends Controller
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
     * @return array
     */
    public function comments()
    {
        if(auth()->user()->hasRole('super_admin')){
            $model = Comment::where('country_id', null)->with(['country','commentable','user']);
        }
        else{
            $model = Comment::where('country_id', auth()->user()->country_id)->with(['country','commentable','user']);
        }

        $pagination = new ApiPagination(request("limit", 20), count($model->get()), request("offset", 0));

        $this->jsonResponse->setData(200, 'msg.info.list.comments', $model->get(), null, null);

        return $this->jsonResponse->getResponse();
    }


    public function store()
    {
        $country_id = 0;
        if(request()->json('survey_id')){
            $model = Survey::find(request()->json('survey_id'));
            $country_id = $model->country_id;
        }else{
            $model = Comment::find(request()->json('comment_id'));
        }

        $comment = $model->comments()->create([
            'body' => request()->json('body'),
            'user_id' => auth()->id(),
            'country_id' => !$country_id ? $model->country_id :  auth()->user()->country_id
        ]);

        if($comment){
            $this->jsonResponse->setData(200,  'msg.info.survey.comment.created', $comment);
            return $this->jsonResponse->getResponse();
        }
    }


    /**
     * Update the specified resource in storage.
     *
     * @param Request $request
     * @param Comment $comment
     * @return array|bool
     */
    public function update(Request $request, Comment $comment)
    {
        $reqAll = $request->json()->all();

        $comment->update($reqAll);

        $this->jsonResponse->setData(200,  'msg.info.success.comment.update', $comment);
        return $this->jsonResponse->getResponse();
    }

    public function destroy(Request $request, Comment $comment)
    {
        $comment->delete();

        return $this->jsonResponse->setData(200,   'msg.info.success.comment.delete')->getResponse();
    }

    public function getSurveyComments(Survey $survey)
    {
        $model  = self::prepareTree($survey->comments);

        $pagination = new ApiPagination(request("limit", 20), count($model), request("offset", 0));

        $this->jsonResponse->setData(
            200,
            'msg.info.list.comments', $model, null, $pagination->getConvertObject()
        );

        return $this->jsonResponse->getResponse();
    }

    public function prepareTree($comments)
    {
        $allComments = [];
        foreach ($comments as $key => $comment){
            self::prepareTree($comment->comments);
            $allComments[] = $comment;
        }

        return $allComments;
    }


    public function changeStatus(Comment $comment)
    {
        $model = $comment->update([
            'status' => request()->json('status')
        ]);

        $this->jsonResponse->setData(200, 'msg.info.list.comment', $model);

        return $this->jsonResponse->getResponse();
    }

}
