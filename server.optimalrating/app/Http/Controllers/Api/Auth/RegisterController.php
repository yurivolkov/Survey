<?php

namespace App\Http\Controllers\Api\Auth;

use App\Country;
use App\Role;
use App\Service\CustomJsonResponse;
use App\Service\IpService;
use App\Service\SmsService;
use App\Service\UserPrivacyService;
use App\SmsVerify;
use App\UserDetail;
use Carbon\Carbon;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Validator;
use Laravel\Passport\Client;
use App\User;

class RegisterController extends Controller
{

    private $client;
    /**
     * @var CustomJsonResponse
     */
    private $response;

    public function __construct(CustomJsonResponse $response)
    {
        $this->client  = Client::find(2);
        $this->response = $response;
    }

    public function register(Request $request, CustomJsonResponse $customJsonResponse)
    {

        $validator = Validator::make($request->json()->all(), [
            'email' => 'required|email',
            "firstname" => 'required',
            "lastname" => 'required',
            'password' => 'required',
            'sms_verify_code' => 'required'
        ]);

        if(!$validator->passes()){
            $customResponse = $customJsonResponse->setData(400,  'msg.error.bad_request','', $validator->errors()->all());
            return $customResponse->getResponse();
        }

        //check the sms verify code
        $check = SmsVerify::where('sms', $request->json('sms_verify_code'))->where('phone_number', $request->json('phone_number'))->where('expired','>', Carbon::now())->first();

        if(is_null($check)){
            $customResponse = $customJsonResponse->setData(400,  'msg.error.code.invalid_or_expired', '', ['error'=>'Sms verify error']);
            return $customResponse->getResponse();
        }

      /*  $IP = $request->server->get('REMOTE_ADDR');

        $countryData = (new IpService())->getCountryData($IP);

        $country = Country::where('code', $countryData->country_code)->first();

        if(!$country){

            $country = new Country();

            $country->name_en = $countryData->country;
            $country->name    = $countryData->country;
            $country->flag    = $countryData->flag;
            $country->code    = $countryData->country_code;
            $country->status  = 'active';

            $country->save();

        }*/

        if(User::whereEmail($request->json('email'))->first()) {
            $customResponse = $customJsonResponse->setData(409,  'msg.error.email_already_used','', $validator->errors()->all());
            return $customResponse->getResponse();
        }

        if(UserDetail::where('phone_number','=',$request->json('phone_number'))->first()) {
            $customResponse = $customJsonResponse->setData(409,  'msg.error.phone_number_already_used','', $validator->errors()->all());
            return $customResponse->getResponse();
        }
        $country = $request->json('country');
        $country = Country::where('code','=', $country)->first();
        $user = User::create([
            'firstname' => $request->json('firstname'),
            'middlename'=> $request->json('middlename'),
            'username'  => $this->getUserName(),
            'lastname'  => $request->json('lastname'),
            'email'     => $request->json('email'),
            'password'  => Hash::make($request->json('password')),
            'country_id'=>$country ? $country->id : null
        ]);

        (new UserPrivacyService())->userPrivacyCreate($user->id);

        $user->userDetails()->create([
            'phone_number' => $request->json('phone_number'),
            //'birthdate' => '2000-01-01'
        ]);

        $role = Role::where('name', 'user')->firstOrFail();

        $user->roles()->attach($role);

        $params = [
            'grant_type' => 'password',
            'client_id' => $this->client->id,
            'client_secret' => $this->client->secret,
            'username' => $request->json('email'),
            'password' => $request->json('password'),
            'scope' => '',
        ];

        $request->request->add($params);

        $proxy = Request::create('oauth/token', 'POST');

        return Route::dispatch($proxy);


    }

    public function checkSmsVerify(Request $request)
    {
        $check = SmsVerify::where('sms', $request->json('sms_verify_code'))
            ->where('phone_number', $request->json('phone_number'))
            ->where('expired','>', Carbon::now())->first();

        if(is_null($check)){
            $this->response->setData(400,  'msg.error.code.verify_code_not_correct', '', ['error'=>'Sms verify error']);
            return $this->response->getResponse();
        }

        $this->response->setData(200,  'msg.success.code.correct');
        return $this->response->getResponse();
    }

    public function sendSmsVerify(Request $request, CustomJsonResponse $customJsonResponse){

        $to = $request->json('phone_number');

        if(!$to){
            $customResponse = $customJsonResponse->setData(411,  'msg.error.phone_number.required', []);
            return $customResponse->getResponse();
        }

        $smsService = new SmsService();

        $smsResponse = $smsService->sendSmsVerify($to);

        if(!$smsResponse['status']){
            $customResponse = $customJsonResponse->setData(400,  'msg.error.send.verify.sms.error', []);
            return $customResponse->getResponse();
        }


        $sms = new SmsVerify();

        $sms->phone_number = $to;
        $sms->sms          = $smsResponse['code'];
        $sms->token        = Carbon::now()->timestamp;
        $sms->sms_type     = 'verify';
        $sms->status       = 'p';
        $sms->expired      = Carbon::now('GMT+3')->addHour(1);

        $sms->save();

        $customResponse = $customJsonResponse->setData(200, 'msg.info.send.verify.sms.success', []);
        return $customResponse->getResponse();
    }

    private function getUsername()
    {
        return $this->getSefUsername(request()->json('firstname') .' '. request()->json('lastname'));
    }

    private function getSefUsername($url)
    {
        $turkcefrom = array("/Ğ/","/Ü/","/Ş/","/İ/","/Ö/","/Ç/","/ğ/","/ü/","/ş/","/ı/","/ö/","/ç/");

        $turkceto = array("G","U","S","I","O","C","g","u","s","i","o","c");

        $url = preg_replace("/[^0-9a-zA-ZÄzÜŞİÖÇğüşıöç]/"," ",$url);
        // Türkçe harfleri ingilizceye çevir
        $url = preg_replace($turkcefrom,$turkceto,$url);
        // Birden fazla olan boşlukları tek boşluk yap
        $url = preg_replace("/ +/"," ",$url);
        // Boşukları - işaretine çevir
        $url = preg_replace("/ /","_",$url);
        // Tüm beyaz karekterleri sil
        $url = preg_replace("/\s/","",$url);
        // Karekterleri küçült
        $url = strtolower($url);
        // Başta ve sonda - işareti kaldıysa yoket
        $url = preg_replace("/^-/","",$url);

        $url = preg_replace("/-$/","",$url);

        return $url. '_'. time();
    }
}
