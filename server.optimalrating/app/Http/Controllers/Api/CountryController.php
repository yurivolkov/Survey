<?php

namespace App\Http\Controllers\Api;

use App\City;
use App\Country;
use App\CustomObjects\ApiPagination;
use App\Role;
use App\Service\CustomJsonResponse;
use App\Service\FakeService;
use App\Service\IpService;
use App\Service\LanguagesService;
use App\User;
use App\Validator\CountryValidator;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Lang;
use Illuminate\Support\Facades\Validator;
use Mockery\Exception;

class CountryController extends Controller
{
    /**
     * @var CustomJsonResponse
     */
    private $jsonResponse;

    public function __construct(CustomJsonResponse $jsonResponse)
    {
        $this->jsonResponse = $jsonResponse;
    }

    public function index()
    {
        $model  = Country::with(['user'])
            ->orderBy(request("sort", 'id'), request("order", 'desc'))
            ->get();

        $pagination = new ApiPagination(request("limit", 20), count($model), request("offset", 0));

        $this->jsonResponse->setData(200,
            'msg.info.success.country.list', $model,null, $pagination->getConvertObject());

        return $this->jsonResponse->getResponse();
    }

    public function store(Request $request)
    {
        $validator = new CountryValidator();

        if($response = $validator->validate())
            return $response;

        $country = Country::create(request()->json()->all());

        //create country admin
        $countryAdmin = User::create([
            'email'=> $request->json('email'),
            'username'=> $request->json('name_en').'_admin',
            'password'=> Hash::make($request->json('password')),
            'country_id' => $country->id
        ]);

        $role_country_admin  = Role::where('name', 'country_admin')->first();

        $countryAdmin->roles()->attach($role_country_admin);

        (new FakeService())->createUser($country);

        return response()->json([
            'code'   => 200,
            'message'=> 'msg.info.country.add',
        ]);
    }

    public function show(Country $country)
    {
        try {
            return response()->json([
                'code' => 200,
                'message' => 'msg.info.country.show',
                'data' => [
                    "set" => $country
                ]
            ]);
        }
        catch (Exception $e){
            return $this->jsonResponse->setData(200,  'msg.error.not_found')->getResponse();
        }
    }

    public function update(Request $request, Country $country)
    {
        //$validator = new CountryValidator();

//        if($response = $validator->validate())
//            return $response;

        $country->update(request()->json()->all());

        if (!is_null($request->json('password'))) {
            $user = $country->user()->first();
            $user->password = bcrypt($request->json('password'));
            $user->save();
        }

        $this->jsonResponse->setData(200,  'msg.info.success.country.update', []);
        return $this->jsonResponse->getResponse();

    }

    //country silme olmamalı bence bu ülkeye bağlı bir
    //sürü anket user vs data olacağından bu işlem sorunlar doğuracaktır.
    // Passive e alma şeklinde yapılabilir
    public function destroy(Request $request, Country $country)
    {
        $country->delete();

        // $country->update(['status'=>'passive']);

        return $this->jsonResponse->setData(200,   'msg.info.success.country.delete')->getResponse();
    }

    /**
     * @param Country $country
     * @return array
     */
    public function citiesOfCountry(Country $country)
    {
        $model = City::where('country_id','=', $country->id)->get();

        $this->jsonResponse->setData(200,
            'msg.info.success.city.list',
            $model,
            null,
            null);

        return $this->jsonResponse->getResponse();
    }

    /**
     * for country languages without permission
     */
    public function languages(Request $request)
    {
        $countries = Country::orderBy('name')->select('id','name','flag','name_en','code')->get();

        $IP = $request->server->get('REMOTE_ADDR');

        $IPService = (new IpService())->getCountryData($IP);

        //$languages = (new LanguagesService($countries, $IPService))->languagesCountries();

        return $this->jsonResponse->setData(200,   'msg.info.success.country.list', $countries)->getResponse();
    }
}
