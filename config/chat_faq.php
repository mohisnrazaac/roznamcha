<?php

/*
|--------------------------------------------------------------------------
| Chat Assistant FAQ & Safety Config
|--------------------------------------------------------------------------
| Centralizes guided prompt/response content, safety keywords, and optional
| Bytez AI settings for the Roznamcha activation chat widget. Extend this
| file by adding new FAQ keyword groups or adjusting fallbacks without
| touching controllers or UI components.
*/

return [
    'fallback_message' => 'I can help you understand Roznamcha features or guide you to the right tool.',
    'refusal_message' => 'I cannot help with that, but I can walk you through Roznamcha features such as Kharcha, Ration, Reminders, or Reports.',
    'disallowed_keywords' => [
        'cnic',
        'bank account',
        'account number',
        'iban',
        'credit card',
        'loan advice',
        'investment advice',
    ],
    'max_context_messages' => 6,
    'faq' => [
        [
            'keywords' => ['expense', 'kharcha', 'spend', 'budget'],
            'response' => 'Open Kharcha Map from the sidebar to review spending, filter by category/date, and add expenses via the Add Expense form.',
        ],
        [
            'keywords' => ['sign up', 'signup', 'register', 'create account'],
            'response' => 'Use the Sign up (Free) button on the top-right of any public page or visit /register to create a Roznamcha account, then follow the onboarding steps to set up your household.',
        ],
        [
            'keywords' => ['setup', 'install', 'bootstrap'],
            'response' => 'From the project root run `composer run setup` to install dependencies, copy `.env`, and seed demo households.',
        ],
        [
            'keywords' => ['ration', 'inventory', 'pantry'],
            'response' => 'Use Ration Brain to track pantry items. It shows latest price, month-over-month change, and inflation deltas for each item.',
        ],
        [
            'keywords' => ['report', 'pdf', 'survival'],
            'response' => 'Visit Reports → Survival PDF to generate the household survival snapshot. The backend stores the DomPDF on the public disk.',
        ],
        [
            'keywords' => ['reminder', 'scheduler', 'cron'],
            'response' => 'Reminder Scheduler lets you create finance, health, or faith reminders with timezone aware `next_run_at` and cron validation.',
        ],
    ],
    'bytez' => [
        'enabled' => env('BYTEZ_AI_ENABLED', false),
        'api_url' => env('BYTEZ_API_URL'),
        'api_key' => env('BYTEZ_API_KEY'),
        'timeout' => (int) env('BYTEZ_AI_TIMEOUT', 6),
    ],
];
