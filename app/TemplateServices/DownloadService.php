<?php

// Purpose: Build free and pro PDF exports for smart budget templates. Date: 2026-03-27. Author: Codex.

namespace App\TemplateServices;

use App\Models\BudgetTemplate;
use App\Models\User;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Response;
use Symfony\Component\HttpFoundation\Response as SymfonyResponse;

class DownloadService
{
    public function download(BudgetTemplate $template, array $payload, User $user, string $mode = 'free'): Response
    {
        $document = $this->buildDocumentData($template, $payload, $mode);

        return Pdf::loadView('pdf.template', [
            'document' => $document,
            'template' => $template,
            'user' => $user,
        ])
            ->setPaper('a4')
            ->download(sprintf('%s-%s.pdf', $template->slug, $document['mode']));
    }

    public function exportExcel(BudgetTemplate $template, array $payload, User $user, string $mode = 'free'): SymfonyResponse
    {
        $document = $this->buildDocumentData($template, $payload, $mode);
        $filename = sprintf('%s-budget-%s.csv', $template->slug, $document['mode']);

        $headers = [
            'Content-Type' => 'text/csv; charset=UTF-8',
            'Content-Disposition' => sprintf('attachment; filename="%s"', $filename),
            'Pragma' => 'no-cache',
            'Cache-Control' => 'must-revalidate, post-check=0, pre-check=0',
            'Expires' => '0',
        ];

        return response()->stream(function () use ($document, $template, $user) {
            $handle = fopen('php://output', 'w');
            fprintf($handle, chr(0xEF).chr(0xBB).chr(0xBF));

            fputcsv($handle, ['Roznamcha.pk - Smart Budget Template']);
            fputcsv($handle, ['Title', $template->title]);
            fputcsv($handle, ['Category', $template->category]);
            fputcsv($handle, ['Target Monthly Salary (PKR)', $document['salary']]);
            fputcsv($handle, ['Family Size', $document['family_size']]);
            fputcsv($handle, ['Export Mode', strtoupper($document['mode'])]);
            fputcsv($handle, ['Exported For', $user->name]);
            fputcsv($handle, ['Generated Date', $document['generated_at']]);
            fputcsv($handle, []);

            fputcsv($handle, ['Category', 'Monthly Allocation (PKR)', 'Share of Budget (%)']);
            foreach ($document['categories'] as $category) {
                fputcsv($handle, [
                    $category['category'] ?? '',
                    $category['amount'] ?? 0,
                    $category['percentage'] ?? '',
                ]);
            }

            fputcsv($handle, []);
            fputcsv($handle, ['Total Allocated (PKR)', collect($document['categories'])->sum('amount'), '100%']);

            if (! empty($document['saving_tips'])) {
                fputcsv($handle, []);
                fputcsv($handle, ['Saving Tips & Household Recommendations']);
                foreach ($document['saving_tips'] as $i => $tip) {
                    fputcsv($handle, [$i + 1, $tip]);
                }
            }

            if ($document['mode'] === 'pro') {
                fputcsv($handle, []);
                fputcsv($handle, ['PRO Inflation Projection (12% Buffer)']);
                fputcsv($handle, ['Projected Next Month (PKR)', $document['next_month_projection']]);
                fputcsv($handle, ['Category', 'Current Amount (PKR)', 'Inflated Next Month (PKR)']);
                foreach ($document['inflation_categories'] as $inf) {
                    fputcsv($handle, [
                        $inf['category'] ?? '',
                        $inf['current_amount'] ?? 0,
                        $inf['inflated_amount'] ?? 0,
                    ]);
                }
            }

            fclose($handle);
        }, 200, $headers);
    }

    public function buildDocumentData(BudgetTemplate $template, array $payload, string $mode = 'free'): array
    {
        $resolvedMode = $mode === 'pro' ? 'pro' : 'free';
        $salary = (int) ($payload['salary'] ?? $template->base_salary_target);
        $categories = collect($payload['categories'] ?? [])->values();
        $savingTips = collect($payload['saving_tips'] ?? [])->filter()->values();
        $inflationRatePercent = 12;
        $inflationMultiplier = 1 + ($inflationRatePercent / 100);

        $inflationCategories = $categories
            ->map(fn (array $row) => [
                'category' => $row['category'],
                'current_amount' => (int) ($row['amount'] ?? 0),
                'inflated_amount' => (int) round(((int) ($row['amount'] ?? 0)) * $inflationMultiplier),
            ])
            ->values()
            ->all();

        $nextMonthProjection = collect($inflationCategories)->sum('inflated_amount');

        return [
            'mode' => $resolvedMode,
            'title' => $template->title,
            'category' => $template->category,
            'salary' => $salary,
            'family_size' => (int) ($payload['family_size'] ?? 0),
            'source' => (string) ($payload['source'] ?? 'fallback'),
            'generated_at' => (string) ($payload['generated_at'] ?? now()->toIso8601String()),
            'categories' => $categories->all(),
            'saving_tips' => $savingTips->all(),
            'inflation_rate_percent' => $inflationRatePercent,
            'inflation_categories' => $inflationCategories,
            'next_month_projection' => $nextMonthProjection,
            'ask_roza_tips' => $this->askRozaTips($payload, $savingTips->all()),
        ];
    }

    protected function askRozaTips(array $payload, array $savingTips): array
    {
        $familySize = (int) ($payload['family_size'] ?? 0);

        $tips = [
            'Freeze the first grocery list before month-start and do not let mid-week top-up trips become a habit.',
            'Keep one utility checkpoint on the 10th and 20th so the protected slab does not break silently.',
            $familySize > 2
                ? 'School fee cash should be separated the same day salary lands, not after other bills are paid.'
                : 'Use one fixed weekly cash envelope for transport and snacks so daily leakage becomes visible.',
        ];

        return array_values(array_slice(array_unique(array_merge($savingTips, $tips)), 0, 3));
    }
}
