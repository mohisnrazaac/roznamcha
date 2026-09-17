<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Process;
use Throwable;

class RunPublisherAgent extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'blog:run-publisher-agent
                            {--dry-run : Run generation and preview output without transmitting to the API}
                            {--mock : Use local pre-vetted template without calling external Gemini API}
                            {--topic= : Topic to research and generate; rotates automatically if omitted or duplicate}
                            {--model= : Gemini model identifier (default: gemini-2.5-flash)}
                            {--api-url= : Override target API endpoint}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Execute the Roznamcha publisher agent (publisher_agent.py) to ingest draft articles.';

    /**
     * Execute the console command.
     */
    public function handle(): int
    {
        $python = env('PUBLISHER_AGENT_PYTHON_PATH', 'python3');
        $script = base_path('publisher_agent.py');

        if (! File::exists($script)) {
            $this->error("Publisher agent script not found at: {$script}");
            Log::error("Publisher agent script not found at: {$script}");

            return self::FAILURE;
        }

        $command = [$python, $script];

        if ($this->option('dry-run')) {
            $command[] = '--dry-run';
        }

        if ($this->option('mock')) {
            $command[] = '--mock';
        }

        if ($topic = $this->option('topic')) {
            $command[] = '--topic';
            $command[] = (string) $topic;
        }

        if ($model = $this->option('model')) {
            $command[] = '--model';
            $command[] = (string) $model;
        }

        if ($apiUrl = $this->option('api-url')) {
            $command[] = '--api-url';
            $command[] = (string) $apiUrl;
        }

        $this->info('Executing Roznamcha Publisher Agent...');
        $this->line('Command: '.implode(' ', array_map('escapeshellarg', $command)));
        $this->newLine();

        $logPath = storage_path('logs/publisher_agent.log');
        $logDir = dirname($logPath);
        if (! File::isDirectory($logDir)) {
            File::makeDirectory($logDir, 0755, true, true);
        }

        $timestamp = now()->toDateTimeString();
        try {
            File::append($logPath, "\n[{$timestamp}] Executing: ".implode(' ', $command)."\n");
        } catch (Throwable) {
            // Non-blocking fallback if logging file fails
        }

        try {
            $result = Process::path(base_path())
                ->timeout(300)
                ->run($command, function (string $type, string $output) use ($logPath): void {
                    $this->output->write($output);
                    try {
                        File::append($logPath, $output);
                    } catch (Throwable) {
                        // Silent fallback
                    }
                });

            if ($result->successful()) {
                $this->newLine();
                $this->info('Publisher agent completed successfully.');
                Log::info('Publisher agent completed successfully.');

                return self::SUCCESS;
            }

            $exitCode = $result->exitCode() ?? self::FAILURE;
            $this->newLine();
            $this->error("Publisher agent exited with error code {$exitCode}.");
            Log::error("Publisher agent exited with error code {$exitCode}. Output: ".$result->errorOutput());

            return self::FAILURE;
        } catch (Throwable $e) {
            $this->newLine();
            $this->error('Failed to execute publisher agent: '.$e->getMessage());
            Log::error('Failed to execute publisher agent: '.$e->getMessage(), ['exception' => $e]);

            return self::FAILURE;
        }
    }
}
