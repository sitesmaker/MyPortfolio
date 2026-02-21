<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Skill;

class SkillSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Skill::create([
            'name' => 'Vue.js',
            'category' => 'Frontend',
            'proficiency' => 90,
            'icon' => 'vuejs',
            'sort_order' => 1
        ]);

        Skill::create([
            'name' => 'Laravel',
            'category' => 'Backend',
            'proficiency' => 85,
            'icon' => 'laravel',
            'sort_order' => 1
        ]);
    }
}
