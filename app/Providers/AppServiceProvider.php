<?php

namespace App\Providers;

use App\Models\Expense;
use App\Models\RationItem;
use App\Models\User;
use App\Policies\KharchaPolicy;
use App\Policies\RationPolicy;
use App\Policies\UserPolicy;
use Illuminate\Support\Facades\App;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Vite;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        App::setLocale(config('roznamcha.lang_default', 'en'));
        Vite::prefetch(concurrency: 3);

        Gate::policy(Expense::class, KharchaPolicy::class);
        Gate::policy(RationItem::class, RationPolicy::class);
        Gate::policy(User::class, UserPolicy::class);
    }
}
