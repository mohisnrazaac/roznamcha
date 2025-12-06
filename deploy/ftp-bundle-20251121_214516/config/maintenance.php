<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Maintenance Trigger Page
    |--------------------------------------------------------------------------
    |
    | The maintenance trigger page must be explicitly enabled and requires
    | a shared secret token before migrations and seeders can be executed.
    |
    */

    'enabled' => env('MAINTENANCE_PAGE_ENABLED', false),
    'secret' => env('MAINTENANCE_TRIGGER_SECRET', ''),
];
