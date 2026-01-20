<?php

namespace App\Services;

use App\AI\PromptLibrary;
use App\Models\Category;
use App\Models\DailyAiInsight;
use App\Models\DailyMoneySnapshot;
use App\Models\DailyVisitStreak;
use App\Models\Expense;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Str;

/**
 * Coordinates the CMS snapshot, AI line, and silent streak logic that power the daily return hooks.
 */
class DailyReturnHookService
{
    public function __construct(private readonly AiService $aiService)
    {
    }

    /**
     * Build the payload consumed by the frontend widgets.
     */
    public function buildPayload(?User $user = null): array
    {
        $snapshot = $this->resolveSnapshot();

        return [
            'snapshot' => $snapshot ? [
                'date' => optional($snapshot->snapshot_date)->toDateString(),
                'expense_summary_text' => $snapshot->expense_summary_text,
                'inflation_status_text' => $snapshot->inflation_status_text,
                'saving_tip_text' => $snapshot->saving_tip_text,
                'today_update_line' => $snapshot->today_update_line,
                'yesterday_change_line' => $snapshot->yesterday_change_line,
                'last_updated_label' => $this->lastUpdatedLabel($snapshot),
            ] : null,
            'blog_updates' => $snapshot ? [
                'today' => $snapshot->today_update_line,
                'yesterday' => $snapshot->yesterday_change_line,
            ] : null,
            'ai_insight' => $user ? $this->resolveAiInsight($user) : null,
            'streak' => $user ? $this->resolveStreak($user) : null,
            'cta_links' => $this->ctaLinks($snapshot),
        ];
    }

    /**
     * Snapshot fallback ensures the hooks never render empty even if today's entry is missing.
     */
    private function resolveSnapshot(): ?DailyMoneySnapshot
    {
        $today = now()->toDateString();

        return DailyMoneySnapshot::query()
            ->whereDate('snapshot_date', $today)
            ->orderByDesc('snapshot_date')
            ->first() ?? DailyMoneySnapshot::query()
            ->orderByDesc('snapshot_date')
            ->first();
    }

    /**
     * Returns cached AI line or generates a new one when the day starts.
     */
    private function resolveAiInsight(User $user): ?array
    {
        $today = now()->toDateString();

        $record = DailyAiInsight::query()
            ->where('user_id', $user->id)
            ->where('insight_date', $today)
            ->first();

        if (! $record) {
            $record = $this->generateAiInsight($user, $today);
        }

        if (! $record) {
            return null;
        }

        return [
            'label' => 'AI کی آج کی رائے',
            'text' => $record->ai_text,
        ];
    }

    /**
     * Keeps streak logic invisible unless a user visits two days in a row.
     */
    private function resolveStreak(User $user): ?array
    {
        $today = now()->toDateString();
        $yesterday = now()->subDay()->toDateString();

        $streak = DailyVisitStreak::firstOrNew(['user_id' => $user->id]);
        $dirty = false;

        if ($streak->last_visited_on === $today) {
            // Nothing to update because we already counted today's visit.
            $dirty = false;
        } elseif ($streak->last_visited_on === $yesterday) {
            $streak->streak_count = ($streak->streak_count ?? 1) + 1;
            $streak->last_visited_on = $today;
            $dirty = true;
        } else {
            $streak->streak_count = 1;
            $streak->last_visited_on = $today;
            $dirty = true;
        }

        if ($dirty) {
            $streak->save();
        }

        if (($streak->streak_count ?? 0) < 2) {
            return null;
        }

        return [
            'days' => $streak->streak_count,
            'text' => "آپ مسلسل {$streak->streak_count} دن سے Roznamcha دیکھ رہے ہیں",
        ];
    }

    private function generateAiInsight(User $user, string $date): ?DailyAiInsight
    {
        $dataset = $this->buildAiDataset($user);

        $prompt = PromptLibrary::getDailyReturnLinePrompt($dataset);
        $response = $this->aiService->sendPrompt($prompt, $user->id, 'daily_return');

        $text = data_get($response, 'decoded.sentence') ?: data_get($response, 'raw');
        $text = is_string($text) ? trim(preg_replace('/\s+/', ' ', $text)) : null;

        if (! $text) {
            return null;
        }

        return DailyAiInsight::create([
            'user_id' => $user->id,
            'insight_date' => $date,
            'ai_text' => Str::limit($text, 200, ''),
        ]);
    }

