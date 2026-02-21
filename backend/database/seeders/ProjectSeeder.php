<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Project;

class ProjectSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Project::create([
            'title' => 'Мой первый проект',
            'slug' => 'my-first-project',
            'description' => 'Краткое описание проекта',
            'content' => 'Полное описание проекта...',
            'image_url' => '/images/project1.jpg',
            'technologies' => json_encode(['laravel', 'php', 'mysql']),
            'github_url' => 'https://github.com/username/project',
            'live_url' => 'https://project.com',
            'sort_order' => 1,
            'is_active' => true
        ]);
    }
}
