<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\ForgotPasswordController;
use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\Auth\RegisterController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\KharchaController;
use App\Http\Controllers\RationController;
use App\Http\Controllers\ReminderController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\Panel\CategoryController as PanelCategoryController;
use App\Http\Controllers\EventController;
use App\Http\Controllers\ExpenseController;
use App\Http\Controllers\SurvivalReportController;
use App\Http\Controllers\ReportController;
use App\Http\Controllers\Admin\UserController as AdminUserController;
use App\Http\Controllers\Admin\CategoryController as AdminCategoryController;
use App\Http\Controllers\Admin\BlogPostController as AdminBlogPostController;
use App\Http\Controllers\Admin\BlogCategoryController as AdminBlogCategoryController;
use App\Http\Controllers\Admin\AiLogsController as AdminAiLogsController;
use App\Http\Controllers\Admin\DailyMoneySnapshotController as AdminDailyMoneySnapshotController;
use App\Http\Controllers\Admin\PasswordController as AdminPasswordController;
use App\Http\Controllers\MaintenanceTriggerController;
use App\Http\Controllers\OnboardingController;
use App\Http\Controllers\PublicPageController;
use App\Http\Controllers\ContactController;
use App\Http\Controllers\BlogPublicController;
use App\Http\Controllers\RssController;
use App\Http\Controllers\SeoPageController;
use App\Http\Controllers\SeoSitemapController;
use App\Http\Controllers\TemplateSitemapController;
use App\Http\Controllers\PublicTools\SchoolFeesPlannerController;
use App\Http\Controllers\PublicTools\ElectricityBillEstimatorController;
use App\Http\Controllers\PublicTools\RationCostEstimatorController;
use App\Http\Controllers\AiKharchaController;
use App\Http\Controllers\AiRationController;
use App\Http\Controllers\AiReminderController;
use App\Http\Controllers\AiReportController;
use App\Http\Controllers\DailyReturnSnapshotController;
use App\Http\Controllers\ChatController;
use App\Http\Controllers\GuestStateController;
use App\Http\Controllers\AskRozaController;
use App\Http\Controllers\TemplateController;
use App\Http\Controllers\ToolSnapshotController;

$maintenanceEnabled = (bool) config('maintenance.enabled', env('MAINTENANCE_PAGE_ENABLED', false));

if ($maintenanceEnabled) {
    Route::middleware('throttle:5,1')->group(function () {
        Route::get('/maintenance/run', [MaintenanceTriggerController::class, 'show'])
            ->name('maintenance.trigger');
        Route::post('/maintenance/run', [MaintenanceTriggerController::class, 'run'])
            ->name('maintenance.trigger.run');
    });
}

Route::get('/ads.txt', function () {
    $path = public_path('ads.txt');

    abort_unless(is_file($path), 404);

    return response(file_get_contents($path), 200, [
        'Content-Type' => 'text/plain; charset=UTF-8',
        'Cache-Control' => 'public, max-age=3600',
        'X-Content-Type-Options' => 'nosniff',
    ]);
})->withoutMiddleware([
    \Illuminate\Cookie\Middleware\EncryptCookies::class,
    \Illuminate\Cookie\Middleware\AddQueuedCookiesToResponse::class,
    \Illuminate\Session\Middleware\StartSession::class,
    \Illuminate\View\Middleware\ShareErrorsFromSession::class,
    \Illuminate\Foundation\Http\Middleware\ValidateCsrfToken::class,
    \Illuminate\Routing\Middleware\SubstituteBindings::class,
    \App\Http\Middleware\HandleInertiaRequests::class,
    \Illuminate\Http\Middleware\AddLinkHeadersForPreloadedAssets::class,
])->name('public.ads-txt');

// Public marketing pages
Route::get('/', [PublicPageController::class, 'home'])->name('public.home');
Route::get('/features', [PublicPageController::class, 'features'])->name('public.features');
Route::get('/kharcha-map', [PublicPageController::class, 'kharchaMap'])->name('public.kharcha-map');
Route::get('/ration-brain', [PublicPageController::class, 'rationBrain'])->name('public.ration-brain');
Route::get('/survival-report', [PublicPageController::class, 'survivalReport'])->name('public.survival-report');
Route::get('/about', [PublicPageController::class, 'about'])->name('public.about');
Route::get('/contact', [ContactController::class, 'show'])->name('public.contact');
Route::post('/contact', [ContactController::class, 'send'])->name('public.contact.send');
Route::get('/privacy-policy', [PublicPageController::class, 'privacyPolicy'])->name('public.privacy');
Route::get('/terms', [PublicPageController::class, 'terms'])->name('public.terms');
Route::view('/offline', 'offline')->name('offline');
Route::get('/tools/ration-cost-estimator', [RationCostEstimatorController::class, 'show'])
    ->name('public.tools.ration-cost-estimator');
Route::get('/tools/school-fees-planner', [SchoolFeesPlannerController::class, 'show'])
    ->name('public.tools.school-fees-planner');
