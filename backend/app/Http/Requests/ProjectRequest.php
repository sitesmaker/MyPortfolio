<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ProjectRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'title' => 'required|string|min:3|max:255',
            'description' => 'required|string|min:10',
            'content' => 'nullable|string',
            'technologies' => 'nullable|string|max:500',
            'live_url' => 'nullable|url|max:255',
            'github_url' => 'nullable|url|max:255',
            'image' => 'nullable|image|max:2048', // 2MB max
            'status' => 'sometimes|in:draft,published,archived',
        ];
    }

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($project) {
            $project->slug = Str::slug($project->title);
            $project->user_id = auth()->id() ?? $project->user_id;
        });

        static::updating(function ($project) {
            if ($project->isDirty('title')) {
                $project->slug = Str::slug($project->title);
            }
        });
    }

    public function getTechnologiesArrayAttribute()
    {
        return explode(',', $this->technologies);
    }
}
