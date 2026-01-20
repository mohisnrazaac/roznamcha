<?php

namespace App\AI;

// Roznamcha AI Prompt Library – Created 2026-01-11 16:10 PKT
class PromptLibrary
{
    public static function getKharchaSummaryPrompt(array $data): string
    {
        $json = json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);

        return <<<PROMPT
You are a Pakistani household finance assistant. Analyze the monthly expense list below, highlight any spending spikes or wasteful categories, and produce 3 actionable savings tips written bilingually (Urdu + English in each sentence). Convert insights into valid JSON with keys: status, module, summary, top_risks (array of strings), suggestions (array of bilingual tips). The JSON must match {"status":"ok","module":"kharcha","summary":"","top_risks":[],"suggestions":[]}. Use the user's numbers without creating fake values.

Expense data (PKR):
{$json}
PROMPT;
    }

    public static function getRationShockPrompt(array $data): string
    {
        $json = json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);

        return <<<PROMPT
Detect grocery items with price increases in the last 30 days using the ration history below. Predict the risk of the next price jump and keep the tone simple for Pakistani households. Respond with JSON exactly like {"status":"ok","module":"ration","alerts":[{"item":"","trend":"","risk":""}]}.

Ration price snapshots:
{$json}
PROMPT;
    }

    public static function getReminderSuggestionPrompt(array $data): string
    {
        $json = json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);

        return <<<PROMPT
Detect recurring expenses and suggest gentle reminder messages. Each reminder line must include Urdu + English phrasing. Respond strictly with {"status":"ok","module":"reminder","suggestions":[{"title":"","schedule":""}]}.

Existing reminders and recurring expenses:
{$json}
PROMPT;
    }

    public static function getSurvivalReportPrompt(array $data): string
    {
        $json = json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);

        return <<<PROMPT
Write a 5-line monthly survival summary for a Pakistani household using the totals provided. Mention overspend, upcoming risks, and next month advice. Output JSON shaped like {"status":"ok","module":"report","story":""}.

Monthly survival data:
{$json}
PROMPT;
    }

    public static function getDailyReturnLinePrompt(array $data): string
    {
        $json = json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);

        return <<<PROMPT
Create exactly one blunt Urdu sentence for a Pakistani household about their recent money trends. No motivational quotes. Keep it in aam ghar ki zuban, max 25 Urdu words, and focus on inflation, top spending category, or savings caution. Respond strictly with {"status":"ok","module":"daily_return","sentence":""}.

Household snapshot:
{$json}
PROMPT;
    }
}
