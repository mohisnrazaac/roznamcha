<?php

use App\Http\Controllers\Api\ContentIngestionController;
use Illuminate\Support\Facades\Route;

Route::get('/internal/check-post', [ContentIngestionController::class, 'check'])
    ->middleware(['agent.verify']);

Route::get('/internal/existing-posts', [ContentIngestionController::class, 'existingPosts'])
    ->middleware(['agent.verify']);

Route::post('/internal/publish-post', [ContentIngestionController::class, 'store'])
    ->middleware(['agent.verify', 'throttle:10,1']);
