<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Friends extends Model
{
    public function friend()
    {
        return $this->belongsTo(User::class,'friend','id');
    }
}
