<?php

namespace Database\Seeders;

use App\Models\Announcement;
use App\Models\Category;
use App\Models\Expense;
use App\Models\RationHistory;
use App\Models\RationItem;
use App\Models\Reminder;
use App\Models\ReportCache;
use App\Models\User;
use App\Models\UserSetting;
use App\Support\ReminderScheduler;
use Carbon\Carbon;
use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class RoznamchaDemoSeeder extends Seeder
{
    /**
     * Seed the application with Roznamcha demo data.
     */
    public function run(): void
    {
        $user = User::updateOrCreate(
            ['email' => 'demo@roznamcha.test'],
            [
                'name' => 'Roznamcha Demo',
                'password' => Hash::make('password'),
                'role' => 'admin',
            ]
        );

        // Categories
        $categoryDefinitions = collect([
            ['name' => 'Ration', 'description' => 'Groceries, staples and ration stock'],
            ['name' => 'Fuel', 'description' => 'Petrol, diesel and transport'],
            ['name' => 'School', 'description' => 'School fees and education expenses'],
            ['name' => 'Medicine', 'description' => 'Healthcare and medicine'],
            ['name' => 'Utilities', 'description' => 'Bills and utilities'],
        ]);

        $categories = $categoryDefinitions->mapWithKeys(function (array $definition) {
            $category = Category::updateOrCreate(
                ['name' => $definition['name']],
                ['description' => $definition['description'] ?? null]
            );

            return [$definition['name'] => $category];
        });

        // Expenses
        $expenseDefinitions = [
            ['date' => Carbon::now()->subDays(1), 'category' => 'Ration', 'description' => 'Utility Store restock', 'amount' => 2150],
            ['date' => Carbon::now()->subDays(1), 'category' => 'Fuel', 'description' => 'Bike refill', 'amount' => 3000],
            ['date' => Carbon::now()->subDays(2), 'category' => 'School', 'description' => 'Fee advance', 'amount' => 15000],
            ['date' => Carbon::now()->subDays(3), 'category' => 'Medicine', 'description' => 'BP tablets', 'amount' => 1450],
            ['date' => Carbon::now()->subWeek(), 'category' => 'Utilities', 'description' => 'KE bill', 'amount' => 6200],
        ];

        foreach ($expenseDefinitions as $definition) {
            Expense::updateOrCreate(
                [
                    'user_id' => $user->id,
                    'date' => $definition['date']->toDateString(),
                    'description' => $definition['description'],
                ],
                [
                    'category_id' => $categories[$definition['category']]->id ?? null,
                    'amount' => $definition['amount'],
                ]
            );
        }

        // Ration items
        $rationItems = collect([
            [
                'item_name' => 'Atta',
                'unit' => 'kg',
                'stock_quantity' => 15,
                'daily_usage' => 1.5,
                'price_per_unit' => 110,
            ],
            [
                'item_name' => 'Sugar',
                'unit' => 'kg',
                'stock_quantity' => 6,
                'daily_usage' => 0.4,
                'price_per_unit' => 180,
            ],
            [
                'item_name' => 'Cooking Oil',
                'unit' => 'litre',
                'stock_quantity' => 3,
                'daily_usage' => 0.2,
                'price_per_unit' => 520,
            ],
        ])->map(function (array $definition) use ($user) {
            return RationItem::updateOrCreate(
                [
                    'user_id' => $user->id,
                    'item_name' => $definition['item_name'],
                ],
                [
                    'unit' => $definition['unit'],
                    'stock_quantity' => $definition['stock_quantity'],
                    'daily_usage' => $definition['daily_usage'],
                    'price_per_unit' => $definition['price_per_unit'],
                ]
            );
        });

        // Ration history snapshot
        foreach ($rationItems as $item) {
            RationHistory::updateOrCreate(
                [
                    'ration_item_id' => $item->id,
                    'change_date' => Carbon::now()->subDays(2)->toDateString(),
                    'change_type' => 'add_stock',
                ],
                [
                    'quantity_change' => $item->stock_quantity,
                    'notes' => 'Initial inventory load',
                ]
            );
        }

        // Reminders
        $reminders = [
            [
                'type' => 'finance',
                'title' => 'K-Electric bill',
                'notes' => 'Due this Friday',
                'schedule_cron' => '0 18 * * *',
                'timezone' => 'Asia/Karachi',
            ],
            [
                'type' => 'health',
                'title' => 'BP Medicine',
                'notes' => 'Take after dinner',
                'schedule_cron' => '0 21 * * *',
                'timezone' => 'Asia/Karachi',
            ],
            [
                'type' => 'finance',
                'title' => 'Kids school fee',
                'notes' => 'Pay at City School',
                'schedule_cron' => '0 8 1 * *',
                'timezone' => 'Asia/Karachi',
            ],
        ];

        foreach ($reminders as $definition) {
            $starts = Carbon::now($definition['timezone'])->toDateString();
            $nextRun = ReminderScheduler::nextRun(
                $definition['schedule_cron'],
                $definition['timezone'],
                Carbon::parse($starts, $definition['timezone'])
            );

            $payload = [
                'type' => $definition['type'],
                'notes' => $definition['notes'],
                'schedule_cron' => $definition['schedule_cron'],
                'timezone' => $definition['timezone'],
                'starts_on' => $starts,
                'next_run_at' => $nextRun,
                'is_active' => true,
            ];

            if (Schema::hasColumn('reminders', 'reminder_type')) {
                $payload['reminder_type'] = $definition['type'];
            }

            Reminder::updateOrCreate(
                [
                    'user_id' => $user->id,
                    'title' => $definition['title'],
                ],
                $payload
            );
        }

        // Reports cache snapshot
        ReportCache::updateOrCreate(
            [
                'user_id' => $user->id,
                'period_start' => Carbon::now()->startOfMonth()->toDateString(),
                'period_end' => Carbon::now()->endOfMonth()->toDateString(),
            ],
            [
                'total_spend' => collect($expenseDefinitions)->sum('amount'),
                'top_categories_json' => [
                    'School' => 15000,
                    'Utilities' => 6200,
                    'Fuel' => 3000,
                    'Ration' => 2150,
                    'Medicine' => 1450,
                ],
                'ration_days_left_snapshot' => 9,
                'warnings_text' => 'Medicine stock low after 9 days',
                'generated_at' => Carbon::now(),
            ]
        );

        // User settings
        UserSetting::updateOrCreate(
            [
                'user_id' => $user->id,
                'key' => 'currency',
            ],
            ['value' => 'PKR']
        );

        UserSetting::updateOrCreate(
            [
                'user_id' => $user->id,
                'key' => 'language',
            ],
            ['value' => 'ur']
        );

        // Announcements
        Announcement::updateOrCreate(
            ['title' => 'Roznamcha Early Access'],
            [
                'content' => 'Thanks for trying Roznamcha. Track ration, kharcha and bills in one cockpit.',
                'target_audience' => 'all',
                'is_published' => true,
            ]
        );
    }
}
