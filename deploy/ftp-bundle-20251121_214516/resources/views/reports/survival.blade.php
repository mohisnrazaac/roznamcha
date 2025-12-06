<!DOCTYPE html>
<html lang="{{ app()->getLocale() }}">
<head>
    <meta charset="utf-8">
    <title>{{ __('roznamcha.app.brand') }} — {{ $monthLabel }}</title>
    <style>
        body { font-family: 'DejaVu Sans', sans-serif; color: #0f172a; padding: 24px; }
        h1, h2 { color: #0f172a; margin-bottom: 8px; }
        table { width: 100%; border-collapse: collapse; margin-top: 16px; }
        th, td { border: 1px solid #cbd5f5; padding: 8px; text-align: left; font-size: 12px; }
        th { background: #e0e7ff; }
        .summary { display: flex; gap: 16px; margin-top: 16px; }
        .card { flex: 1; border: 1px solid #cbd5f5; border-radius: 8px; padding: 12px; }
    </style>
</head>
<body>
    <h1>{{ __('roznamcha.app.brand') }} — {{ $monthLabel }}</h1>
    <p>{{ $household?->name ?? 'Personal budget' }} • {{ $user->name }}</p>

    <div class="summary">
        <div class="card">
            <h2>{{ __('roznamcha.kharcha.totals_month') }}</h2>
            <p>{{ __('roznamcha.commons.currency') }} {{ number_format($data['total'], 2) }}</p>
        </div>
        <div class="card">
            <h2>{{ __('roznamcha.kharcha.average_daily') }}</h2>
            <p>{{ __('roznamcha.commons.currency') }} {{ number_format($data['average_daily'], 2) }}</p>
        </div>
        <div class="card">
            <h2>{{ __('roznamcha.reports.title') }}</h2>
            <p>
                @if(!is_null($data['trend_percent']))
                    {{ $data['trend_percent'] >= 0 ? '+' : '' }}{{ $data['trend_percent'] }}%
                    vs previous month
                @else
                    —
                @endif
            </p>
        </div>
        <div class="card">
            <h2>Projection</h2>
            <p>{{ __('roznamcha.commons.currency') }} {{ number_format($data['projection'], 2) }}</p>
        </div>
    </div>

    <h2 style="margin-top:24px;">Category Breakdown</h2>
    <table>
        <thead>
            <tr>
                <th>{{ __('roznamcha.commons.category') }}</th>
                <th>{{ __('roznamcha.commons.amount') }}</th>
            </tr>
        </thead>
        <tbody>
            @foreach($data['breakdown'] as $row)
                <tr>
                    <td>{{ $row['category'] }}</td>
                    <td>{{ __('roznamcha.commons.currency') }} {{ number_format($row['amount'], 2) }}</td>
                </tr>
            @endforeach
        </tbody>
    </table>
</body>
</html>
