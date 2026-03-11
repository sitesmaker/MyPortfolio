<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Project;
use App\Models\Image;
use App\Http\Requests\ProjectRequest;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;

class ProjectController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Project::where('is_published', 1)
            ->with('images')
            ->orderBy('sort_order')
            ->get();
    }

    public function indexAdmin(Request $request)
    {
        return Project::with('images')->get();
    }

    public function store(ProjectRequest $request)
    {
        try {
            $data = $request->validated();
            $data['slug'] = Str::slug($data['title']);
            $data['user_id'] = auth()->id();
            $data['status'] = $data['status'] ?? 'draft';

            // Создаем проект
            $project = Project::create($data);

            // Обработка множественных изображений
            if ($request->hasFile('images')) {
                $this->uploadImages($request->file('images'), $project);
            }

            // Прикрепляем теги, если они есть
            if ($request->has('tags')) {
                $project->tags()->sync($request->tags);
            }

            // Возвращаем проект с загруженными изображениями
            return response()->json([
                'success' => true,
                'message' => 'Проект успешно создан',
            ], 201);

        } catch (\Exception $e) {
            Log::error('Ошибка создания проекта: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'Ошибка при создании проекта',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function update(Request $request, string $id)
    {
        try {
            $project = Project::findOrFail($id);

            // Валидируем данные
            $validated = $request->validate([
                'title' => 'sometimes|string|max:255',
                'description' => 'sometimes|string',
                'content' => 'sometimes|string',
                'technologies' => 'sometimes|string',
                'live_url' => 'sometimes|url|nullable',
                'is_published' => 'sometimes|boolean',
            ]);

            // Обновляем slug, если изменился title
            if (isset($validated['title']) && $validated['title'] !== $project->title) {
                $validated['slug'] = Str::slug($validated['title']);
            }

            // Обновляем проект
            $project->update($validated);

            // ОБРАБОТКА ИЗОБРАЖЕНИЯ
            // Проверяем, нужно ли удалить существующее изображение
            if ($request->has('deleted_image') && $request->deleted_image) {
                $imageId = $request->deleted_image;
                $image = Image::find($imageId);

                if ($image && $image->project_id == $project->id) {
                    // Удаляем файл
                    Storage::disk('public')->delete($image->path);
                    // Удаляем запись из БД
                    $image->delete();
                }
            }

            // Проверяем, загружено ли новое изображение
            if ($request->hasFile('image')) {
                // Если у проекта уже есть изображения, удаляем их все (для одиночного изображения)
                foreach ($project->images as $existingImage) {
                    Storage::disk('public')->delete($existingImage->path);
                    $existingImage->delete();
                }

                // Загружаем новое изображение
                $this->uploadSingleImage($request->file('image'), $project);
            }

            // Загружаем обновленные отношения
            $project->load('images');

            return response()->json([
                'success' => true,
                'message' => 'Проект успешно обновлен',
                'project' => $project
            ]);

        } catch (\Exception $e) {
            Log::error('Ошибка обновления проекта: ' . $e->getMessage());
            Log::error('Stack trace: ' . $e->getTraceAsString());

            return response()->json([
                'success' => false,
                'message' => 'Ошибка при обновлении проекта',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Загрузка одного изображения
     */
    private function uploadSingleImage($file, $project)
    {
        // Генерируем уникальное имя
        $filename = time() . '_' . Str::random(10) . '.' . $file->getClientOriginalExtension();

        // Путь: projects/{project_id}/filename.jpg
        $path = $file->storeAs(
            'projects/' . $project->id,
            $filename,
            'public'
        );

        // Создаем запись в БД
        $project->images()->create([
            'path' => $path,
            'sort' => 0 // Для одиночного изображения сортировка не важна
        ]);
    }

    public function destroy(string $id)
    {
        try {
            $project = Project::findOrFail($id);

            // Удаляем все связанные изображения (файлы и записи в БД)
            foreach ($project->images as $image) {
                Storage::disk('public')->delete($image->path);
                $image->delete();
            }

            // Удаляем проект
            $project->delete();

            return response()->json([
                'success' => true,
                'message' => 'Проект успешно удален'
            ]);

        } catch (\Exception $e) {
            Log::error('Ошибка удаления проекта: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'Ошибка при удалении проекта',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function show(string $id)
    {
        try {
            $project = Project::with('images', 'tags')->findOrFail($id);

            return response()->json([
                'success' => true,
                'project' => $project
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Проект не найден'
            ], 404);
        }
    }

    public function deleteImage($imageId)
    {
        try {
            $image = Image::findOrFail($imageId);

            // Удаляем файл
            Storage::disk('public')->delete($image->path);

            // Удаляем запись из БД
            $image->delete();

            return response()->json([
                'success' => true,
                'message' => 'Изображение удалено'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Ошибка при удалении изображения'
            ], 500);
        }
    }

    private function uploadImages($files, $project)
    {
        $sort = $project->images()->max('sort') + 1;

        foreach ($files as $file) {
            // Генерируем уникальное имя
            $filename = time() . '_' . Str::random(10) . '.' . $file->getClientOriginalExtension();

            // Путь: projects/{project_id}/filename.jpg
            $path = $file->storeAs(
                'projects/' . $project->id,
                $filename,
                'public'
            );

            // Создаем запись в БД
            $project->images()->create([
                'path' => $path,
                'sort' => $sort++
            ]);
        }
    }
}
