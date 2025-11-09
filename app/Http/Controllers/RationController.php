<?php

namespace App\Http\Controllers;

use App\Models\Household;
use App\Models\RationItem;
use App\Models\RationPrice;
use App\Services\InflationService;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Schema;
use Inertia\Inertia;
use Inertia\Response;

class RationController extends Controller
{
    public function __construct(private readonly InflationService $inflationService)
    {
    }

    public function index(): Response
    {
        /** @var Household|null $household */
        $household = app()->bound('currentHousehold') ? app('currentHousehold') : null;
        $lastMonthRange = [
            Carbon::now()->copy()->subMonth()->startOfMonth(),
            Carbon::now()->copy()->subMonth()->endOfMonth(),
        ];

        $householdColumn = $this->householdColumn();
        $nameColumn = $this->nameColumn();
        $statusColumn = $this->statusColumn();
        $pricesTableExists = $this->pricesTableExists();

        $items = RationItem::query()
            ->when($householdColumn, function ($query) use ($householdColumn, $household) {
                return $query->where($householdColumn, $household?->id);
            })
            ->when($pricesTableExists, function ($query) {
                $query->with(['prices' => fn ($relation) => $relation->orderByDesc('priced_at')->limit(12)]);
            })
            ->orderBy($nameColumn)
            ->get()
            ->map(function (RationItem $item) use ($lastMonthRange, $nameColumn, $statusColumn, $pricesTableExists) {
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
                ];
            });

        return Inertia::render('Ration/Index', [
            'items' => $items,
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
        $this->authorizeItem($ration);

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
        $this->authorizeItem($ration);

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

        $ration->update($payload);

        return redirect()->route('panel.ration.index')->with('success', 'Ration item updated.');
    }

    public function storePrice(Request $request, RationItem $ration)
    {
        if (! $this->pricesTableExists()) {
            return redirect()->back()->with('error', 'Price history is not available yet.');
        }

        $this->authorizeItem($ration);

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

    protected function authorizeItem(RationItem $item): void
    {
        $household = app()->bound('currentHousehold') ? app('currentHousehold') : null;
        $column = $this->householdColumn();

        if ($column && $household && $item->{$column} !== $household->id) {
            abort(403);
        }
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
}
