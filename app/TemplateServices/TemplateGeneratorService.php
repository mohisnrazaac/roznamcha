<?php
// Purpose: Generate and cache smart budget template JSON with strict cost control. Date: 2026-03-27. Author: Codex.

namespace App\TemplateServices;

use App\Models\BudgetTemplate;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Str;
use Throwable;

class TemplateGeneratorService
{
    public function getOrGenerate(BudgetTemplate $template): array
    {
        $freshTemplate = BudgetTemplate::query()->findOrFail($template->id);

        return Cache::rememberForever($this->cacheKey($freshTemplate), function () use ($freshTemplate) {
            $stored = $this->decodeStoredTemplate($freshTemplate);
            $repairedStored = $stored ? $this->repairTemplatePayload($freshTemplate, $stored) : null;

            if ($stored !== null && $repairedStored !== null && $stored === $repairedStored) {
                return $stored;
            }

            return DB::transaction(function () use ($freshTemplate) {
                $lockedTemplate = BudgetTemplate::query()
                    ->whereKey($freshTemplate->id)
                    ->lockForUpdate()
                    ->firstOrFail();

                $stored = $this->decodeStoredTemplate($lockedTemplate);

                if ($stored !== null) {
                    $repaired = $this->repairTemplatePayload($lockedTemplate, $stored);

                    if ($stored !== $repaired) {
                        $lockedTemplate->forceFill([
                            'template_json' => $repaired,
                        ])->save();
                    }

                    return $repaired;
                }

                $familySize = $this->familySizeFor($lockedTemplate);
                $generated = $this->repairTemplatePayload(
                    $lockedTemplate,
                    $this->generateTemplate($lockedTemplate->base_salary_target, $familySize)
                );

                $lockedTemplate->forceFill([
                    'template_json' => $generated,
                ])->save();

                return $generated;
            }, 3);
        });
    }

    public function generateTemplate(int $salary, int $familySize): array
    {
        $fallback = $this->fallbackTemplate($salary, $familySize);
        $response = $this->requestAiTemplate($salary, $familySize);

        if (! is_array($response)) {
            return $fallback;
        }

        $normalized = $this->normalizeAiResponse($response, $salary, $familySize);

        return $normalized ?? $fallback;
    }

    public function familySizeFor(BudgetTemplate $template): int
    {
        return match ($template->slug) {
            'student-budget' => 1,
            '50k-salary-survival-guide' => 3,
            '100k-family-budget' => 5,
            'joint-family-budget' => 8,
            default => match ($template->category) {
                'student' => 1,
                'joint_family' => 7,
                'family' => 5,
                default => 4,
            },
        };
    }

    protected function cacheKey(BudgetTemplate $template): string
    {
        return sprintf(
            'budget-template:%s:%s',
            $template->id,
            optional($template->updated_at)->timestamp ?? 'na'
        );
    }

    protected function decodeStoredTemplate(BudgetTemplate $template): ?array
    {
        $payload = $template->template_json;

        if (is_array($payload) && isset($payload['categories'])) {
            return $payload;
        }

        if (! is_string($payload) || trim($payload) === '') {
            return null;
        }

        $decoded = json_decode($payload, true);

        return is_array($decoded) && isset($decoded['categories'])
            ? $decoded
            : null;
    }

    protected function requestAiTemplate(int $salary, int $familySize): ?array
    {
        $apiKey = (string) config('services.ai.api_key', '');

        if ($apiKey === '') {
            return null;
        }

        $baseUrl = rtrim((string) config('ai.base_url'), '/');

        if ($baseUrl === '') {
            return null;
        }

        $payload = [
            'model' => config('ai.model'),
            'messages' => [
                [
                    'role' => 'system',
                    'content' => 'You are Roznamcha, a Pakistani household finance copilot. Always respond with compliant JSON output.',
                ],
                [
                    'role' => 'user',
                    'content' => $this->promptFor($salary, $familySize),
                ],
            ],
            'response_format' => ['type' => 'json_object'],
        ];

        $headers = [
            'X-Title' => config('app.name', 'Roznamcha'),
        ];

        if ($referer = config('app.url')) {
            $headers['HTTP-Referer'] = $referer;
        }

        try {
            $response = Http::withToken($apiKey)
                ->withHeaders($headers)
                ->acceptJson()
                ->post($baseUrl, $payload);

            $response->throw();

            $raw = $response->json('choices.0.message.content');

            if (! is_string($raw) || trim($raw) === '') {
                return null;
            }

            $decoded = json_decode($raw, true);

            return is_array($decoded) ? $decoded : null;
        } catch (Throwable $throwable) {
            report($throwable);

            return null;
        }
    }

