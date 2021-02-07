<?php


namespace App\Service;

use App\Keyword;
use App\Translation;
use GuzzleHttp\Client;

class SmsService
{

    private $serviceUrl;
    private $client;

    /**
     * SmsService constructor.
     */
    public function __construct()
    {
        $this->client     = new Client();
        $this->serviceUrl = "https://pm8q8.api.infobip.com/sms/2/text/advanced";
        $this->apiKey     = base64_encode('uniter:Mrtdnlr11');
    }

    public function sendSmsVerify($phone)
    {
        $verifyCode = mt_rand(10000, 99999);
        $smsContent = "Optimal Rating ".$verifyCode.PHP_EOL;

        $req = self::send($phone, $smsContent);

        $smsResponse = json_decode($req->getBody()->getContents());

        if($smsResponse->messages[0]->status->groupId !== 1)
            return array('status' => false);

        return array(
            'status' => true,
            'code'   => $verifyCode
        );
    }

    public function categoryConfirmMessage($category)
    {
        $user = $category->user()->with('country')->first();

        $country = $user->country()->get();

        $keyword = Keyword::where('key','=','msg.info.category.confirmation')->first();

        $message = 'Your category has been approved';

        if ($keyword) {

            $translation = Translation::where('keyword_id', '=', $keyword->id)
                ->where('country_code','=', $country->code)->first();

            $message = $translation->translation;
        }

        $userDetail = $user->userDetails()->first();

        self::send($userDetail->phone_number, $message);
    }

    private function send($phone, $smsContent)
    {
        return $this->client->request('POST', $this->serviceUrl,

            array(
                'json' => array(
                    'messages' => array(
                        array(
                            'from'  => '08505400794' ,
                            'destinations' => array(
                                array('to'    => $phone)
                            ),
                            'text' => $smsContent
                        )
                    ),
                ),
                'headers' => array(
                    'accept' => 'application/json',
                    'Content-Type' => 'application/json',
                    'authorization' => 'Basic '.$this->apiKey
                )
            )
        );
    }
}
