<?php

namespace App\Http\Controllers\Api;

use App\Country;
use App\CustomObjects\CustomJsonResponse;
use App\Http\Controllers\Controller;
use App\Keyword;
use App\Service\CacheService;
use App\Translation;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\Yaml\Yaml;

class TranslationsController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return array
     */
    public function index()
    {

        $customResponse = new CustomJsonResponse(200,  'msg.info.keyword.list', []);

        return $customResponse->getResponse();
    }
    /**
     * Store a newly created resource in storage.
     *
     * @param \Illuminate\Http\Request $request
     * @return array
     */
    public function store(Request $request)
    {

        $auth = Auth::user();
        $country = Country::find($auth->country_id);

        $model = new Translation();

        $model->country_code = $country->code;
        $model->keyword_id = $request->get('id');
        $model->translation = ($request->get('translation'))['translation'];

        $model->save();

        (new CacheService())->keywordCacheCreate();

        $customResponse = new CustomJsonResponse(
            200,

            'msg.info.translation.save',
            $model
        );

        return $customResponse->getResponse();
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param \Illuminate\Http\Request $request
     * @return array
     */
    public function update(Request $request, Keyword $translation)
    {
        $translation = $translation->translation()->first();

        $reqData = $request->get('translation');

        $translation->translation = $reqData['translation'];

        $translation->update();

        (new CacheService())->keywordCacheCreate();
        $customResponse = new CustomJsonResponse(200,  'msg.info.translation.save');

        return $customResponse->getResponse();
    }

    /**
     * @return array
     */
    public function yamlParseKeyword(){

        $yaml = Yaml::parseFile(base_path().'/documentation/message.yml');

        $keyword = Keyword::all();

        foreach ($yaml as $key => $value){

        //  if ($keyword->where('key','=', $key)->count())  continue;

          $pre = explode('.',$key);


          $model = new Keyword();

          $model->key = $key;
          $model->default = $value['tr'];
          $model->type = $pre[0] === 'msg' ? 'messages' : ($pre[0] === 'lbl' ? 'label' : 'input');

          $model->save();
        }

        $customResponse = new CustomJsonResponse(200,  'msg.info.keyword.created');

        return $customResponse->getResponse();
    }
}
