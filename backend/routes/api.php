<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\Api\ProjectController;
use App\Http\Controllers\Api\SkillController;

Route::middleware('web')->group(function () {
    Route::post('/login', [AuthController::class, 'login']);
    Route::post('/logout', [AuthController::class, 'logout'])->middleware('auth:sanctum');
    Route::get('/user', [AuthController::class, 'user'])->middleware('auth:sanctum');
    // Проекты
    Route::get('/projects', [ProjectController::class, 'index']);
    Route::get('/admin/projects', [ProjectController::class, 'indexAdmin'])->middleware('auth:sanctum');
    Route::post('/project', [ProjectController::class, 'store'])->middleware('auth:sanctum');
    Route::put('/project/{id}', [ProjectController::class, 'update'])->middleware('auth:sanctum');
    Route::delete('/project/{id}', [ProjectController::class, 'destroy'])->middleware('auth:sanctum');
    Route::delete('/images/{id}', [ProjectController::class, 'deleteImage']);
    // Скилы
    Route::get('/skills', [SkillController::class, 'index']);
    Route::get('admin/skills', [SkillController::class, 'indexAdmin']);
    Route::post('admin/skills', [SkillController::class, 'store']);
    Route::put('admin/skills/{id}', [SkillController::class, 'update']);
    Route::delete('admin/skills/{id}', [SkillController::class, 'destroy']);
});
