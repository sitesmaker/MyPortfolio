<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Skill;
use App\Http\Requests\SkillRequest;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;

class SkillController extends Controller
{
    /**
     * Display a listing of the resource for public.
     */
    public function index()
    {
        return Skill::where('is_published', 1)
            ->orderBy('sort_order')
            ->get();
    }

    /**
     * Display a listing of the resource for admin.
     */
    public function indexAdmin(Request $request)
    {
        return Skill::orderBy('sort_order')
            ->get();
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(SkillRequest $request)
    {
        try {
            $data = $request->validated();

            // Создаем скилл
            $skill = Skill::create($data);

            return response()->json([
                'success' => true,
                'message' => 'Навык успешно создан',
                'skill' => $skill
            ], 201);

        } catch (\Exception $e) {
            Log::error('Ошибка создания навыка: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'Ошибка при создании навыка',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        try {
            $skill = Skill::findOrFail($id);

            return response()->json([
                'success' => true,
                'skill' => $skill
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Навык не найден'
            ], 404);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        try {
            $skill = Skill::findOrFail($id);

            // Валидируем данные
            $validated = $request->validate([
                'name' => 'sometimes|string|max:255',
                'proficiency' => 'sometimes|integer|min:0|max:100',
                'icon' => 'sometimes|string|nullable',
                'icon_file' => 'sometimes|image|mimes:svg,jpeg,png,jpg,gif|max:2048',
                'color' => 'sometimes|string|max:50',
                'description' => 'sometimes|string|nullable',
                'sort_order' => 'sometimes|integer',
                'is_published' => 'sometimes|boolean',
            ]);

            // Обновляем скилл
            $skill->update($validated);

            // Обработка иконки (файл)
            if ($request->hasFile('icon_file')) {
                // Удаляем старую иконку, если это файл
                if ($skill->icon && !filter_var($skill->icon, FILTER_VALIDATE_URL)) {
                    Storage::disk('public')->delete($skill->icon);
                }

                // Загружаем новую иконку
                $path = $this->uploadIcon($request->file('icon_file'), $skill);
                $skill->update(['icon' => $path]);
            }

            return response()->json([
                'success' => true,
                'message' => 'Навык успешно обновлен',
                'skill' => $skill
            ]);

        } catch (\Exception $e) {
            Log::error('Ошибка обновления навыка: ' . $e->getMessage());
            Log::error('Stack trace: ' . $e->getTraceAsString());

            return response()->json([
                'success' => false,
                'message' => 'Ошибка при обновлении навыка',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        try {
            $skill = Skill::findOrFail($id);

            // Удаляем иконку, если это файл (не URL)
            if ($skill->icon && !filter_var($skill->icon, FILTER_VALIDATE_URL)) {
                Storage::disk('public')->delete($skill->icon);
            }

            // Удаляем скилл
            $skill->delete();

            return response()->json([
                'success' => true,
                'message' => 'Навык успешно удален'
            ]);

        } catch (\Exception $e) {
            Log::error('Ошибка удаления навыка: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'Ошибка при удалении навыка',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update sort order for skills (bulk update)
     */
    public function updateOrder(Request $request)
    {
        try {
            $request->validate([
                'skills' => 'required|array',
                'skills.*.id' => 'required|exists:skills,id',
                'skills.*.sort_order' => 'required|integer',
            ]);

            foreach ($request->skills as $skillData) {
                Skill::where('id', $skillData['id'])->update([
                    'sort_order' => $skillData['sort_order'],
                ]);
            }

            return response()->json([
                'success' => true,
                'message' => 'Порядок навыков обновлен'
            ]);

        } catch (\Exception $e) {
            Log::error('Ошибка обновления порядка навыков: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'Ошибка при обновлении порядка навыков',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get all categories
     */
    public function getCategories()
    {
        return response()->json([
            'success' => true,
        ]);
    }

    /**
     * Upload icon file
     */
    private function uploadIcon($file, $skill)
    {
        // Генерируем уникальное имя
        $filename = time() . '_' . Str::slug($skill->name) . '.' . $file->getClientOriginalExtension();

        // Путь: skills/icons/filename.svg
        $path = $file->storeAs(
            'skills/icons',
            $filename,
            'public'
        );

        return $path;
    }

    /**
     * Bulk create/update skills
     */
    public function bulkStore(Request $request)
    {
        try {
            $request->validate([
                'skills' => 'required|array',
                'skills.*.name' => 'required|string|max:255',
                'skills.*.proficiency' => 'sometimes|integer|min:0|max:100',
                'skills.*.icon' => 'sometimes|string|nullable',
                'skills.*.color' => 'sometimes|string|max:50',
                'skills.*.sort_order' => 'sometimes|integer',
                'skills.*.is_published' => 'sometimes|boolean',
            ]);

            $created = [];
            $updated = [];

            foreach ($request->skills as $skillData) {
                if (isset($skillData['id'])) {
                    // Update existing
                    $skill = Skill::find($skillData['id']);
                    if ($skill) {
                        $skill->update($skillData);
                        $updated[] = $skill;
                    }
                } else {
                    // Create new
                    $skill = Skill::create($skillData);
                    $created[] = $skill;
                }
            }

            return response()->json([
                'success' => true,
                'message' => 'Навыки успешно обработаны',
                'created' => $created,
                'updated' => $updated
            ]);

        } catch (\Exception $e) {
            Log::error('Ошибка массовой обработки навыков: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'Ошибка при массовой обработке навыков',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
