<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Validation\ValidationException;
use Throwable;

class MaintenanceTriggerController extends Controller
{
    public function show()
    {
        $this->abortIfDisabled();

        return view('maintenance.run');
    }

    public function run(Request $request)
    {
        $this->abortIfDisabled();

        $data = $request->validate([
            'token' => ['required', 'string'],
        ]);

        if (! hash_equals($this->secret(), (string) $data['token'])) {
            throw ValidationException::withMessages([
                'token' => __('Invalid secret token.'),
            ]);
        }

        $migration = $this->executeCommand('migrate', ['--force' => true]);

        $seeder = $migration['success']
            ? $this->executeCommand('db:seed', ['--force' => true])
            : $this->skippedCommand('db:seed', __('Seeder was skipped because migrations failed.'));

        $results = [
            'migration' => $migration,
            'seeder' => $seeder,
        ];

        $hasFailures = collect($results)->contains(fn ($result) => ! $result['success']);

        $flash = [
            'results' => $results,
        ];

        if ($hasFailures) {
            $flash['runner_error'] = __('Check the output below: at least one command failed or was skipped.');
        } else {
            $flash['status'] = __('Migrations and seeders executed successfully.');
        }

        return back()->with($flash);
    }

    private function abortIfDisabled(): void
    {
        abort_unless($this->isEnabled(), 404);
    }

    private function isEnabled(): bool
    {
        return (bool) config('maintenance.enabled', env('MAINTENANCE_PAGE_ENABLED', false));
    }

    private function secret(): string
    {
        return (string) config('maintenance.secret', env('MAINTENANCE_TRIGGER_SECRET', ''));
    }

    private function executeCommand(string $command, array $parameters): array
    {
        try {
            Artisan::call($command, $parameters);

            return [
                'command' => $command,
                'success' => true,
                'skipped' => false,
                'output' => trim(Artisan::output()),
                'error' => null,
            ];
        } catch (Throwable $exception) {
            report($exception);

            return [
                'command' => $command,
                'success' => false,
                'skipped' => false,
                'output' => trim(Artisan::output()),
                'error' => $exception->getMessage(),
            ];
        }
    }

    private function skippedCommand(string $command, string $reason): array
    {
        return [
            'command' => $command,
            'success' => false,
            'skipped' => true,
            'output' => '',
            'error' => $reason,
        ];
    }
}
