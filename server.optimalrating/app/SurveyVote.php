<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class SurveyVote extends Model
{
    protected $fillable = ['survey_id', 'choice_id', 'user_id'];

    protected $guarded = ['id'];

    public function choice()
    {
        return $this->belongsTo(SurveyChoice::class);
    }

    public function survey()
    {
        return $this->belongsTo(Survey::class,'survey_id', 'id');
    }

    public function users()  //this is a relation to users
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}
