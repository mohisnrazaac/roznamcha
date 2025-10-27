<?php

namespace Database\Seeders;

use App\Models\Announcement;
use App\Models\Category;
use App\Models\Expense;
use App\Models\RationHistory;
use App\Models\RationItem;
use App\Models\Reminder;
use App\Models\ReportCache;
use App\Models\Role;
use App\Models\User;
use App\Models\UserSetting;
use Carbon\Carbon;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class RoznamchaDemoSeeder extends Seeder
{
    /**
     * Seed the application with Roznamcha demo data.
     */
    public function run(): void
    {
        $user = User::firstOrCreate(
            ['email' => 'demo@roznamcha.test'],
            [
                'name' => 'Roznamcha Demo',
                'password' => Hash::make('password'),
            ]
        );

        // Roles and assignment
        $adminRole = Role::firstOrCreate(
            ['slug' => 'admin'],
            ['name' => 'Administrator']
        );

        $memberRole = Role::firstOrCreate(
            ['slug' => 'member'],
            ['name' => 'Household Member']
        );

        $user->roles()->syncWithoutDetaching([$adminRole->id, $memberRole->id]);

        // Categories
        $categoryDefinitions = collect([
            ['name' => 'Ration', 'color_code' => '#facc15', 'icon' => '🛒'],
            ['name' => 'Fuel', 'color_code' => '#f97316', 'icon' => '⛽'],
            ['name' => 'School', 'color_code' => '#38bdf8', 'icon' => '🎒'],
            ['name' => 'Medicine', 'color_code' => '#f472b6', 'icon' => '💊'],
            ['name' => 'Utilities', 'color_code' => '#34d399', 'icon' => '💡'],
        ]);

        $categories = $categoryDefinitions->mapWithKeys(function (array $definition) use ($user) {
            $category = Category::updateOrCreate(
                [
                    'user_id' => $user->id,
                    'name' => $definition['name'],
                ],
                [
                    'color_code' => $definition['color_code'],
                    'icon' => $definition['icon'],
                ]
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
                'type' => 'bill',
                'title' => 'K-Electric bill',
                'description' => 'Due this Friday',
                'next_due' => Carbon::now()->addDays(3),
                'frequency' => 'monthly',
            ],
            [
                'type' => 'medicine',
                'title' => 'BP Medicine',
                'description' => 'Take after dinner',
                'next_due' => Carbon::now()->setTime(21, 0),
                'frequency' => 'daily',
            ],
            [
                'type' => 'school_fee',
                'title' => 'Kids school fee',
                'description' => 'Pay at City School',
                'next_due' => Carbon::now()->addWeek(),
                'frequency' => 'monthly',
            ],
        ];

        foreach ($reminders as $reminder) {
            Reminder::updateOrCreate(
                [
                    'user_id' => $user->id,
                    'title' => $reminder['title'],
                ],
                [
                    'type' => $reminder['type'],
                    'description' => $reminder['description'],
                    'next_due' => $reminder['next_due'],
                    'frequency' => $reminder['frequency'],
                    'status' => 'pending',
                ]
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
