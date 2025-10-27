<?php

namespace App\Http\Controllers;

use App\Models\Reminder;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ReminderController extends Controller
{
    /**
     * Display a listing of reminders.
     */
    public function index(Request $request): Response
    {
        $user = $request->user();

        $reminders = Reminder::where('user_id', $user->id)
            ->orderByRaw('CASE WHEN next_due IS NULL THEN 1 ELSE 0 END')
            ->orderBy('next_due')
            ->get()
            ->map(fn (Reminder $reminder) => [
                'id' => $reminder->id,
                'type' => $reminder->type,
                'title' => $reminder->title,
                'description' => $reminder->description,
                'next_due' => $reminder->next_due?->toDateTimeString(),
                'frequency' => $reminder->frequency,
                'status' => $reminder->status,
            ]);

        return Inertia::render('Reminders', [
            'reminders' => $reminders,
            'meta' => [
                'types' => [
                    'bill' => 'Bill',
                    'school_fee' => 'School Fee',
                    'medicine' => 'Medicine',
                    'fuel' => 'Fuel',
                    'other' => 'Other',
                ],
                'frequencies' => ['daily', 'weekly', 'monthly', 'yearly'],
            ],
            'flash' => [
                'success' => session('success'),
            ],
        ]);
    }

    /**
     * Store a newly created reminder.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'type' => ['required', 'in:bill,school_fee,medicine,fuel,other'],
            'title' => ['required', 'string', 'max:150'],
            'description' => ['nullable', 'string'],
            'next_due' => ['nullable', 'date'],
            'frequency' => ['required', 'in:daily,weekly,monthly,yearly'],
        ]);

        Reminder::create([
            ...$validated,
            'user_id' => $request->user()->id,
            'status' => 'pending',
        ]);

        return redirect()
            ->route('reminders.index')
            ->with('success', 'Reminder added.');
    }

    /**
     * Update the specified reminder.
     */
    public function update(Reminder $reminder, Request $request): RedirectResponse
    {
        abort_unless($reminder->user_id === $request->user()->id, 403);

        $validated = $request->validate([
            'type' => ['required', 'in:bill,school_fee,medicine,fuel,other'],
            'title' => ['required', 'string', 'max:150'],
            'description' => ['nullable', 'string'],
            'next_due' => ['nullable', 'date'],
            'frequency' => ['required', 'in:daily,weekly,monthly,yearly'],
            'status' => ['required', 'in:pending,done'],
        ]);

        $reminder->update($validated);

        return redirect()
            ->route('reminders.index')
            ->with('success', 'Reminder updated.');
    }

    /**
     * Remove the specified reminder.
     */
    public function destroy(Reminder $reminder, Request $request): RedirectResponse
    {
        abort_unless($reminder->user_id === $request->user()->id, 403);

        $reminder->delete();

        return redirect()
            ->route('reminders.index')
            ->with('success', 'Reminder removed.');
    }
}
