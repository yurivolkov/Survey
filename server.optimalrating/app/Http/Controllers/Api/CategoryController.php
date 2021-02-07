<?php

namespace App\Http\Controllers\Api;

use App\Category;

use App\Country;
use App\Http\Controllers\Controller;
use App\Keyword;
use App\Service\CountryService;
use App\Service\CustomJsonResponse;
use App\Service\IpService;
use App\Service\KeywordService;
use App\Service\SmsService;
use App\Validator\CategoryValidator;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CategoryController extends Controller
{
    /**
     * @var CustomJsonResponse
     */
    private $jsonResponse;

    public function __construct(CustomJsonResponse $jsonResponse)
    {
        //$this->authorizeResource(Category::class, 'category');
        $this->jsonResponse = $jsonResponse;
    }

    /**
     * Display a listing of the resource.
     *
     * @return array
     */
    public function index()
    {
        if(auth()->user()->hasRole('super_admin')){
            $category = Category::where("parent", 0)->get();
        }
        else{
            $category = Category::where("parent", 0)->where('status', 'active')->get();
            $category =  self::prepareTree($category, request('status', 'active'));
        }

        $this->jsonResponse->setData(200,  'msg.info.category.list', $category);
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
        $requestJsonAll = $request->json()->all();

        $requestJsonAll['country_id'] = auth()->user()->country_id;
        if(auth()->user()->hasRole('super_admin'))
            $requestJsonAll['country_id'] = null;


        $requestJsonAll['code'] = 'category.'.str_slug($requestJsonAll['name']);

        new KeywordService($requestJsonAll['code'], $requestJsonAll['name'], 'category');

        $validator = new CategoryValidator();

        if($response = $validator->validate())
            return $response;

        $category = Category::create($requestJsonAll);

        if($category){
            $this->jsonResponse->setData(200,  'msg.info.category.created', $category);
            return $this->jsonResponse->getResponse();
        }

        return $this->categoryError();
    }

    /**
     * Display the specified resource.
     *
     * @param $id
     * @return array
     */
    public function show($id)
    {
        $category = Category::with(['parent','user'])->where('id','=',$id)->get();

        $this->jsonResponse->setData(200,  'msg.info.success.category.show', $category);
        return $this->jsonResponse->getResponse();
    }

    /**
     * Update the specified resource in storage.
     *
     * @param Request $request
     * @param Category $category
     * @return array|bool
     */
    public function update(Request $request, Category $category)
    {
        $reqAll = $request->json()->all();

        $validator = new CategoryValidator();

        if($response = $validator->validate())
            return $response;

        $category->update($reqAll);

        $this->jsonResponse->setData(200,  'msg.info.success.category.update', $category);
        return $this->jsonResponse->getResponse();
    }

    public function statusUpdate(Request $request, Category $category, SmsService $smsService)
    {
        $reqAll = $request->json()->all();

        $category->update($reqAll);

        $smsService->categoryConfirmMessage($category);

        $this->jsonResponse->setData(200,  'msg.info.category.confirmation', $category);
        return $this->jsonResponse->getResponse();
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param Category $category
     * @return array category silme olmamalı bence kategoriye bağlı birçok alt kategori ve
     * category silme olmamalı bence kategoriye bağlı birçok alt kategori ve
     * bunlara bağlı anketler olabilir
     * Passive e alma şeklinde yapılabilir
     */
    public function destroy(Category $category)
    {
        foreach ($category->getChildren() as $children){
            $children->delete();
        }

        $keyword = Keyword::where('key','=',$category->code);

        $keyword->delete();

        $category->delete();

        $this->jsonResponse->setData(200,  'msg.info.success.category.delete', []);
        return $this->jsonResponse->getResponse();
    }

    public function userCategoryCreate(Request $request)
    {

        $reqAll = $request->request->all();

        if (empty($reqAll['parent'])) {
            $this->jsonResponse->setData(400,  'msg.error.category.not_found');
            return $this->jsonResponse->getResponse();
        }
        $parent = Category::find($reqAll['parent']);
        if (!$parent) {
            $this->jsonResponse->setData(400,  'msg.error.category.not_found');
            return $this->jsonResponse->getResponse();
        }

        $code = str_slug($reqAll['name']);

        $category = new Category();

        $category->name = $reqAll['name'];
        $category->slug = 'category.'.$code;;
        $category->code = 'category.'.$code;;
        $category->parent = $reqAll['parent'];
        $category->status = 'pending';
        $category->country_id = Auth::user()->country_id;
        $category->user_id = Auth::id();
        $category->save();


        $key = Keyword::where('key', '=','category.'.$code);
        $method = 'update';
        if (!$key) {
            $key = new Keyword();
            $method = 'save';
        }

        $key->key = 'category.'.$code;
        $key->default = $reqAll['name'];
        $key->type = 'category';

        /** method dzenlencek */
       // $key->save();

        $this->jsonResponse->setData(200,  'msg.info.category.created_and_pending');
        return $this->jsonResponse->getResponse();
    }

    /**
     * @param $categories
     * @param $status
     * @return array
     */
    private function prepareTree($categories, $status)
    {
        $allCategory = [];
        foreach ($categories as $key => $category){
            $child = Category::where("parent", $category->id)->where('status', $status)->get();
            $category->children = self::prepareTree($child, $status);
            $allCategory[] = $category;//parent::snakeCaseToCamelCase($category);
        }

        return $allCategory;
    }

    /**
     * @return array
     */
    private function categoryError()
    {
        $this->jsonResponse->setData(200, 'msg.error.occured:', []);
        return $this->jsonResponse->getResponse();
    }

    /**
     * @param Request $request
     * @return array
     */
    public function pending(Request $request)
    {
        $categories = Category::where("parent",0)->get();

        $category =  self::prepareTreeForCountryAdmin($categories, 'pending', $request);

        $this->jsonResponse->setData(200,  'msg.info.category.list', $category);
        return $this->jsonResponse->getResponse();
    }

    /**
     * @param Request $request
     * @return array
     */
    public function categoryTree(Request $request)
    {
        $categories = Category::where("parent", 0)->whereStatus('active')->get();

        $categories =  self::getSubCategories($categories, $request);

        $this->jsonResponse->setData(200,  'msg.info.category.list', $categories);

        return $this->jsonResponse->getResponse();
    }

    /**
     * @param $categories
     * @param $request
     * @return array
     */
    public function getSubCategories($categories, $request)
    {
        $allCategories = [];
        $isThereCountry = true;
        if (auth()->user())
            $isThereCountry = (!auth()->user()->hasRole('super_admin')|| !auth()->user()->hasRole('country_admin'));
        $country = (new CountryService($request))->getCountry();
        foreach ($categories as $key => $category){
            $category->children = $category->getChildren('active', $isThereCountry, $country);
            $allCategories[] = $category;
        }
        return $allCategories;
    }

    /**
     * @param $categories
     * @param string $status
     * @return array
     */
    public function prepareTreeForCountryAdmin($categories, $status='pending', Request $request)
    {
        $allCategory = [];

        $countryId = null;
        if (Auth::user() && Auth::user()->country_id){
            $countryId = Auth::user()->country_id;
        }else{
            $IP = $request->server->get('REMOTE_ADDR');

            $IPService = (new IpService())->getCountryData($IP);

            $country = Country::where('code','=',$IPService->country_code)->first();

            $countryId = $country->id;
        }

        foreach ($categories as $key => $category){
            $child = Category::where("parent", $category->id)->where('status', $status)->where('country_id',$countryId)->get();
            $category->children = self::prepareTreeForCountryAdmin($child, $status, $request);
            $allCategory[] = $category;//parent::snakeCaseToCamelCase($category);
        }

        return $allCategory;
    }

    public function getChildren(Category $category)
    {
        return $this->jsonResponse->setData(200, 'msg.info.category.list', $category->getChildren())->getResponse();
    }

    public function categoryDetail($category)
    {
        $categories = Category::with(['surveys.choices.votes'])->where("slug",$category)->first();
        return $this->jsonResponse->setData(200, 'msg.info.category.list', $categories)->getResponse();
    }
}
