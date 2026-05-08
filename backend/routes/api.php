<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\AuthController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\ExpenseController;
use App\Http\Controllers\BudgetController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\InsightController;
use App\Http\Controllers\IncomeController;
use App\Http\Controllers\GoalController;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login'])->name('login');

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'user']);

    Route::get('/dashboard', [DashboardController::class, 'index']);

    Route::apiResource('expenses', ExpenseController::class);
    Route::apiResource('incomes', IncomeController::class);
    
    Route::get('/goals', [GoalController::class, 'index']);
    Route::post('/goals', [GoalController::class, 'store']);
    Route::put('/goals/{id}/progress', [GoalController::class, 'updateProgress']);
    Route::delete('/goals/{id}', [GoalController::class, 'destroy']);

    Route::get('/budget', [BudgetController::class, 'index']);
    Route::post('/budget', [BudgetController::class, 'store']);

    Route::get('/notifications', [NotificationController::class, 'index']);
    
    Route::get('/insights/predictions', [InsightController::class, 'predictions']);
    Route::get('/insights/analyze', [InsightController::class, 'analyzeSpending']);
    Route::post('/insights/chat', [InsightController::class, 'chat']);

    Route::get('/education/quiz', [App\Http\Controllers\EducationController::class, 'getQuiz']);
    Route::post('/education/quiz/submit', [App\Http\Controllers\EducationController::class, 'submitQuiz']);

    Route::put('/user/profile', [App\Http\Controllers\ProfileController::class, 'update']);
    Route::post('/user/avatar', [App\Http\Controllers\ProfileController::class, 'uploadAvatar']);
});
