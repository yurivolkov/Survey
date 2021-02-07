<?php

namespace App\Http\Controllers\Api;

use App\Country;
use App\CustomObjects\CustomJsonResponse;
use App\Friends;
use App\Http\Controllers\Controller;
use App\Keyword;
use App\KeywordsCache;
use App\Page;
use App\Privacy;
use App\Service\CacheService;
use App\Service\IpService;
use App\User;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Request;

class InitController extends Controller
{

    /**
     * @param Request $request
     * @param CacheService $cache
     * @return array
     */
    public function init(Request $request, CacheService $cache)
    {
        $IP = $request->server->get('REMOTE_ADDR');

        $IPService = $cache->cache->get($IP);

        if (is_null($IPService) || !$IPService) {
            $IPService = (new IpService())->getCountryData($IP);
            $cache->cache->set($IP, serialize($IPService));
        }

        $IPService = (new IpService())->getCountryData($IP);

        $init = [
            'ipService' => $IPService,
            'user' => User::with(['userDetails', 'friends.friend.userDetails', 'pendingFriends', 'pendingFriends.user.userDetails', 'country', 'pendingRequestFriends', 'city'])->find(Auth::id())
        ];

        $customResponse = new CustomJsonResponse(
            200,
            'msg.info.init.success',
            $init
        );

        return $customResponse->getResponse();
    }

    /**
     * @return array
     */
    public function panelInit()
    {
        $auth = Auth::user();
        $country = Country::find($auth->country_id);
        $friend = Friends::with(['friend.userDetails'])->where('user','=', $auth->id)->get();

        $init = array(
            'country'=> $country,
            'role' => $auth->roles[0]
    );
        $customResponse = new CustomJsonResponse(
            200,

            'msg.info.login.success',
            $init
        );

        return $customResponse->getResponse();
    }

    public function i18n()
    {
        $keyword = KeywordsCache::orderBy('id','desc')->first();
        return response()->json(json_decode($keyword->body));
    }
}
