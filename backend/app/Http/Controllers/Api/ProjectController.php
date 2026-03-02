<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Project;
use App\Http\Requests\ProjectRequest;
use Illuminate\Support\Str;

class ProjectController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Project::where('is_active', true)
        ->orderBy('sort_order')
        ->get();
    }

    public function adminIndex(Request $request)
    {
        $query = Project::query();
        return Project::all();
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(ProjectRequest $request)
    {
        try {
            // Получаем валидированные данные
            $data = $request->validated();

            $data['slug'] = Str::slug($data['title']);

            if (!isset($data['image_url'])) {
                $data['image_url'] = null; // или '/images/default-project.jpg'
            }

            // Обработка изображения
            if ($request->hasFile('image')) {
                $path = $request->file('image')->store('projects', 'public');
                $data['image'] = $path;
            }

            // Добавляем ID текущего пользователя
            $data['user_id'] = auth()->id();

            // Устанавливаем статус по умолчанию, если не указан
            $data['status'] = $data['status'] ?? 'draft';

            // Создаем проект
            $project = Project::create($data);

            // Прикрепляем теги, если они есть
            if ($request->has('tags')) {
                $project->tags()->sync($request->tags);
            }

            // Возвращаем успешный ответ
            return response()->json([
                'success' => true,
                'message' => 'Проект успешно создан',
                'project' => $project->load('user', 'tags')
            ], 201);

        } catch (\Exception $e) {
            // Логируем ошибку
            \Log::error('Ошибка создания проекта: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'Ошибка при создании проекта',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $project = Project::findOrFail($id);
        $project->update($request->all());

        return response()->json($project);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
