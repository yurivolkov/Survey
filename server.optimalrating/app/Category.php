<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Cviebrock\EloquentSluggable\Sluggable;
use Illuminate\Database\Eloquent\SoftDeletes;

class Category extends Model
{
    use Sluggable /*SoftDeletes*/;

    /**
     * Return the sluggable configuration array for this model.
     *
     * @return array
     */
    public function sluggable()
    {
        return [
            'slug' => [
                'source' => 'name'
            ]
        ];
    }

    protected $guarded = ['id'];

    public function getChildren($status = 'active', $isThereCountry = false, $country = null)
    {
        $category = $this->hasMany('App\Category', 'parent', 'id')
            ->with('surveys')->whereStatus($status);
        if ($isThereCountry) {
            $category->where('country_id', '=', $country ? $country->id : null);
        }
        return $category->get();
    }

    public function surveys()
    {
        return $this->hasMany('App\Survey', 'category_id')->with('user');
    }

    public function parent()
    {
        return $this->belongsTo('App\Category', 'parent');
    }

    public function user()
    {
        return $this->belongsTo('App\User', 'user_id')->with('userDetails');
    }

  /*  protected static function boot()
    {
        parent::boot();

        static::addGlobalScope(new CountryScope());
    }*/
}
