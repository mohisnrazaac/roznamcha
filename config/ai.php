<?php

return [
    'base_url' => env('AI_BASE_URL', 'https://openrouter.ai/api/v1/chat/completions'),
    'model' => env('AI_MODEL', 'mistralai/mixtral-8x7b-instruct'),
    'daily_limit' => (int) env('AI_DAILY_LIMIT', 20),
];
