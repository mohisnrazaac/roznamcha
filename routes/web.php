<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\Auth\RegisterController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\KharchaController;
use App\Http\Controllers\RationController;
use App\Http\Controllers\ReminderController;
use App\Http\Controllers\ReportController;
use App\Http\Controllers\Admin\UserController as AdminUserController;
use App\Http\Controllers\Admin\CategoryController as AdminCategoryController;

// Public marketing pages
Route::get('/', function () {
    return Inertia::render('Public/Home');
})->name('public.home');

Route::get('/about', function () {
    return Inertia::render('Public/About');
})->name('public.about');

Route::get('/contact', function () {
    return Inertia::render('Public/Contact');
})->name('public.contact');

// Authentication
Route::get('/login', [LoginController::class, 'showLogin'])->name('login');
Route::post('/login', [LoginController::class, 'login'])->name('login.attempt');

Route::get('/register', [RegisterController::class, 'showRegister'])->name('register');
Route::post('/register', [RegisterController::class, 'register'])->name('register.store');

Route::post('/logout', [LoginController::class, 'logout'])
    ->middleware('auth')
    ->name('logout');

// Dashboard
Route::get('/dashboard', [DashboardController::class, 'index'])
    ->middleware('auth')
    ->name('dashboard');

Route::get('/kharcha', [KharchaController::class, 'index'])
    ->middleware('auth')
    ->name('kharcha.index');
Route::post('/kharcha', [KharchaController::class, 'store'])
    ->middleware('auth')
    ->name('kharcha.store');
Route::put('/kharcha/{id}', [KharchaController::class, 'update'])
    ->middleware('auth')
    ->name('kharcha.update');
Route::delete('/kharcha/{id}', [KharchaController::class, 'destroy'])
    ->middleware('auth')
    ->name('kharcha.destroy');

Route::get('/ration', [RationController::class, 'index'])
    ->middleware('auth')
    ->name('ration.index');
Route::post('/ration', [RationController::class, 'store'])
    ->middleware('auth')
    ->name('ration.store');
Route::put('/ration/{id}', [RationController::class, 'update'])
    ->middleware('auth')
    ->name('ration.update');
Route::delete('/ration/{id}', [RationController::class, 'destroy'])
    ->middleware('auth')
    ->name('ration.destroy');

Route::get('/reminders', [ReminderController::class, 'index'])
    ->middleware('auth')
    ->name('reminders.index');
Route::post('/reminders', [ReminderController::class, 'store'])
    ->middleware('auth')
    ->name('reminders.store');
Route::put('/reminders/{id}', [ReminderController::class, 'update'])
    ->middleware('auth')
    ->name('reminders.update');
Route::delete('/reminders/{id}', [ReminderController::class, 'destroy'])
    ->middleware('auth')
    ->name('reminders.destroy');

Route::get('/reports', [ReportController::class, 'index'])
    ->middleware('auth')
    ->name('reports.index');

// Admin routes
Route::middleware(['auth', 'admin'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/users', [AdminUserController::class, 'index'])->name('users.index');
    Route::get('/users/create', [AdminUserController::class, 'create'])->name('users.create');
    Route::post('/users', [AdminUserController::class, 'store'])->name('users.store');

    Route::get('/categories', [AdminCategoryController::class, 'index'])->name('categories.index');
    Route::get('/categories/create', [AdminCategoryController::class, 'create'])->name('categories.create');
    Route::post('/categories', [AdminCategoryController::class, 'store'])->name('categories.store');
    Route::get('/categories/{id}/edit', [AdminCategoryController::class, 'edit'])->name('categories.edit');
    Route::put('/categories/{id}', [AdminCategoryController::class, 'update'])->name('categories.update');
    Route::delete('/categories/{id}', [AdminCategoryController::class, 'destroy'])->name('categories.destroy');
});
