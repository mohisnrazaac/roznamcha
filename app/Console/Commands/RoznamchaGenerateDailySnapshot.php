<?php

namespace App\Console\Commands;

use App\Services\DailyMoneySnapshotService;
use Carbon\Carbon;
use Carbon\CarbonInterface;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Log;
use Throwable;

/**
 * Cron entry point that regenerates the Daily Money Snapshot at 12 AM PKT so morning visitors land on fresh context.
 * The admin panel reuses this command's service so manual overrides never fork from the automated logic.
 */
class RoznamchaGenerateDailySnapshot extends Command
{
    /**
     * @var string
     */
    protected $signature = 'roznamcha:generate-daily-snapshot {--date=}';

    /**
     * @var string
     */
    protected $description = 'Fetch market indicators, convert them to Urdu copy, and upsert the daily snapshot.';

    public function __construct(private readonly DailyMoneySnapshotService $service)
    {
        parent::__construct();
    }

    /**
     * Running at midnight is idempotent; reruns simply overwrite the same date so cron retries stay safe.
     */
    public function handle(): int
    {
        $dateOption = $this->option('date');
        $date = $dateOption ? Carbon::parse($dateOption) : null;

        try {
            $snapshot = $this->service->generate($date instanceof CarbonInterface ? $date : null);

            $this->info("Snapshot stored for {$snapshot->snapshot_date?->toDateString()}");

            return Command::SUCCESS;
        } catch (Throwable $exception) {
            Log::error('Failed to generate daily snapshot', ['error' => $exception->getMessage()]);
            $this->error('Failed to generate the daily snapshot: '.$exception->getMessage());

            return Command::FAILURE;
        }
    }
}
