<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\Auth\RegisterController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\KharchaController;
use App\Http\Controllers\RationController;
use App\Http\Controllers\ReminderController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ExpenseController;
use App\Http\Controllers\SurvivalReportController;
use App\Http\Controllers\ReportController;
use App\Http\Controllers\Admin\UserController as AdminUserController;
use App\Http\Controllers\Admin\CategoryController as AdminCategoryController;
use App\Http\Controllers\MaintenanceTriggerController;

$maintenanceEnabled = (bool) config('maintenance.enabled', env('MAINTENANCE_PAGE_ENABLED', false));

if ($maintenanceEnabled) {
    Route::middleware('throttle:5,1')->group(function () {
        Route::get('/maintenance/run', [MaintenanceTriggerController::class, 'show'])
            ->name('maintenance.trigger');
        Route::post('/maintenance/run', [MaintenanceTriggerController::class, 'run'])
            ->name('maintenance.trigger.run');
    });
}

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

Route::middleware(['auth', 'set.household'])->prefix('panel')->name('panel.')->group(function () {
    Route::redirect('/', '/panel/kharcha')->name('home');

    Route::resource('kharcha', ExpenseController::class)
        ->parameters(['kharcha' => 'expense'])
        ->except(['show']);

    Route::resource('ration', RationController::class)
        ->parameters(['ration' => 'ration'])
        ->except(['show']);

    Route::post('ration/{ration}/prices', [RationController::class, 'storePrice'])
        ->name('ration.prices.store');

    Route::resource('reminders', ReminderController::class)->except(['show']);
    Route::post('reminders/{reminder}/toggle', [ReminderController::class, 'toggle'])->name('reminders.toggle');

    Route::post('reports/survival', [SurvivalReportController::class, 'generate'])->name('reports.survival');
});

Route::redirect('/kharcha', '/panel/kharcha')->middleware('auth');
Route::redirect('/ration', '/panel/ration')->middleware('auth');
Route::redirect('/reminders', '/panel/reminders')->middleware('auth');

Route::get('/reports', [ReportController::class, 'index'])
    ->middleware('auth')
    ->name('reports.index');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

// Admin routes
Route::middleware(['auth', 'admin'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/users', [AdminUserController::class, 'index'])->name('users.index');
    Route::get('/users/create', [AdminUserController::class, 'create'])->name('users.create');
    Route::post('/users', [AdminUserController::class, 'store'])->name('users.store');

    Route::get('/categories', [AdminCategoryController::class, 'index'])->name('categories.index');
    Route::get('/categories/create', [AdminCategoryController::class, 'create'])->name('categories.create');
    Route::post('/categories', [AdminCategoryController::class, 'store'])->name('categories.store');
    Route::get('/categories/{category}/edit', [AdminCategoryController::class, 'edit'])->name('categories.edit');
    Route::put('/categories/{category}', [AdminCategoryController::class, 'update'])->name('categories.update');
    Route::delete('/categories/{category}', [AdminCategoryController::class, 'destroy'])->name('categories.destroy');
});

require __DIR__.'/auth.php';
