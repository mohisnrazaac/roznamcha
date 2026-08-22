<?php

namespace App\Providers;

use App\Models\Expense;
use App\Models\RationItem;
use App\Models\User;
use App\Patched\PatchedDailyMoneySnapshotService;
use App\Policies\KharchaPolicy;
use App\Policies\RationPolicy;
use App\Policies\UserPolicy;
use App\Services\DailyMoneySnapshotService;
use App\Support\EventRecorder;
use Illuminate\Auth\Events\Registered;
use Illuminate\Support\Facades\App;
use Illuminate\Support\Facades\Event;
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
        $this->app->bind(DailyMoneySnapshotService::class, PatchedDailyMoneySnapshotService::class);
        $this->repairDailySnapshotSources();
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        App::setLocale(config('roznamcha.lang_default', 'en'));

        Gate::policy(Expense::class, KharchaPolicy::class);
        Gate::policy(RationItem::class, RationPolicy::class);
        Gate::policy(User::class, UserPolicy::class);

        $blogLogDir = storage_path('logs/blog-pages');
        if (! is_dir($blogLogDir)) {
            mkdir($blogLogDir, 0755, true);
        }

        Event::listen(Registered::class, function (Registered $event) {
            app(EventRecorder::class)->record('signup_completed', [
                'user_id' => $event->user->id,
            ], $event->user);
        });
    }

    private function repairDailySnapshotSources(): void
    {
        $sources = config('daily_snapshot.sources', []);

        $replacements = [
            'cpi' => [
                'current' => 'https://api.worldbank.org/v2/country/PAK/indicator/FP.CPI.TOTL.ZG?format=json&per_page=1',
                'replacement' => 'https://api.worldbank.org/v2/country/PK/indicator/FP.CPI.TOTL.ZG?format=json&per_page=10',
            ],
            'spi' => [
                'current' => 'https://raw.githubusercontent.com/open-metro/datasets/main/pakistan_spi.json',
                'replacement' => 'https://www.pbs.gov.pk/price-statistics/',
            ],
            'fuel' => [
                'current' => 'https://raw.githubusercontent.com/open-metro/datasets/main/pakistan_fuel_prices.json',
                'replacement' => null,
            ],
            'utility' => [
                'current' => 'https://raw.githubusercontent.com/open-metro/datasets/main/pakistan_utility_tariff.json',
                'replacement' => null,
            ],
            'currency' => [
                'current' => 'https://cdn.jsdelivr.net/gh/fawazahmed0/currency-api@1/latest/currencies/usd/pkr.json',
                'replacement' => 'https://latest.currency-api.pages.dev/v1/currencies/usd.json',
            ],
        ];

        foreach ($replacements as $key => $replacement) {
            if (($sources[$key] ?? null) !== $replacement['current']) {
                continue;
            }

            config()->set("daily_snapshot.sources.{$key}", $replacement['replacement']);
        }
    }
}
