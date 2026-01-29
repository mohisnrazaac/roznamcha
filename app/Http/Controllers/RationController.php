<?php

// Purpose: Enforce multi-tenant ration scoping + defaults handling. Date: 2026-02-22. Author: Codex.

namespace App\Http\Controllers;

use App\Models\Household;
use App\Models\RationItem;
use App\Models\RationPrice;
use App\Models\User;
use App\Services\InflationService;
use Carbon\Carbon;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Schema;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class RationController extends Controller
{
    public function __construct(private readonly InflationService $inflationService)
    {
    }

    public function index(Request $request): Response
    {
        /** @var Household|null $household */
        $household = app()->bound('currentHousehold') ? app('currentHousehold') : null;
        $lastMonthRange = [
            Carbon::now()->copy()->subMonth()->startOfMonth(),
            Carbon::now()->copy()->subMonth()->endOfMonth(),
        ];
        $user = $request->user();

        $householdColumn = $this->householdColumn();
        $nameColumn = $this->nameColumn();
        $statusColumn = $this->statusColumn();
        $pricesTableExists = $this->pricesTableExists();
        $supportsDefaults = Schema::hasColumn('ration_items', 'is_default');

        $itemsQuery = RationItem::query()
            ->when($householdColumn, function ($query) use ($householdColumn, $household) {
                return $query->where($householdColumn, $household?->id);
            })
            ->when($pricesTableExists, function ($query) {
                $query->with(['prices' => fn ($relation) => $relation->orderByDesc('priced_at')->limit(12)]);
            })
            ->with('user');

        if (! $user?->isAdmin()) {
            if ($supportsDefaults) {
                $itemsQuery->where(function ($query) use ($user) {
                    $query->where('is_default', true)
                        ->orWhere('user_id', $user->id);
                });
            } else {
                $itemsQuery->where('user_id', $user->id);
            }
        } else {
            $requestedUser = $request->filled('user_id') ? (int) $request->input('user_id') : null;
            if ($requestedUser) {
                $itemsQuery->where('user_id', $requestedUser);
            }
        }

        $items = $itemsQuery
            ->orderByDesc('is_default')
            ->orderBy($nameColumn)
            ->get()
            ->map(function (RationItem $item) use ($lastMonthRange, $nameColumn, $statusColumn, $pricesTableExists, $user) {
                $prices = $pricesTableExists ? $item->prices : collect();
                $latest = $prices->sortByDesc('priced_at')->first();
                $previous = $prices
                    ->filter(fn (RationPrice $price) => $price->priced_at->betweenIncluded($lastMonthRange[0], $lastMonthRange[1]))
                    ->sortByDesc('priced_at')
                    ->first();

                $delta = $pricesTableExists
                    ? $this->inflationService->deltaForItem(
                        $item->id,
                        $lastMonthRange[0],
                        Carbon::now()
                    )
                    : null;

                return [
                    'id' => $item->id,
                    'name' => $item->{$nameColumn},
                    'unit' => $item->unit,
                    'latest_price' => $latest?->price,
                    'latest_at' => $latest?->priced_at?->toDateString(),
                    'last_month_price' => $previous?->price,
                    'delta_percent' => $delta,
                    'is_active' => $statusColumn ? (bool) $item->{$statusColumn} : true,
                    'is_default' => (bool) ($item->is_default ?? false),
                    'owner' => $item->user ? [
                        'id' => $item->user->id,
                        'name' => $item->user->name,
                        'email' => $item->user->email,
                    ] : null,
                    'can_manage' => ($item->is_default ?? false)
                        ? $user?->isAdmin()
                        : true,
                ];
            });

        return Inertia::render('Ration/Index', [
            'items' => $items,
            'filters' => $user?->isAdmin() ? [
                'user_id' => $request->integer('user_id'),
            ] : [],
            'users' => $user?->isAdmin()
                ? User::query()->orderBy('name')->get(['id', 'name', 'email'])
                : [],
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Ration/Edit', [
            'item' => null,
        ]);
    }

    public function store(Request $request)
    {
        $rules = [
            'name' => ['required', 'string', 'max:160'],
            'unit' => ['required', 'string', 'max:32'],
            'initial_price' => ['nullable', 'numeric', 'min:0.01'],
            'priced_at' => ['nullable', 'date'],
        ];

        if ($this->statusColumn()) {
            $rules['is_active'] = ['boolean'];
        }

        $validated = $request->validate($rules);
        $this->assertNoDefaultDuplicate($validated['name']);

        $household = app()->bound('currentHousehold') ? app('currentHousehold') : null;

        $statusColumn = $this->statusColumn();

        $attributes = [
            $this->nameColumn() => $validated['name'],
            'unit' => $validated['unit'],
            'user_id' => $request->user()->id,
        ];

        if ($statusColumn) {
            $attributes[$statusColumn] = $validated['is_active'] ?? true;
        }

        if ($column = $this->householdColumn()) {
            $attributes[$column] = $household?->id;
        }

        $attributes['is_default'] = false;

        $item = RationItem::create($attributes);

        if (! empty($validated['initial_price']) && $this->pricesTableExists()) {
            $pricePayload = [
                'ration_item_id' => $item->id,
                'price' => $validated['initial_price'],
                'priced_at' => $validated['priced_at'] ?? now()->toDateString(),
            ];

            if ($this->pricesHaveHouseholdColumn()) {
                $pricePayload['household_id'] = $household?->id;
            }

            RationPrice::create($pricePayload);
        }

        return redirect()->route('panel.ration.index')->with('success', 'Ration item created.');
    }

    public function edit(RationItem $ration): Response
    {
        $this->authorize('update', $ration);

        $statusColumn = $this->statusColumn();

        return Inertia::render('Ration/Edit', [
            'item' => [
                'id' => $ration->id,
                'name' => $ration->{$this->nameColumn()},
                'unit' => $ration->unit,
                'is_active' => $statusColumn ? (bool) $ration->{$statusColumn} : true,
            ],
            'priceHistory' => Schema::hasTable('ration_prices')
                ? $ration->prices()
                    ->orderByDesc('priced_at')
                    ->limit(12)
                    ->get(['id', 'price', 'priced_at'])
                    ->map(fn (RationPrice $price) => [
                        'id' => $price->id,
                        'price' => $price->price,
                        'priced_at' => $price->priced_at->toDateString(),
                    ])
                : collect(),
        ]);
    }

    public function update(Request $request, RationItem $ration)
    {
        $this->authorize('update', $ration);

        $rules = [
            'name' => ['required', 'string', 'max:160'],
            'unit' => ['required', 'string', 'max:32'],
        ];

        if ($this->statusColumn()) {
            $rules['is_active'] = ['boolean'];
        }

        $validated = $request->validate($rules);

        $payload = [
            $this->nameColumn() => $validated['name'],
            'unit' => $validated['unit'],
        ];

        if ($this->statusColumn()) {
            $payload[$this->statusColumn()] = $validated['is_active'] ?? true;
        }

        if (($ration->is_default ?? false) && ! $request->user()->isAdmin()) {
            abort(404);
        }

        $this->assertNoDefaultDuplicate($validated['name'], $ration->getKey());

        $ration->update($payload);

        return redirect()->route('panel.ration.index')->with('success', 'Ration item updated.');
    }

    public function storePrice(Request $request, RationItem $ration)
    {
        if (! $this->pricesTableExists()) {
            return redirect()->back()->with('error', 'Price history is not available yet.');
        }

        $this->authorize('update', $ration);

        $validated = $request->validate([
            'price' => ['required', 'numeric', 'min:0.01'],
            'priced_at' => ['required', 'date', 'before_or_equal:today'],
        ]);

        $payload = [
            'ration_item_id' => $ration->id,
            'price' => $validated['price'],
            'priced_at' => $validated['priced_at'],
        ];

        if ($this->pricesHaveHouseholdColumn()) {
            $payload['household_id'] = $ration->household_id;
        }

        RationPrice::create($payload);

        return redirect()->back()->with('success', 'Price recorded.');
    }

    public function destroy(RationItem $ration): RedirectResponse
    {
        if (($ration->is_default ?? false) && ! $request->user()->isAdmin()) {
            abort(404);
        }

        $this->authorize('delete', $ration);

        $ration->delete();

        return redirect()->route('panel.ration.index')->with('success', 'Ration item removed.');
    }

    private function householdColumn(): ?string
    {
        return Schema::hasColumn('ration_items', 'household_id') ? 'household_id' : null;
    }

    private function nameColumn(): string
    {
        return Schema::hasColumn('ration_items', 'name') ? 'name' : 'item_name';
    }

    private function pricesHaveHouseholdColumn(): bool
    {
        return Schema::hasTable('ration_prices') && Schema::hasColumn('ration_prices', 'household_id');
    }

    private function statusColumn(): ?string
    {
        return Schema::hasColumn('ration_items', 'is_active') ? 'is_active' : null;
    }

    private function pricesTableExists(): bool
    {
        return Schema::hasTable('ration_prices');
    }

    private function assertNoDefaultDuplicate(string $name, ?int $ignoreId = null): void
    {
        if (! Schema::hasColumn('ration_items', 'is_default')) {
            return;
        }

        $column = $this->nameColumn();
        $normalized = RationItem::normalizeName($name);

        $defaults = RationItem::query()
            ->defaults()
            ->when($ignoreId, fn ($query) => $query->where('id', '!=', $ignoreId))
            ->pluck($column)
            ->map(fn ($value) => RationItem::normalizeName($value))
            ->all();

        if (in_array($normalized, $defaults, true)) {
            throw ValidationException::withMessages([
                'name' => 'This ration item already exists as a default entry.',
            ]);
        }
    }
}
