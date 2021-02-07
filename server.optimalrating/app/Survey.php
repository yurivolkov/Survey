<?php

namespace App;

use Cviebrock\EloquentSluggable\Sluggable;
use Illuminate\Database\Eloquent\Model;

class Survey extends Model
{
    use Sluggable;

    /**
     * Return the sluggable configuration array for this model.
     *
     * @return array
     */
    public function sluggable()
    {
        return [
            'slug' => [
                'source' => 'title'
            ]
        ];
    }
    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'status',
        'title' ,
        'slug',
        'description',
        'user_id' ,
        'category_id',
        'status',
        'type' ,
        'start_at' ,
        'expire_at',
        'show_on_home',
        'country_id',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function comments()
    {
        return $this->morphMany(Comment::class, 'commentable');
    }

    public function choices()
    {
        return $this->hasMany(SurveyChoice::class);
    }

    public function subjects()
    {
        return $this->belongsToMany('App\Subject', 'survey_subjects');
    }

    public function votes()
    {
        return $this->hasMany(SurveyVote::class);
    }
}
