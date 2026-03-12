<?php
// app/Http/Requests/SkillRequest.php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class SkillRequest extends FormRequest
{
    public function authorize()
    {
        return true; // Или проверка прав доступа
    }

    public function rules()
    {
        return [
            'name' => 'required|string|max:255',
            'proficiency' => 'nullable|integer|min:0|max:100',
            'icon' => 'nullable|string',
            'icon_file' => 'nullable|image|mimes:svg,jpeg,png,jpg,gif|max:2048',
            'color' => 'nullable|string|max:50',
            'description' => 'nullable|string',
            'sort_order' => 'nullable|integer',
            'is_published' => 'nullable|boolean',
        ];
    }

    public function messages()
    {
        return [
            'name.required' => 'Название навыка обязательно',
            'name.max' => 'Название не должно превышать 255 символов',
            'proficiency.min' => 'Уровень владения должен быть от 0 до 100',
            'proficiency.max' => 'Уровень владения должен быть от 0 до 100',
            'icon_file.image' => 'Файл должен быть изображением',
            'icon_file.max' => 'Размер файла не должен превышать 2MB',
        ];
    }
}
