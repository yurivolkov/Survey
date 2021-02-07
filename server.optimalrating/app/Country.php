<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Country extends Model
{
    protected $fillable = ['name_en', 'name', 'flag', 'code', 'status', 'sort_order'];

    public function cities()
    {
        return $this->belongsTo(City::class);
    }

    public function user()
    {
        return $this->hasOne(User::class, 'id', 'country_admin');
    }

}