Route::post('/tools/school-fees-planner/calculate', [SchoolFeesPlannerController::class, 'schoolFeesPlanner'])
    ->name('public.tools.school-fees-planner.calculate');
Route::get('/tools/electricity-bill-estimator', [ElectricityBillEstimatorController::class, 'show'])
    ->name('public.tools.electricity-bill-estimator');
Route::post('/tools/electricity-bill-estimator/calculate', [ElectricityBillEstimatorController::class, 'electricityEstimator'])
    ->name('public.tools.electricity-bill-estimator.calculate');
Route::get('/petrol-price-{city}-today', [SeoPageController::class, 'petrol'])->name('seo.petrol');
Route::get('/electricity-bill-calculator-{disco}', [SeoPageController::class, 'electricity'])->name('seo.electricity');
Route::get('/ration-cost-for-{size}-people-pakistan', [SeoPageController::class, 'ration'])->name('seo.ration');
Route::get('/templates', [TemplateController::class, 'index'])->name('templates.index');
Route::get('/templates/{slug}/download', [TemplateController::class, 'download'])->name('templates.download');
Route::get('/templates/{slug}', [TemplateController::class, 'show'])->name('templates.show');
Route::get('/blog', [BlogPublicController::class, 'index'])->name('public.blog.index');
Route::get('/blog/category/{slug}', [BlogPublicController::class, 'category'])->name('public.blog.category');
Route::get('/blog/rss.xml', [RssController::class, 'blog'])->name('public.blog.rss');
Route::get('/blog/{slug}', [BlogPublicController::class, 'show'])
    ->middleware('track.blog.view')
    ->name('public.blog.show');
Route::get('/daily-return/snapshot', [DailyReturnSnapshotController::class, 'show'])->name('daily-return.snapshot');
Route::get('/sitemap.xml', [SeoSitemapController::class, 'index'])->name('public.sitemap');
Route::get('/templates-sitemap.xml', [TemplateSitemapController::class, 'show'])->name('public.templates-sitemap');

Route::post('/events/blog-cta-click', [EventController::class, 'blogCtaClick'])
    ->middleware('track.blog.cta')
    ->name('events.blog-cta-click');
Route::post('/events', [EventController::class, 'store'])->name('events.store');
Route::post('/guest/stash', [GuestStateController::class, 'stash'])->name('guest.stash');
Route::post('/guest/ask-roza', [AskRozaController::class, 'ask'])->name('guest.askRoza');
Route::post('/tools/snapshots', [ToolSnapshotController::class, 'store'])
    ->middleware('auth')
    ->name('tools.snapshots.store');
Route::post('/templates/save', [TemplateController::class, 'saveTemplate'])
    ->middleware('auth')
    ->name('templates.save');

Route::get('/maintenance/clear-caches', function (Request $request) {
    $token = config('maintenance.secret', env('MAINTENANCE_TRIGGER_SECRET'));

    abort_unless($token && hash_equals((string) $token, (string) $request->query('token')), 403);

    Artisan::call('config:clear');
    Artisan::call('route:clear');
    Artisan::call('view:clear');

    return response()->json(['status' => 'Laravel caches cleared']);
})->name('maintenance.clear-caches');

// Authentication
Route::get('/login', [LoginController::class, 'showLogin'])->name('login');
Route::post('/login', [LoginController::class, 'login'])->name('login.attempt');

Route::get('/register', [RegisterController::class, 'showRegister'])->name('register');
Route::post('/register', [RegisterController::class, 'register'])->name('register.store');

Route::get('/forgot-password', [ForgotPasswordController::class, 'create'])
    ->middleware('guest')
    ->name('password.request');

Route::post('/forgot-password', [ForgotPasswordController::class, 'store'])
    ->middleware(['guest', 'throttle:5,1'])
    ->name('password.email');

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
        ->except(['show', 'destroy']);
    Route::match(['DELETE', 'POST'], 'kharcha/{expense}', [ExpenseController::class, 'destroy'])
        ->name('kharcha.destroy');

    Route::resource('ration', RationController::class)
        ->parameters(['ration' => 'ration'])
        ->except(['show', 'destroy']);
    Route::match(['DELETE', 'POST'], 'ration/{ration}', [RationController::class, 'destroy'])
        ->name('ration.destroy');

    Route::post('ration/{ration}/prices', [RationController::class, 'storePrice'])
        ->name('ration.prices.store');

    Route::resource('reminders', ReminderController::class)->except(['show', 'destroy']);
    Route::match(['DELETE', 'POST'], 'reminders/{reminder}', [ReminderController::class, 'destroy'])
        ->name('reminders.destroy');
    Route::post('reminders/{reminder}/toggle', [ReminderController::class, 'toggle'])->name('reminders.toggle');

    Route::post('reports/survival', [SurvivalReportController::class, 'generate'])->name('reports.survival');

    Route::resource('categories', PanelCategoryController::class)->except(['show']);
});

Route::redirect('/kharcha', '/panel/kharcha')->middleware('auth');
Route::redirect('/ration', '/panel/ration')->middleware('auth');
Route::redirect('/reminders', '/panel/reminders')->middleware('auth');

