<?php
// app/Models/Skill.php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Skill extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'proficiency',
        'icon',
        'color',
        'description',
        'sort_order',
        'is_published'
    ];

    protected $casts = [
        'proficiency' => 'integer',
        'sort_order' => 'integer',
        'is_published' => 'boolean'
    ];

    // Аксессор для полного URL иконки
    public function getIconUrlAttribute()
    {
        if (!$this->icon) {
            return null;
        }

        // Если это уже полный URL
        if (filter_var($this->icon, FILTER_VALIDATE_URL)) {
            return $this->icon;
        }

        // Если это путь к файлу
        return asset('storage/' . $this->icon);
    }

    // Скоупы
    public function scopePublished($query)
    {
        return $query->where('is_published', true);
    }

    public function scopeOrdered($query)
    {
        return $query->orderBy('sort_order');
    }
}
