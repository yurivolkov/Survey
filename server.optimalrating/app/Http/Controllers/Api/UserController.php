<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Service\CustomJsonResponse;
use App\Service\MailService;
use App\Service\UserService;
use App\SmsVerify;
use App\User;
use App\UserToken;
use App\UserDetail;
use App\UserPrivacySetting;
use App\Validator\UserValidator;
use App\Validator\UserDetailsVerifyValidator;
use Carbon\Carbon;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Symfony\Component\HttpFoundation\Request;

class UserController extends Controller
{
    private $customJsonResponse;

    public function __construct(CustomJsonResponse $customJsonResponse)
    {
        $this->customJsonResponse = $customJsonResponse;
    }

    public function userProfile($user)
    {
        $user = User::with(['userDetails','country', 'city'])->where('username','=', $user)->first();
        $this->customJsonResponse->setData(200,  'msg.success.user.view', $user);
        return $this->customJsonResponse->getResponse();
    }

    public function updateProfile(Request $request)
    {
        $user = \auth()->user();
        $userDetails = $user->userDetails()->first();
        $req = $request->request->get('user');

        $userValidator = Validator::make($req, [
            'firstname' => 'required',
            'lastname' => 'required',
            'country_id' => 'required',
            'city_id' => 'required'
        ]);

        $userDetailsValidator = Validator::make($req['user_details'], [
            'birthdate' => 'required',
            'gender' => 'required',
            'education' => 'required',
            'city_id' => 'required'
        ]);

        if (!$userValidator->fails() && ($user->status === 'disapproved' || $user->status === 'pendingapproved')) {
            $req['status'] = 'pendingapproved';
        }
        else {
            if (!$userValidator->fails()
                && !$userDetailsValidator->fails()
                && (bool)$user->phone_verify
                && $user->status !== 'freeze'){
                $req['status'] = 'approved';
            }
        }

        if(!is_null($request->request->get('user')['national_image'])
            && !is_null($request->request->get('user')['portrait_image'])
            && $user->status === 'freeze'
        ) {
            $req['status'] = 'pendingFreeze';
        }

        if (!$userValidator->fails() && $user->status == 'pending'){
            $req['status'] = 'approved';
        }
        unset($req['user_details']['email']);
        $userDetails->update($req['user_details']);
        $user->update($req);


        $this->customJsonResponse->setData(
            200,
            'msg.success.user.update',
            User::where('id',\auth()->id())->with('userDetails')->first()
        );
        return $this->customJsonResponse->getResponse();
    }

    public function profileImage(Request $request)
    {
        $user = \auth()->user();

        $details = $user->userDetails()->first();


        $details->profile_image = $request->request->get('image');

        $details->save();

        $customResponse = $this->customJsonResponse->setData(200,  'msg.success.profile_image.update', $user);
        return $customResponse->getResponse();
    }

    public function nationalImage(Request $request)
    {
        $user = \auth()->user();

        $user->national_image = $request->request->get('image');
        $user->save();

        $customResponse = $this->customJsonResponse->setData(200,  'msg.success.national_image.update', $user);
        return $customResponse->getResponse();
    }

    public function portraitImage(Request $request)
    {
        $user = \auth()->user();
        $user->portrait_image = $request->request->get('image');
        $user->save();

        $customResponse = $this->customJsonResponse->setData(200,  'msg.success.portrait_image.update', $user);
        return $customResponse->getResponse();
    }

    public function getProfile()
    {
        $user = User::with('userDetails')->find(\auth()->id());
        $this->customJsonResponse->setData(200,  'msg.success.user.view', $user);
        return $this->customJsonResponse->getResponse();
    }

    public function savePhoneNumber()
    {
        $user = \auth()->user();
        $userDetails = $user->userDetails()->first();

        $smsService = SmsVerify::where('phone_number','=',\request('to'))
            ->where('sms', '=', \request('verify_code'))->first();

        if(!$smsService) {
            $this->customJsonResponse->setData(400,  'msg.error.send.verify.sms.error', '', ['error'=>'Sms verify error']);
            return $this->customJsonResponse->getResponse();
        }

        $user->phone_verify = 1;
        $user->save();

        $userDetails->phone_number = \request('to');
        $userDetails->update();

        $this->customJsonResponse->setData(200,  'msg.success.update.phone_number');
        return $this->customJsonResponse->getResponse();
    }

    public function userPrivacySettings()
    {
        $user = User::with(
            [
                'privacySettings.privacy',
                'privacySettings.privacy.options',
                'privacySettings.option'
            ]
        )->find(\auth()->id());

        $this->customJsonResponse->setData(200,  'msg.success.user.view', $user->privacySettings);
        return $this->customJsonResponse->getResponse();
    }

    public function userPrivacySettingsChange()
    {
        $user = \auth()->user();

        $privacy = UserPrivacySetting::find(\request('privacy'));

        if ($privacy->user_id != $user->id) {
            $this->customJsonResponse->setData(400,  'msg.error.not_privacy');
            return $this->customJsonResponse->getResponse();
        }
        $privacy->option_id = \request('option');
        $privacy->update();

        $this->customJsonResponse->setData(200,  'msg.success.privacy_update', $user->privacySettings);
        return $this->customJsonResponse->getResponse();
    }

