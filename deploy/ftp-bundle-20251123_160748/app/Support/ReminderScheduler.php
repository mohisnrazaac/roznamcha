<?php

namespace App\Support;

use Carbon\CarbonImmutable;
use Carbon\CarbonInterface;
use Cron\CronExpression;
use InvalidArgumentException;

class ReminderScheduler
{
    /**
     * Calculate the next run time (stored in UTC) based on a cron expression and optional start/end dates.
     */
    public static function nextRun(string $expression, string $timezone, ?CarbonInterface $startsOn = null, ?CarbonInterface $endsOn = null): ?CarbonImmutable
    {
        if (! CronExpression::isValidExpression($expression)) {
            throw new InvalidArgumentException('Invalid cron expression supplied.');
        }

        $cron = CronExpression::factory($expression);

        $startBoundary = $startsOn
            ? CarbonImmutable::parse($startsOn->toDateString(), $timezone)->startOfDay()
            : null;

        $now = CarbonImmutable::now($timezone);
        $baseline = $startBoundary && $startBoundary->greaterThan($now) ? $startBoundary : $now;

        $next = CarbonImmutable::instance(
            $cron->getNextRunDate($baseline->toDateTimeImmutable())
        )->setTimezone($timezone);

        if ($endsOn) {
            $endBoundary = CarbonImmutable::parse($endsOn->toDateString(), $timezone)->endOfDay();
            if ($next->greaterThan($endBoundary)) {
                return null;
            }
        }

        return $next->setTimezone('UTC');
    }
}
