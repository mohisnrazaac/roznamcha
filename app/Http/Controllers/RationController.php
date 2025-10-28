<?php

namespace App\Http\Controllers;

use App\Models\RationEntry;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class RationController extends Controller
{
    public function index(Request $request): Response
    {
        $user = $request->user();

        $query = RationEntry::query();

        if (! $user->isSuperAdmin()) {
            $query->where('user_id', $user->id);
        }

        $entries = $query
            ->latest('created_at')
            ->limit(50)
            ->get()
            ->map(function (RationEntry $entry) {
                return [
                    'id' => $entry->id,
                    'item_name' => $entry->item_name,
                    'qty_used' => (float) $entry->qty_used,
                    'unit' => $entry->unit,
                    'days_left_estimate' => $entry->days_left_estimate,
                    'notes' => $entry->notes,
                    'created_at' => optional($entry->created_at)->toDateTimeString(),
                ];
            });

        return Inertia::render('Admin/Ration', [
            'user' => $user,
            'entries' => $entries,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'item_name' => ['required', 'string', 'max:255'],
            'qty_used' => ['required', 'numeric'],
            'unit' => ['required', 'string', 'max:50'],
            'days_left_estimate' => ['nullable', 'integer'],
            'notes' => ['nullable', 'string'],
        ]);

        RationEntry::create([
            ...$validated,
            'user_id' => $request->user()->id,
        ]);

        return redirect()->route('ration.index')->with('success', 'Ration entry recorded.');
    }

    public function update(Request $request, int $id): RedirectResponse
    {
        $entry = RationEntry::findOrFail($id);
        $user = $request->user();

        if (! $user->isSuperAdmin() && $entry->user_id !== $user->id) {
            abort(403);
        }

        $validated = $request->validate([
            'item_name' => ['required', 'string', 'max:255'],
            'qty_used' => ['required', 'numeric'],
            'unit' => ['required', 'string', 'max:50'],
            'days_left_estimate' => ['nullable', 'integer'],
            'notes' => ['nullable', 'string'],
        ]);

        $entry->update($validated);

        return redirect()->route('ration.index')->with('success', 'Ration entry updated.');
    }

    public function destroy(Request $request, int $id): RedirectResponse
    {
        $entry = RationEntry::findOrFail($id);
        $user = $request->user();

        if (! $user->isSuperAdmin() && $entry->user_id !== $user->id) {
            abort(403);
        }

        $entry->delete();

        return redirect()->route('ration.index')->with('success', 'Ration entry removed.');
    }
}
