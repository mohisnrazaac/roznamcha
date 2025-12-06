<?php

namespace App\Http\Controllers;

use App\Models\Household;
use App\Models\Reminder;
use App\Support\ReminderScheduler;
use Carbon\Carbon;
use Carbon\CarbonInterface;
use Cron\CronExpression;
use Illuminate\Validation\ValidationException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Schema;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class ReminderController extends Controller
{
    protected array $types = ['finance', 'health', 'faith', 'other'];

    public function index(): Response
    {
        /** @var Household|null $household */
        $household = app()->bound('currentHousehold') ? app('currentHousehold') : null;

        $householdColumn = $this->householdColumn();
        $activeColumn = $this->activeColumn();
        $scheduleColumn = $this->scheduleColumn();
        $nextRunColumn = $this->nextRunColumn();
        $notesColumn = $this->notesColumn();

        $reminders = Reminder::query()
            ->when($householdColumn, function ($query) use ($householdColumn, $household) {
                return $query->where($householdColumn, $household?->id);
            })
            ->when($activeColumn, fn ($query) => $query->orderByDesc($activeColumn))
            ->orderBy('title')
            ->get()
            ->map(function (Reminder $reminder) use ($scheduleColumn, $nextRunColumn, $activeColumn, $notesColumn) {
                $timezone = $this->timezoneColumn() ? $reminder->{$this->timezoneColumn()} : config('app.timezone');

                $nextRun = $nextRunColumn ? $reminder->{$nextRunColumn} : null;
                $nextRunDisplay = $nextRun ? $nextRun->copy()->setTimezone($timezone)->toDayDateTimeString() : null;

                return [
                    'id' => $reminder->id,
                    'title' => $reminder->title,
                    'type' => $reminder->{$this->typeColumn()},
                    'schedule_cron' => $scheduleColumn ? $reminder->{$scheduleColumn} : null,
                    'starts_on' => $this->startsColumn() ? optional($reminder->{$this->startsColumn()})->toDateString() : null,
                    'ends_on' => $this->endsColumn() ? optional($reminder->{$this->endsColumn()})->toDateString() : null,
                    'timezone' => $timezone,
                    'is_active' => $activeColumn ? (bool) $reminder->{$activeColumn} : true,
                    'notes' => $notesColumn ? $reminder->{$notesColumn} : null,
                    'next_run_at' => $nextRun?->toIso8601String(),
                    'next_run_display' => $nextRunDisplay,
                ];
            });

        return Inertia::render('Reminders/Index', [
            'reminders' => $reminders,
            'meta' => [
                'types' => $this->types,
            ],
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Reminders/Create', [
            'types' => $this->types,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $this->validatedData($request);
        $household = app()->bound('currentHousehold') ? app('currentHousehold') : null;

        $payload = [
            'user_id' => $request->user()->id,
            'title' => $validated['title'],
        ];

        if ($column = $this->householdColumn()) {
            $payload[$column] = $household?->id;
        }

        $payload[$this->typeColumn()] = $validated['type'];
        if ($this->typeColumn() !== 'reminder_type' && Schema::hasColumn('reminders', 'reminder_type')) {
            $payload['reminder_type'] = $validated['type'];
        }
        if ($this->typeColumn() !== 'reminder_type' && Schema::hasColumn('reminders', 'reminder_type')) {
            $payload['reminder_type'] = $validated['type'];
        }

        if ($scheduleColumn = $this->scheduleColumn()) {
            if ($scheduleColumn === 'schedule_cron') {
                $payload[$scheduleColumn] = $validated['schedule_cron'];
            }
        } elseif ($notesColumn = $this->notesColumn()) {
            $payload[$notesColumn] = trim(($validated['notes'] ?? '').' '.$validated['schedule_cron']);
        }

        if ($nextRunColumn = $this->nextRunColumn()) {
            $payload[$nextRunColumn] = $this->calculateNextRun($validated);
        }

        if ($startsColumn = $this->startsColumn()) {
            $payload[$startsColumn] = $validated['starts_on'];
        }

        if ($endsColumn = $this->endsColumn()) {
            $payload[$endsColumn] = $validated['ends_on'];
        }

        if ($timezoneColumn = $this->timezoneColumn()) {
            $payload[$timezoneColumn] = $validated['timezone'];
        }

        if ($notesColumn = $this->notesColumn()) {
            $payload[$notesColumn] = $validated['notes'] ?? ($payload[$notesColumn] ?? null);
        }

        if ($activeColumn = $this->activeColumn()) {
            $payload[$activeColumn] = $validated['is_active'] ?? true;
        }

        Reminder::create($payload);

        return redirect()->route('panel.reminders.index')->with('success', 'Reminder created.');
    }

    public function edit(Reminder $reminder): Response
    {
        $this->authorizeReminder($reminder);

        return Inertia::render('Reminders/Create', [
            'types' => $this->types,
            'reminder' => [
                'id' => $reminder->id,
                'title' => $reminder->title,
                'type' => $reminder->{$this->typeColumn()},
                'schedule_cron' => $this->scheduleColumn() ? $reminder->{$this->scheduleColumn()} : null,
                'starts_on' => $this->startsColumn() ? optional($reminder->{$this->startsColumn()})->toDateString() : null,
                'ends_on' => $this->endsColumn() ? optional($reminder->{$this->endsColumn()})->toDateString() : null,
                'timezone' => $this->timezoneColumn() ? $reminder->{$this->timezoneColumn()} : config('app.timezone'),
                'is_active' => $this->activeColumn() ? (bool) $reminder->{$this->activeColumn()} : true,
                'notes' => $this->notesColumn() ? $reminder->{$this->notesColumn()} : null,
            ],
        ]);
    }

    public function update(Request $request, Reminder $reminder)
    {
        $this->authorizeReminder($reminder);

        $validated = $this->validatedData($request);

        $payload = [
            'title' => $validated['title'],
        ];

        $payload[$this->typeColumn()] = $validated['type'];

        if ($scheduleColumn = $this->scheduleColumn()) {
            if ($scheduleColumn === 'schedule_cron') {
                $payload[$scheduleColumn] = $validated['schedule_cron'];
            }
        }

        if ($nextRunColumn = $this->nextRunColumn()) {
            $payload[$nextRunColumn] = $this->calculateNextRun($validated);
        }

        if ($startsColumn = $this->startsColumn()) {
            $payload[$startsColumn] = $validated['starts_on'];
        }

        if ($endsColumn = $this->endsColumn()) {
            $payload[$endsColumn] = $validated['ends_on'];
        }

        if ($timezoneColumn = $this->timezoneColumn()) {
            $payload[$timezoneColumn] = $validated['timezone'];
        }

        if ($notesColumn = $this->notesColumn()) {
            $payload[$notesColumn] = $validated['notes'];
        }

        if ($activeColumn = $this->activeColumn()) {
            $payload[$activeColumn] = $validated['is_active'] ?? true;
        }

        $reminder->update($payload);

        return redirect()->route('panel.reminders.index')->with('success', 'Reminder updated.');
    }

    public function destroy(Reminder $reminder)
    {
        $this->authorizeReminder($reminder);
        $reminder->delete();

        return redirect()->route('panel.reminders.index')->with('success', 'Reminder removed.');
    }

    public function toggle(Reminder $reminder)
    {
        $this->authorizeReminder($reminder);

        if ($column = $this->activeColumn()) {
            $reminder->update([$column => ! (bool) $reminder->{$column}]);
        }

        return redirect()->back()->with('success', 'Reminder status updated.');
    }

    protected function validatedData(Request $request): array
    {
        $rules = [
            'title' => ['required', 'string', 'max:255'],
            'type' => ['required', Rule::in($this->types)],
            'notes' => ['nullable', 'string'],
        ];

        $rules['schedule_cron'] = [
            'required',
            'regex:/^([^\s]+ ){4}[^\s]+$/',
            function ($attribute, $value, $fail) {
                if (! CronExpression::isValidExpression($value)) {
                    $fail('The schedule must be a valid cron expression.');
                }
            },
        ];

        if ($this->startsColumn()) {
            $rules['starts_on'] = ['nullable', 'date'];
            $rules['ends_on'] = ['nullable', 'date', 'after_or_equal:starts_on'];
        } else {
            $rules['starts_on'] = ['nullable'];
            $rules['ends_on'] = ['nullable'];
        }

        $timezoneRule = ['string', 'max:64', 'timezone:all'];
        $rules['timezone'] = $this->timezoneColumn()
            ? array_merge(['required'], $timezoneRule)
            : array_merge(['nullable'], $timezoneRule);

        if ($this->activeColumn()) {
            $rules['is_active'] = ['boolean'];
        } else {
            $rules['is_active'] = ['nullable'];
        }

        return $request->validate($rules);
    }

    protected function authorizeReminder(Reminder $reminder): void
    {
        $household = app()->bound('currentHousehold') ? app('currentHousehold') : null;
        $column = $this->householdColumn();

        if ($column && $household && $reminder->{$column} !== $household->id) {
            abort(403);
        }
    }

    private function householdColumn(): ?string
    {
        return Schema::hasColumn('reminders', 'household_id') ? 'household_id' : null;
    }

    private function activeColumn(): ?string
    {
        if (Schema::hasColumn('reminders', 'is_active')) {
            return 'is_active';
        }

        if (Schema::hasColumn('reminders', 'status')) {
            return 'status';
        }

        if (Schema::hasColumn('reminders', 'is_done')) {
            return 'is_done';
        }

        return null;
    }

    private function typeColumn(): string
    {
        if (Schema::hasColumn('reminders', 'type')) {
            return 'type';
        }

        if (Schema::hasColumn('reminders', 'reminder_type')) {
            return 'reminder_type';
        }

        return 'type';
    }

    private function scheduleColumn(): ?string
    {
        if (Schema::hasColumn('reminders', 'schedule_cron')) {
            return 'schedule_cron';
        }

        return null;
    }

    private function nextRunColumn(): ?string
    {
        if (Schema::hasColumn('reminders', 'next_run_at')) {
            return 'next_run_at';
        }

        if (Schema::hasColumn('reminders', 'next_due')) {
            return 'next_due';
        }

        return null;
    }

    private function calculateNextRun(array $data): ?CarbonInterface
    {
        if (empty($data['schedule_cron'])) {
            return null;
        }

        $timezone = $data['timezone'] ?? config('app.timezone');
        $starts = ! empty($data['starts_on']) ? Carbon::parse($data['starts_on'], $timezone) : null;
        $ends = ! empty($data['ends_on']) ? Carbon::parse($data['ends_on'], $timezone) : null;

        try {
            return ReminderScheduler::nextRun($data['schedule_cron'], $timezone, $starts, $ends);
        } catch (\InvalidArgumentException $exception) {
            throw ValidationException::withMessages([
                'schedule_cron' => 'Invalid cron expression.',
            ]);
        }
    }

    private function notesColumn(): ?string
    {
        if (Schema::hasColumn('reminders', 'notes')) {
            return 'notes';
        }

        if (Schema::hasColumn('reminders', 'description')) {
            return 'description';
        }

        return null;
    }

    private function startsColumn(): ?string
    {
        return Schema::hasColumn('reminders', 'starts_on') ? 'starts_on' : null;
    }

    private function endsColumn(): ?string
    {
        return Schema::hasColumn('reminders', 'ends_on') ? 'ends_on' : null;
    }

    private function timezoneColumn(): ?string
    {
        return Schema::hasColumn('reminders', 'timezone') ? 'timezone' : null;
    }
}
