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

        $query = Reminder::query();

        if (! $user->isSuperAdmin()) {
            $query->where('user_id', $user->id);
        }

        $reminders = $query
            ->orderByRaw('CASE WHEN due_date IS NULL THEN 1 ELSE 0 END')
            ->orderBy('is_done')
            ->orderBy('due_date')
            ->orderByDesc('created_at')
            ->get()
            ->map(fn (Reminder $reminder) => [
                'id' => $reminder->id,
                'title' => $reminder->title,
                'due_date' => optional($reminder->due_date)->toDateTimeString(),
                'reminder_type' => $reminder->reminder_type,
                'is_done' => (bool) $reminder->is_done,
                'notes' => $reminder->notes,
            ]);

        return Inertia::render('Admin/Reminders', [
            'user' => $user,
            'reminders' => $reminders,
        ]);
    }

    /**
     * Store a newly created reminder.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'due_date' => ['nullable', 'date'],
            'reminder_type' => ['required', 'string', 'max:50'],
            'notes' => ['nullable', 'string'],
        ]);

        Reminder::create([
            ...$validated,
            'user_id' => $request->user()->id,
        ]);

        return redirect()->route('reminders.index')->with('success', 'Reminder added.');
    }

    /**
     * Update the specified reminder.
     */
    public function update(Request $request, int $id): RedirectResponse
    {
        $reminder = Reminder::findOrFail($id);
        $user = $request->user();

        if (! $user->isSuperAdmin() && $reminder->user_id !== $user->id) {
            abort(403);
        }

        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'due_date' => ['nullable', 'date'],
            'reminder_type' => ['required', 'string', 'max:50'],
            'is_done' => ['required', 'boolean'],
            'notes' => ['nullable', 'string'],
        ]);

        $reminder->update($validated);

        return redirect()->route('reminders.index')->with('success', 'Reminder updated.');
    }

    /**
     * Remove the specified reminder.
     */
    public function destroy(Request $request, int $id): RedirectResponse
    {
        $reminder = Reminder::findOrFail($id);
        $user = $request->user();

        if (! $user->isSuperAdmin() && $reminder->user_id !== $user->id) {
            abort(403);
        }

        $reminder->delete();

        return redirect()->route('reminders.index')->with('success', 'Reminder removed.');
    }
}
