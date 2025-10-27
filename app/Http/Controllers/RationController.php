<?php

namespace App\Http\Controllers;

use App\Models\RationHistory;
use App\Models\RationItem;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class RationController extends Controller
{
    /**
     * Display the ration inventory overview.
     */
    public function index(Request $request): Response
    {
        $user = $request->user();

        $items = RationItem::with([
            'history' => fn ($query) => $query->latest('change_date')->limit(5),
        ])
            ->where('user_id', $user->id)
            ->orderBy('item_name')
            ->get()
            ->map(function (RationItem $item) {
                $daysLeft = $item->daily_usage > 0
                    ? (int) floor($item->stock_quantity / max($item->daily_usage, 0.0001))
                    : null;

                return [
                    'id' => $item->id,
                    'item_name' => $item->item_name,
                    'unit' => $item->unit,
                    'stock_quantity' => (float) $item->stock_quantity,
                    'daily_usage' => (float) $item->daily_usage,
                    'price_per_unit' => $item->price_per_unit ? (float) $item->price_per_unit : null,
                    'days_left' => $daysLeft,
                    'history' => $item->history->map(fn (RationHistory $history) => [
                        'id' => $history->id,
                        'change_date' => $history->change_date->toDateString(),
                        'change_type' => $history->change_type,
                        'quantity_change' => (float) $history->quantity_change,
                        'notes' => $history->notes,
                    ]),
                ];
            });

        return Inertia::render('Ration', [
            'items' => $items,
            'flash' => [
                'success' => session('success'),
            ],
        ]);
    }

    /**
     * Store a new ration item.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'item_name' => ['required', 'string', 'max:100'],
            'unit' => ['nullable', 'string', 'max:20'],
            'stock_quantity' => ['required', 'numeric', 'min:0'],
            'daily_usage' => ['required', 'numeric', 'min:0'],
            'price_per_unit' => ['nullable', 'numeric', 'min:0'],
        ]);

        $item = new RationItem($validated);
        $item->user_id = $request->user()->id;
        $item->save();

        if ($item->stock_quantity > 0) {
            RationHistory::create([
                'ration_item_id' => $item->id,
                'change_date' => now()->toDateString(),
                'change_type' => 'add_stock',
                'quantity_change' => $item->stock_quantity,
                'notes' => 'Initial stock entry',
            ]);
        }

        return redirect()
            ->route('ration.index')
            ->with('success', 'Ration item added.');
    }

    /**
     * Update the stored details for a ration item.
     */
    public function update(RationItem $rationItem, Request $request): RedirectResponse
    {
        abort_unless($rationItem->user_id === $request->user()->id, 403);

        $validated = $request->validate([
            'item_name' => ['required', 'string', 'max:100'],
            'unit' => ['nullable', 'string', 'max:20'],
            'stock_quantity' => ['required', 'numeric', 'min:0'],
            'daily_usage' => ['required', 'numeric', 'min:0'],
            'price_per_unit' => ['nullable', 'numeric', 'min:0'],
            'notes' => ['nullable', 'string', 'max:255'],
        ]);

        $notes = $validated['notes'] ?? null;
        unset($validated['notes']);

        $originalStock = $rationItem->stock_quantity;

        $rationItem->update($validated);

        $delta = $rationItem->stock_quantity - $originalStock;

        if ($delta !== 0.0) {
            RationHistory::create([
                'ration_item_id' => $rationItem->id,
                'change_date' => now()->toDateString(),
                'change_type' => $delta > 0 ? 'add_stock' : 'consume',
                'quantity_change' => abs($delta),
                'notes' => $notes ?? 'Stock adjustment',
            ]);
        }

        return redirect()
            ->route('ration.index')
            ->with('success', 'Ration item updated.');
    }

    /**
     * Remove a ration item and its history.
     */
    public function destroy(RationItem $rationItem, Request $request): RedirectResponse
    {
        abort_unless($rationItem->user_id === $request->user()->id, 403);

        $rationItem->history()->delete();
        $rationItem->delete();

        return redirect()
            ->route('ration.index')
            ->with('success', 'Ration item removed.');
    }
}
