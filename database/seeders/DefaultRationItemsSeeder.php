<?php

// Purpose: Seed shared default ration items for all users. Date: 2026-02-22. Author: Codex.

namespace Database\Seeders;

use App\Models\RationItem;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Schema;

class DefaultRationItemsSeeder extends Seeder
{
    public function run(): void
    {
        $defaults = [
            ['name' => 'Wheat Flour', 'unit' => 'kg'],
            ['name' => 'Rice', 'unit' => 'kg'],
            ['name' => 'Sugar', 'unit' => 'kg'],
            ['name' => 'Cooking Oil', 'unit' => 'liter'],
            ['name' => 'Milk', 'unit' => 'liter'],
            ['name' => 'Eggs', 'unit' => 'dozen'],
            ['name' => 'Chicken', 'unit' => 'kg'],
            ['name' => 'Lentils', 'unit' => 'kg'],
            ['name' => 'Tea', 'unit' => 'pack'],
            ['name' => 'Salt', 'unit' => 'kg'],
        ];

        $nameColumn = Schema::hasColumn('ration_items', 'name') ? 'name' : 'item_name';
        $hasActive = Schema::hasColumn('ration_items', 'is_active');

        $existing = RationItem::query()
            ->defaults()
            ->pluck($nameColumn)
            ->map(fn ($value) => RationItem::normalizeName($value))
            ->all();

        foreach ($defaults as $item) {
            $normalized = RationItem::normalizeName($item['name']);

            if (in_array($normalized, $existing, true)) {
                continue;
            }

            $payload = [
                'user_id' => null,
                $nameColumn => $item['name'],
                'unit' => $item['unit'],
                'is_default' => true,
            ];

            if ($hasActive) {
                $payload['is_active'] = true;
            }

            RationItem::create($payload);
            $existing[] = $normalized;
        }
    }
}
