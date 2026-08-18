<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Console\Scheduling\Schedule;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withCommands([
        __DIR__.'/../routes/seo_console.php',
        __DIR__.'/../routes/blog_archive_console.php',
    ])
    ->withSchedule(function (Schedule $schedule): void {
        $schedule->command('roznamcha:refresh-seo-snapshots')
            ->dailyAt('00:15')
            ->timezone(config('app.timezone', 'Asia/Karachi'));

        $schedule->command('pakfuel:scrape-city-prices')
            ->mondays()
            ->at('06:00')
            ->timezone(config('app.timezone', 'Asia/Karachi'));

        $schedule->command('pakwheels:scrape-fuel-prices')
            ->mondays()
            ->at('06:10')
            ->timezone(config('app.timezone', 'Asia/Karachi'));
    })
    ->withMiddleware(function (Middleware $middleware): void {
        $middleware->web(append: [
            \App\Http\Middleware\HandleInertiaRequests::class,
            \Illuminate\Http\Middleware\AddLinkHeadersForPreloadedAssets::class,
            \App\Http\Middleware\SecurityHeaders::class,
        ]);

        $middleware->alias([
            'admin' => \App\Http\Middleware\EnsureUserIsAdmin::class,
            'set.household' => \App\Http\Middleware\SetHouseholdContext::class,
            'track.blog.view' => \App\Http\Middleware\TrackBlogView::class,
            'track.blog.cta' => \App\Http\Middleware\TrackBlogCtaClick::class,
            'ai.quota' => \App\Http\Middleware\CheckAiQuota::class,
            'cache.public' => \App\Http\Middleware\PublicCacheHeaders::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        //
    })->create();