    /**
     * Feeds the AI context about spending patterns so the line feels grounded.
     */
    private function buildAiDataset(User $user): array
    {
        $dateColumn = $this->expenseDateColumn();
        $today = now();
        $weekStart = $today->copy()->subDays(7)->toDateString();
        $previousWeekStart = $today->copy()->subDays(14)->toDateString();
        $previousWeekEnd = $today->copy()->subDays(8)->toDateString();
        $monthStart = $today->copy()->subDays(30)->toDateString();
        $todayString = $today->toDateString();

        $recentTotal = $this->sumExpenses($user, $monthStart, $todayString, $dateColumn);
        $weekTotal = $this->sumExpenses($user, $weekStart, $todayString, $dateColumn);
        $previousWeekTotal = $this->sumExpenses($user, $previousWeekStart, $previousWeekEnd, $dateColumn);

        $topCategory = Expense::query()
            ->selectRaw('category_id, SUM(amount) as total_spent')
            ->where('user_id', $user->id)
            ->whereBetween($dateColumn, [$monthStart, $todayString])
            ->groupBy('category_id')
            ->orderByDesc('total_spent')
            ->first();

        $categoryName = null;
        $categorySpend = null;

        if ($topCategory) {
            $category = Category::query()->find($topCategory->category_id);
            $categoryName = $category?->name;
            $categorySpend = (float) ($topCategory->total_spent ?? 0);
        }

        return [
            'user_id' => $user->id,
            'today' => $todayString,
            'month_window_total' => $recentTotal,
            'week_total' => $weekTotal,
            'previous_week_total' => $previousWeekTotal,
            'top_category' => [
                'name' => $categoryName,
                'total' => $categorySpend,
            ],
            'expense_count_last_7_days' => Expense::query()
                ->where('user_id', $user->id)
                ->whereBetween($dateColumn, [$weekStart, $todayString])
                ->count(),
        ];
    }

    private function sumExpenses(User $user, string $start, string $end, string $dateColumn): float
    {
        return (float) Expense::query()
            ->where('user_id', $user->id)
            ->whereBetween($dateColumn, [$start, $end])
            ->sum('amount');
    }

    private function expenseDateColumn(): string
    {
        $table = (new Expense())->getTable();

        return Schema::hasColumn($table, 'tx_date')
            ? 'tx_date'
            : (Schema::hasColumn($table, 'date') ? 'date' : 'tx_date');
    }

    private function lastUpdatedLabel(?DailyMoneySnapshot $snapshot): ?string
    {
        if (! $snapshot) {
            return null;
        }

        $timestamp = $snapshot->last_updated_at ?? $snapshot->updated_at;
        if (! $timestamp instanceof Carbon) {
            return null;
        }

        if ($timestamp->isToday()) {
            return 'Today';
        }

        if ($timestamp->isYesterday()) {
            return 'Yesterday';
        }

        return $timestamp->diffForHumans();
    }

    /**
     * CTA defaults keep internal linking alive even if CMS values are blank.
     */
    private function ctaLinks(?DailyMoneySnapshot $snapshot): array
    {
        $defaults = [
            [
                'label' => 'اپنا خرچ یہاں دیکھیں',
                'href' => route('public.kharcha-map'),
            ],
            [
                'label' => 'اپنا ماہانہ بجٹ بنائیں',
                'href' => route('public.ration-brain'),
            ],
        ];

        if (! $snapshot) {
            return $defaults;
        }

        $links = [];

        if ($snapshot->kharcha_cta_label && $snapshot->kharcha_cta_url) {
            $links[] = [
                'label' => $snapshot->kharcha_cta_label,
                'href' => $snapshot->kharcha_cta_url,
            ];
        }

        if ($snapshot->ration_cta_label && $snapshot->ration_cta_url) {
            $links[] = [
                'label' => $snapshot->ration_cta_label,
                'href' => $snapshot->ration_cta_url,
            ];
        }

        return count($links) ? $links : $defaults;
    }
}
