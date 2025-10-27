<?php

use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\KharchaController;
use App\Http\Controllers\RationController;
use App\Http\Controllers\ReminderController;
use App\Http\Controllers\ReportController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Public pages
Route::get('/', fn() => Inertia::render('Home'))->name('home');
Route::get('/about', fn() => Inertia::render('About'))->name('about');
Route::get('/contact', fn() => Inertia::render('Contact'))->name('contact');

// Branded login page
Route::get('/login-custom', function () {
    return redirect()->route('login');
})->name('login.custom');

// Protected area
Route::middleware(['auth','verified'])->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
    Route::get('/kharcha', [KharchaController::class, 'index'])->name('kharcha.map');
    Route::get('/kharcha/add', [KharchaController::class, 'create'])->name('kharcha.add');
    Route::post('/kharcha', [KharchaController::class, 'store'])->name('kharcha.store');
    Route::put('/kharcha/{expense}', [KharchaController::class, 'update'])->name('kharcha.update');
    Route::delete('/kharcha/{expense}', [KharchaController::class, 'destroy'])->name('kharcha.destroy');

    Route::get('/ration', [RationController::class, 'index'])->name('ration.index');
    Route::post('/ration', [RationController::class, 'store'])->name('ration.store');
    Route::put('/ration/{rationItem}', [RationController::class, 'update'])->name('ration.update');
    Route::delete('/ration/{rationItem}', [RationController::class, 'destroy'])->name('ration.destroy');

    Route::get('/reminders', [ReminderController::class, 'index'])->name('reminders.index');
    Route::post('/reminders', [ReminderController::class, 'store'])->name('reminders.store');
    Route::put('/reminders/{reminder}', [ReminderController::class, 'update'])->name('reminders.update');
    Route::delete('/reminders/{reminder}', [ReminderController::class, 'destroy'])->name('reminders.destroy');

    Route::get('/reports', [ReportController::class, 'index'])->name('reports.main');
    Route::post('/reports/generate', [ReportController::class, 'generate'])->name('reports.generate');
});

require __DIR__.'/auth.php';
