<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Project extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'slug',
        'description',
        'content',
        'image_url',
        'technologies',
        'github_url',
        'live_url',
        'sort_order',
        'is_published'
    ];

    protected $casts = [
        'technologies' => 'array',
        'is_published' => 'boolean'
    ];

    public function images()
    {
        return $this->hasMany(Image::class)->orderBy('sort');
    }
}
