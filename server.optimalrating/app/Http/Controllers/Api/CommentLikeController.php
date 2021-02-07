<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Repositories\CommentLikeRepository;
use App\Service\CustomJsonResponse;
use Illuminate\Http\Request;

class CommentLikeController extends Controller
{
    public function store(Request $request, CustomJsonResponse $jsonResponse)
    {
        $this->validate($request, [
            'comment_id' => 'required'
        ]);

        $repository = new CommentLikeRepository();

        $commentLike = $repository->save($request);

        if(!$commentLike){
            $response = $jsonResponse->setData(200, 'msg.info.like.created', '', 'msg.err.like.exist');
            return $response->getResponse();
        }

        //return comment likes count
        $likeCount = $repository->getNumberOfLike($commentLike);

        $commentLike->likeCount = $likeCount;

        $response = $jsonResponse->setData(200, 'msg.info.like.created', $commentLike);

        return $response->getResponse();
    }
}
