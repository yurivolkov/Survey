<?php

namespace App\Http\Controllers\Api;

use App\CustomObjects\ApiPagination;
use App\Service\CustomJsonResponse;
use App\Service\UserService;
use App\User;
use App\Http\Controllers\Controller;
use App\UserDetail;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Builder;

class MembersController extends Controller
{
    private $jsonResponse;

    public function __construct(CustomJsonResponse $jsonResponse)
    {
        $this->jsonResponse = $jsonResponse;
    }

    public function index()
    {
        if(auth()->user()->hasRole('super_admin')){
            $model = User::with(['country', 'userDetails']);
        }

        else if(auth()->user()->hasRole('country_admin')){
            $model = User::whereHas('roles', function (Builder $query) {
                $query->whereNotIn('name', ['super_admin','country_admin']);
            })->where('country_id', auth()->user()->country_id);

        }

        if (!is_null(request('keyword'))  && request("keyword") !=="") {
            $query[] = ['email', 'like',  '%'.request("keyword").'%'];
            $model->where($query);
        }

        if(!is_null(request('userStatus')) && request('userStatus') != ""){
            $model->whereIn('status', request('userStatus'));
        }

        if(!is_null(request('userGender') ) && request('userGender') !==""){
            $model->whereHas('userDetails', function (Builder $builder){
               $builder->where('gender', request('userGender'));
            });
        }

        if(!is_null(request('userEducation')) && request('userEducation') !==""){
            $model->whereHas('userDetails', function (Builder $builder){
               $builder->where('education', request('userEducation'));
            });
        }

        if(!is_null(request('country')) && request('country') !==""){
            $model->where('country_id', request('country'));
        }

        if(!is_null(request('city')) && request('city') !==""){
            $model->where('city_id', request('city'));
        }

        if(request('birthdate')){
            $birthdate = request('birthdate');

            $builder = UserDetail::select(['user_id','birthdate']);

            if (!empty($birthdate['from_date'])) {
                $builder ->where('birthdate', '>', $birthdate['from_date']);
            }

            if (!empty($birthdate['until_date'])) {
                $builder->where('birthdate', '<', $birthdate['until_date']);
            }

            $ids = [];
            foreach ($builder->get() as $item) {
                $ids[] = $item->user_id;

            }

            $model->whereIn('id', $ids);
        }

        $pagination = new ApiPagination(request("limit", 100), count($model->get()), request("offset", 0));

        $model = $model->orderBy(request('sort','id'), request('order', 'desc'))
            ->offset(request('offset', 0))->take(request('limit'))->get();

        $this->jsonResponse->setData(
            200,
            'msg.info.list.members', $model, null, $pagination->getConvertObject()
        );

        return $this->jsonResponse->getResponse();
    }

    public function show(User $user)
    {
        $this->jsonResponse->setData(200,   'msg.info.success.user.show', $user);
        return $this->jsonResponse->getResponse();
    }

    public function update(User $user)
    {
        $user->update(request()->all());

        $this->jsonResponse->setData(200,'msg.info.success.user.updated', $user);

        return $this->jsonResponse->getResponse();
    }

    public function upgrade(User $user)
    {
        $user->is_real = request('is_real');
        $user->status = 'active';
        $user->save();

        $this->jsonResponse->setData(200,   'msg.info.success.grade', $user);

        return $this->jsonResponse->getResponse();
    }

    public function destroy($user)
    {
        $user = User::find($user);

        if (!is_null($user)) {
            $userService = new UserService();
            $userService->deleteUser($user);
        }

        return $this->jsonResponse->getResponse();
    }

}