    protected function promptFor(int $salary, int $familySize): string
    {
        return <<<PROMPT
Generate a realistic monthly survival budget for a Pakistani household.

Inputs:
Salary: {$salary} PKR
Family Size: {$familySize}

Rules:

* Prioritize survival, not ideal saving
* Use 8 to 11 categories so the budget looks like a real household plan
* Never output negative amounts or negative percentages
* Include:

  * Atta
  * Ghee
  * Sugar
  * Electricity (protected slab estimate)
  * Gas
* School fees (only if family size > 2, and keep them below 25% of the total budget)
* Transport
* A rent or household buffer line
* Output JSON with:

  * categories
  * amount
  * percentage

Also include:

* 3 practical saving tips to save at least 5,000 PKR

Return strict JSON only in this exact shape:
{
  "categories": [
    {"category": "Atta", "amount": 0, "percentage": 0}
  ],
  "saving_tips": ["", "", ""]
}
PROMPT;
    }

    protected function normalizeAiResponse(array $payload, int $salary, int $familySize): ?array
    {
        $rawCategories = $payload['categories'] ?? null;
        $rawTips = $payload['saving_tips'] ?? $payload['tips'] ?? null;

        if (! is_array($rawCategories) || ! is_array($rawTips)) {
            return null;
        }

        $normalizedCategories = collect($rawCategories)
            ->map(function ($row) {
                if (! is_array($row)) {
                    return null;
                }

                $category = trim((string) ($row['category'] ?? $row['name'] ?? ''));
                $amount = (float) ($row['amount'] ?? 0);
                $percentage = (float) ($row['percentage'] ?? 0);

                if ($category === '') {
                    return null;
                }

                return [
                    'category' => $this->normalizeCategoryName($category),
                    'amount' => $amount,
                    'percentage' => $percentage,
                ];
            })
            ->filter()
            ->values();

        if ($normalizedCategories->count() < 8) {
            return null;
        }

        $categoryNames = $normalizedCategories
            ->pluck('category')
            ->map(fn (string $name) => Str::lower($name))
            ->implode(' | ');

        foreach (['atta', 'ghee', 'sugar', 'electricity', 'gas'] as $requiredNeedle) {
            if (! str_contains($categoryNames, $requiredNeedle)) {
                return null;
            }
        }

        if ($familySize > 2 && ! str_contains($categoryNames, 'school')) {
            return null;
        }

        $tipList = collect($rawTips)
            ->map(fn ($tip) => trim((string) $tip))
            ->filter()
            ->take(3)
            ->values();

        if ($tipList->count() < 3) {
            return null;
        }

        $sumFromPercentages = $normalizedCategories->sum(fn (array $row) => max(0, (float) $row['percentage']));
        $sumFromAmounts = $normalizedCategories->sum(fn (array $row) => max(0, (float) $row['amount']));

        $scaled = $normalizedCategories
            ->map(function (array $row) use ($sumFromPercentages, $sumFromAmounts) {
                $percentage = max(0, (float) $row['percentage']);

                if ($sumFromPercentages > 0) {
                    $percentage = ($percentage / $sumFromPercentages) * 100;
                } elseif ($sumFromAmounts > 0) {
                    $percentage = (($row['amount'] ?? 0) / $sumFromAmounts) * 100;
                }

                return [
                    'category' => $row['category'],
                    'percentage' => round($percentage, 2),
                ];
            })
            ->values();

        $categories = $this->allocateAmounts($scaled->all(), $salary);

        return $this->buildPayload([
            'salary' => $salary,
            'family_size' => $familySize,
            'source' => 'ai',
            'generated_at' => now()->toIso8601String(),
            'categories' => $categories,
            'saving_tips' => $tipList->all(),
        ], $salary, $familySize);
    }

