<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Carbon\Carbon;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(): Response
    {
        // TODO: Replace mock values with real aggregates when modules are ready
        return Inertia::render('Admin/Dashboard', [
            'summary' => [
                'month' => Carbon::now()->format('F Y'),
                'total_spend' => 42650,
                'top_category' => 'Fuel',
                'alerts_due' => 2,
                'inflation_items' => 3,
            ],
            'modules' => [
                [
                    'name' => 'Kharcha Map',
                    'slug' => 'kharcha',
                    'color' => '#1E3A8A',
                    'desc' => 'Track rent, fuel, school fee, bills in plain Urdu.',
                    'route' => route('kharcha.map', [], false),
                ],
                [
                    'name' => 'Ration Brain',
                    'slug' => 'ration',
                    'color' => '#FACC15',
                    'desc' => 'Atta, ghee, daal price history and per-month burn.',
                    'route' => route('ration.index', [], false),
                ],
                [
                    'name' => 'Reminders',
                    'slug' => 'reminder',
                    'color' => '#000000',
                    'desc' => 'BP medicine, school fees, petrol refill alerts.',
                    'route' => route('reminders.index', [], false),
                ],
                [
                    'name' => 'Survival Report',
                    'slug' => 'reports',
                    'color' => '#0EA5E9',
                    'desc' => 'Month-end PDF + forecast (premium feature).',
                    'route' => route('reports.main', [], false),
                ],
            ],
        ]);
    }
}
