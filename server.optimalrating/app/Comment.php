<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Comment extends Model
{
    protected $guarded = ['id'];

    public function commentable()
    {
        return $this->morphTo();
    }

    public function comments()
    {
        return $this->morphMany($this, 'commentable');
    }

    public function country()
    {
        return $this->belongsTo(Country::class);
    }

    public function likes()
    {
        return $this->hasMany(CommentLike::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
