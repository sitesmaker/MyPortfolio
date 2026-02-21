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
        'is_active'
    ];

    protected $casts = [
        'technologies' => 'array',
        'is_active' => 'boolean'
    ];
}