Route::get('/reports', [ReportController::class, 'index'])
    ->middleware('auth')
    ->name('reports.index');

Route::post('/chat', [ChatController::class, 'sendMessage'])
    ->middleware('web')
    ->name('chat.send');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::match(['DELETE', 'POST'], '/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    Route::get('/onboarding', [OnboardingController::class, 'index'])->name('onboarding.index');
    Route::get('/onboarding/household', [OnboardingController::class, 'household'])->name('onboarding.household');
    Route::post('/onboarding/household', [OnboardingController::class, 'storeHousehold'])->name('onboarding.household.store');
    Route::get('/onboarding/budget', [OnboardingController::class, 'budget'])->name('onboarding.budget');
    Route::post('/onboarding/budget', [OnboardingController::class, 'storeBudget'])->name('onboarding.budget.store');
    Route::get('/onboarding/first-expense', [OnboardingController::class, 'firstExpense'])->name('onboarding.first-expense');
    Route::post('/onboarding/first-expense', [OnboardingController::class, 'storeFirstExpense'])->name('onboarding.first-expense.store');
    Route::get('/onboarding/done', [OnboardingController::class, 'done'])->name('onboarding.done');

    Route::prefix('ai')
        ->middleware('ai.quota')
        ->group(function (): void {
            Route::post('/kharcha', [AiKharchaController::class, 'generate'])->name('ai.kharcha');
            Route::post('/ration', [AiRationController::class, 'generate'])->name('ai.ration');
            Route::post('/reminder', [AiReminderController::class, 'generate'])->name('ai.reminder');
            Route::post('/report', [AiReportController::class, 'generate'])->name('ai.report');
        });
});

// Admin routes
Route::middleware(['auth', 'admin'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/users', [AdminUserController::class, 'index'])->name('users.index');
    Route::get('/users/create', [AdminUserController::class, 'create'])->name('users.create');
    Route::post('/users', [AdminUserController::class, 'store'])->name('users.store');
    Route::get('/users/{user}', [AdminUserController::class, 'show'])->name('users.show');
    Route::match(['DELETE', 'POST'], '/users/{user}/kharcha/{expense}', [AdminUserController::class, 'destroyKharcha'])->name('users.kharcha.destroy');
    Route::match(['DELETE', 'POST'], '/users/{user}/ration/{ration}', [AdminUserController::class, 'destroyRation'])->name('users.ration.destroy');
    Route::match(['DELETE', 'POST'], '/users/{user}', [AdminUserController::class, 'destroy'])->name('users.destroy');

    Route::get('/categories', [AdminCategoryController::class, 'index'])->name('categories.index');
    Route::get('/categories/create', [AdminCategoryController::class, 'create'])->name('categories.create');
    Route::post('/categories', [AdminCategoryController::class, 'store'])->name('categories.store');
    Route::get('/categories/{category}/edit', [AdminCategoryController::class, 'edit'])->name('categories.edit');
    Route::put('/categories/{category}', [AdminCategoryController::class, 'update'])->name('categories.update');
    Route::match(['DELETE', 'POST'], '/categories/{category}', [AdminCategoryController::class, 'destroy'])->name('categories.destroy');

    Route::get('/ai-logs', [AdminAiLogsController::class, 'index'])->name('ai-logs.index');
    Route::get('/daily-return', [AdminDailyMoneySnapshotController::class, 'index'])->name('daily-return.index');
    Route::post('/daily-return/snapshots', [AdminDailyMoneySnapshotController::class, 'store'])->name('daily-return.snapshots.store');

    Route::prefix('blog')->name('blog.')->group(function () {
        Route::get('/posts', [AdminBlogPostController::class, 'index'])->name('posts.index');
        Route::get('/posts/create', [AdminBlogPostController::class, 'create'])->name('posts.create');
        Route::post('/posts', [AdminBlogPostController::class, 'store'])->name('posts.store');
        Route::get('/posts/{post}/edit', [AdminBlogPostController::class, 'edit'])->name('posts.edit');
        Route::put('/posts/{post}', [AdminBlogPostController::class, 'update'])->name('posts.update');
        Route::delete('/posts/{post}', [AdminBlogPostController::class, 'destroy'])->name('posts.destroy');
        Route::post('/posts/{post}/publish', [AdminBlogPostController::class, 'publish'])->name('posts.publish');
        Route::post('/posts/{post}/draft', [AdminBlogPostController::class, 'draft'])->name('posts.draft');

        Route::get('/categories', [AdminBlogCategoryController::class, 'index'])->name('categories.index');
        Route::post('/categories', [AdminBlogCategoryController::class, 'store'])->name('categories.store');
        Route::put('/categories/{category}', [AdminBlogCategoryController::class, 'update'])->name('categories.update');
        Route::delete('/categories/{category}', [AdminBlogCategoryController::class, 'destroy'])->name('categories.destroy');
    });

});

Route::post('/admin/update-password', [AdminPasswordController::class, 'update'])
    ->middleware(['auth', 'throttle:3,1'])
    ->name('admin.password.update');

require __DIR__.'/auth.php';
