<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

class Image extends Model
{
    protected $fillable = ['path', 'project_id', 'sort'];

    protected $appends = ['full_url']; // Добавляем новое поле

    public function project()
    {
        return $this->belongsTo(Project::class);
    }

    public function getUrlAttribute()
    {
        return Storage::url($this->path);
    }

    public function getFullUrlAttribute()
    {
        $baseUrl = config('app.url');

        return $baseUrl . Storage::url($this->path);
    }
}