    protected function fallbackTemplate(int $salary, int $familySize): array
    {
        $weightedCategories = [
            ['category' => 'Atta', 'weight' => 13 + min($familySize, 4)],
            ['category' => 'Ghee', 'weight' => 8],
            ['category' => 'Sugar', 'weight' => 4],
            ['category' => 'Electricity (Protected Slab Estimate)', 'weight' => 11],
            ['category' => 'Gas', 'weight' => 5],
            ['category' => 'Daal, Sabzi, and Kitchen Basics', 'weight' => 18 + min($familySize, 5)],
            ['category' => 'Transport', 'weight' => 9],
            ['category' => 'Medicine and Emergencies', 'weight' => 7],
            ['category' => 'Mobile and Internet', 'weight' => 4],
        ];

        if ($familySize > 2) {
            $weightedCategories[] = ['category' => 'School Fees', 'weight' => 12];
        }

        $weightedCategories[] = [
            'category' => $familySize >= 6 ? 'Shared Household Buffer' : 'Rent and Household Buffer',
            'weight' => $familySize >= 6 ? 14 : 11,
        ];

        $weightTotal = collect($weightedCategories)->sum('weight');

        $percentages = collect($weightedCategories)
            ->map(fn (array $row) => [
                'category' => $row['category'],
                'percentage' => round(($row['weight'] / max(1, $weightTotal)) * 100, 2),
            ])
            ->all();

        return $this->buildPayload([
            'salary' => $salary,
            'family_size' => $familySize,
            'source' => 'fallback',
            'generated_at' => now()->toIso8601String(),
            'categories' => $this->allocateAmounts($percentages, $salary),
            'saving_tips' => [
                'Pull one weekly bazaar trip out of the month and buy only essentials with a written list.',
                'Keep electricity units inside the protected slab by batching ironing and water-motor use on fixed days.',
                'Reserve 5,000 PKR on payday before fuel top-ups and chai cash start leaking through the month.',
            ],
        ], $salary, $familySize);
    }

    protected function allocateAmounts(array $categories, int $salary): array
    {
        $allocated = collect($categories)
            ->values()
            ->map(function (array $row, int $index) use ($salary, $categories) {
                $percentage = round((float) ($row['percentage'] ?? 0), 2);
                $amount = (int) round(($salary * $percentage) / 100 / 100) * 100;

                if ($index === array_key_last($categories)) {
                    $used = collect($categories)
                        ->take($index)
                        ->sum(fn (array $entry) => (int) round(($salary * ((float) ($entry['percentage'] ?? 0))) / 100 / 100) * 100);

                    $amount = max(0, $salary - $used);
                }

                return [
                    'category' => $row['category'],
                    'amount' => $amount,
                    'percentage' => $percentage,
                ];
            })
            ->all();

        $difference = $salary - collect($allocated)->sum('amount');

        if ($difference !== 0 && isset($allocated[array_key_last($allocated)])) {
            $allocated[array_key_last($allocated)]['amount'] += $difference;
        }

        return $allocated;
    }

    protected function repairTemplatePayload(BudgetTemplate $template, array $payload): array
    {
        return $this->buildPayload(
            $payload,
            (int) ($payload['salary'] ?? $template->base_salary_target),
            $this->familySizeFor($template)
        );
    }

