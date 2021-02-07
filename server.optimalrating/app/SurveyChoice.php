<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class SurveyChoice extends Model
{
    protected $fillable = ['survey_id', 'choice_title', 'choice_image', 'choice_description', 'mark'];

    public $timestamps = false;

    public function survey()
    {
        return $this->belongsTo(Survey::class, 'survey_id')->with(['choices']);
    }

    public function onlySurvey()
    {
        return $this->belongsTo(Survey::class, 'survey_id');
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function votes()
    {
        return $this->hasMany(SurveyVote::class, 'choice_id');
    }
}