    public function passwordChange()
    {
        $user = \auth()->user();
        $user->password = bcrypt(\request('password'));
        $user->save();
        $this->customJsonResponse->setData(200,  'msg.success.password_change');
        return $this->customJsonResponse->getResponse();
    }

    public function checkPassword()
    {
        $user = \auth()->user();

        if (!Hash::check(\request('password'), $user->password)) {
            $this->customJsonResponse->setData(400,  'msg.error.password');
            return $this->customJsonResponse->getResponse();
        }

        $this->customJsonResponse->setData(200,  'msg.success.correct');
        return $this->customJsonResponse->getResponse();
    }

    public function deleteMyAccount()
    {
        $user = \auth()->user();

        $delete = new UserToken();

        $delete->user =  \auth()->id();
        $delete->expire_at = Carbon::now()->addWeek(1);
        $delete->token = md5(Carbon::now()->timestamp);

        $delete->save();

        $mail = new MailService();

        $mail->sendMail($delete->token, $user, 'approve-delete-profile', 'delete_profile');

        $this->customJsonResponse->setData(200,  'msg.success.delete_profile');
        return $this->customJsonResponse->getResponse();
    }

    public function ApproveDeleteProfile($token)
    {
        $deleteToken = UserToken::where('token','=', $token)->first();

        if (is_null($deleteToken)) {
            $this->customJsonResponse->setData(400,  'msg.error.token_error');
            return $this->customJsonResponse->getResponse();
        }

        $user = User::find($deleteToken->user);

        if (!is_null($user)) {
            $userService = new UserService();
            $userService->deleteUser($user);
        }

        $this->customJsonResponse->setData(200,  'msg.success.delete_profile');
        return $this->customJsonResponse->getResponse();
    }

    public function resetMyPassword()
    {
        $userWithEmail = User::where('email','=', \request('user'))->first();
        $userWithPhoneNumber = UserDetail::where('phone_number','=', \request('user'))->first();

        $userWithPhoneNumber = !is_null($userWithPhoneNumber) ? $userWithPhoneNumber->user()->first() :null;

        $user = $userWithEmail ?? $userWithPhoneNumber;

        if (is_null($user)) {
            $this->customJsonResponse->setData(400,  'msg.error.phone_number_or_email_not_found');
            return $this->customJsonResponse->getResponse();
        }

        $delete = new UserToken();

        $delete->user =  $user->id;
        $delete->expire_at = Carbon::now()->addWeek(1);
        $delete->token = md5(Carbon::now()->timestamp);

        $delete->save();

        $mail = new MailService();

        $mail->sendMail($delete->token, $user, 'reset-password', 'reset_password');

        $this->customJsonResponse->setData(200,  'msg.success.sended_reset_password_code');
        return $this->customJsonResponse->getResponse();
    }

    public function newPassword($token)
    {
        $deleteToken = UserToken::where('token','=', $token)->first();

        if (is_null($deleteToken)) {
            $this->customJsonResponse->setData(400,  'msg.error.token_error');
            return $this->customJsonResponse->getResponse();
        }

        $user = User::where('id','=', $deleteToken->user)->first();

        $user->password = bcrypt(\request('password'));

        $user->save();

        $this->customJsonResponse->setData(200,  'msg.success.password_changed');
        return $this->customJsonResponse->getResponse();
    }

    public function verifyEmailChange($token)
    {
        $deleteToken = UserToken::where('token','=', $token)->first();

        if (is_null($deleteToken)) {
            $this->customJsonResponse->setData(400,  'msg.error.token_error');
            return $this->customJsonResponse->getResponse();
        }

        $user = User::where('id','=', $deleteToken->user)->first();

        $user->email = $deleteToken->new_data;

        $user->save();

        $this->customJsonResponse->setData(200,  'msg.success.email_changed');
        return $this->customJsonResponse->getResponse();
    }

    public function emailChange()
    {
        if (is_null(\request('email'))) {
            $this->customJsonResponse->setData(400,  'msg.error.new_email_address_required');
            return $this->customJsonResponse->getResponse();
        }

        if(User::whereEmail(\request('email'))->first()) {
            $customResponse = $this->customJsonResponse->setData(409,  'msg.error.email_already_used');
            return $customResponse->getResponse();
        }


        $user = \auth()->user();
        $delete = new UserToken();
        $delete->user =  $user->id;
        $delete->expire_at = Carbon::now()->addWeek(1);
        $delete->old_data = $user->email;
        $delete->new_data = \request('email');
        $delete->token = md5(Carbon::now()->timestamp);
        $delete->save();


        $mail = new MailService();

        $mail->sendMail($delete->token, $user, 'email-change', 'change_email');

        $this->customJsonResponse->setData(200,  'msg.success.sended_email_change_token');
        return $this->customJsonResponse->getResponse();
    }
}