    protected function buildPayload(array $payload, int $salary, int $familySize): array
    {
        $tips = collect($payload['saving_tips'] ?? [])
            ->map(fn ($tip) => trim((string) $tip))
            ->filter()
            ->take(3)
            ->values();

        $categories = collect($payload['categories'] ?? [])
            ->map(fn ($row) => $this->sanitizeCategoryRow($row))
            ->filter()
            ->values();

        if ($this->failsPublicTrustChecks($categories, $tips, $salary, $familySize)) {
            return $this->fallbackTemplate($salary, $familySize);
        }

        return [
            'salary' => $salary,
            'family_size' => $familySize,
            'source' => (string) ($payload['source'] ?? 'ai'),
            'generated_at' => is_string($payload['generated_at'] ?? null) ? $payload['generated_at'] : now()->toIso8601String(),
            'categories' => $this->rebalanceCategories($categories->all(), $salary),
            'saving_tips' => $tips->all(),
        ];
    }

    protected function sanitizeCategoryRow($row): ?array
    {
        if (! is_array($row)) {
            return null;
        }

        $category = $this->normalizeCategoryName((string) ($row['category'] ?? $row['name'] ?? ''));

        if ($category === '') {
            return null;
        }

        return [
            'category' => $category,
            'amount' => (float) ($row['amount'] ?? 0),
            'percentage' => (float) ($row['percentage'] ?? 0),
        ];
    }

    protected function normalizeCategoryName(string $category): string
    {
        $normalized = Str::of($category)
            ->replace(['_', '-'], ' ')
            ->squish()
            ->lower();

        return match (true) {
            $normalized->is('school fees*') => 'School Fees',
            $normalized->contains('electricity') => 'Electricity (Protected Slab Estimate)',
            default => Str::title((string) $normalized),
        };
    }

    protected function failsPublicTrustChecks($categories, $tips, int $salary, int $familySize): bool
    {
        if ($salary <= 0 || $categories->count() < 8 || $tips->count() < 3) {
            return true;
        }

        if ($categories->contains(fn (array $row) => ($row['amount'] ?? 0) < 0 || ($row['percentage'] ?? 0) < 0)) {
            return true;
        }

        $categoryNames = $categories
            ->pluck('category')
            ->map(fn (string $name) => Str::lower($name))
            ->values();

        foreach (['atta', 'ghee', 'sugar', 'electricity', 'gas', 'transport'] as $requiredNeedle) {
            if (! $categoryNames->contains(fn (string $name) => str_contains($name, $requiredNeedle))) {
                return true;
            }
        }

        if (! $categoryNames->contains(fn (string $name) => str_contains($name, 'buffer') || str_contains($name, 'rent'))) {
            return true;
        }

        $schoolFeeRow = $categories->first(fn (array $row) => str_contains(Str::lower($row['category']), 'school'));

        if ($familySize <= 2 && $schoolFeeRow) {
            return true;
        }

        if ($familySize > 2 && ! $schoolFeeRow) {
            return true;
        }

        if ($schoolFeeRow) {
            $schoolShare = ($schoolFeeRow['amount'] ?? 0) / max(1, $salary);

            if ($schoolShare > 0.25) {
                return true;
            }
        }

        return false;
    }

    protected function rebalanceCategories(array $categories, int $salary): array
    {
        $sumFromAmounts = collect($categories)->sum(fn (array $row) => max(0, (float) ($row['amount'] ?? 0)));
        $sumFromPercentages = collect($categories)->sum(fn (array $row) => max(0, (float) ($row['percentage'] ?? 0)));

        $weights = collect($categories)
            ->map(function (array $row) use ($sumFromAmounts, $sumFromPercentages) {
                $percentage = 0.0;

                if ($sumFromAmounts > 0) {
                    $percentage = (max(0, (float) ($row['amount'] ?? 0)) / $sumFromAmounts) * 100;
                } elseif ($sumFromPercentages > 0) {
                    $percentage = (max(0, (float) ($row['percentage'] ?? 0)) / $sumFromPercentages) * 100;
                }

                return [
                    'category' => $row['category'],
                    'percentage' => round($percentage, 2),
                ];
            })
            ->all();

        return $this->allocateAmounts($weights, $salary);
    }
}
