<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\Api\ProjectController;

Route::middleware('web')->group(function () {
    Route::post('/login', [AuthController::class, 'login']);
    Route::post('/logout', [AuthController::class, 'logout'])->middleware('auth:sanctum');
    Route::get('/user', [AuthController::class, 'user'])->middleware('auth:sanctum');
    Route::get('/projects', [ProjectController::class, 'adminIndex']);
    Route::post('/project', [ProjectController::class, 'store'])->middleware('auth:sanctum');
    Route::put('/project/{id}', [ProjectController::class, 'update'])->middleware('auth:sanctum');
    Route::delete('/project/{id}', [ProjectController::class, 'destroy'])->middleware('auth:sanctum');
    Route::delete('/images/{id}', [ProjectController::class, 'deleteImage']);
});
