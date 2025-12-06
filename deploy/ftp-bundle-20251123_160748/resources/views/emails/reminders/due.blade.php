@component('mail::message')
# {{ $reminder->title }}

{{ $reminder->notes ?? 'This is your scheduled reminder.' }}

@isset($reminder->next_run_at)
**Scheduled send:** {{ optional($reminder->next_run_at)->setTimezone($reminder->timezone ?? config('app.timezone'))->toDayDateTimeString() }}
@endisset

@component('mail::panel')
Type: {{ ucfirst($reminder->type ?? 'reminder') }}  
Timezone: {{ $reminder->timezone ?? config('app.timezone') }}  
Schedule: {{ $reminder->schedule_cron ?? 'n/a' }}
@endcomponent

Thanks,<br>
{{ config('app.name') }}
@endcomponent
