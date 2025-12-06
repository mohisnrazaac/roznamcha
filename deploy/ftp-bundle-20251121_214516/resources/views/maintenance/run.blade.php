<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <title>Maintenance Runner</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <style>
        body { font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; background: #f4f4f5; margin: 0; padding: 2rem; }
        .card { max-width: 640px; margin: 0 auto; background: #fff; border-radius: 0.75rem; padding: 2rem; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, .1), 0 4px 6px -2px rgba(0, 0, 0, .05); }
        .status { padding: 0.75rem 1rem; background: #ecfccb; border: 1px solid #bef264; border-radius: 0.5rem; margin-bottom: 1.5rem; color: #365314; }
        .error { padding: 0.75rem 1rem; background: #fee2e2; border: 1px solid #fca5a5; border-radius: 0.5rem; margin-bottom: 1.5rem; color: #7f1d1d; }
        .error-inline { padding: 0.5rem 0.75rem; border-radius: 0.5rem; background: #fee2e2; border: 1px solid #fca5a5; color: #7f1d1d; margin-bottom: 1rem; }
        label { display: block; font-weight: 600; margin-bottom: 0.5rem; }
        input[type="password"] { width: 100%; padding: 0.75rem; border-radius: 0.5rem; border: 1px solid #d4d4d8; font-size: 1rem; }
        button { margin-top: 1rem; width: 100%; padding: 0.75rem; font-size: 1rem; border-radius: 0.5rem; border: none; color: #fff; background: #2563eb; cursor: pointer; }
        button:disabled { background: #94a3b8; cursor: not-allowed; }
        pre { background: #0f172a; color: #e2e8f0; padding: 1rem; border-radius: 0.5rem; overflow-x: auto; }
        h1 { margin-top: 0; }
        .result-block { margin-top: 1.5rem; }
        .result-header { display: flex; justify-content: space-between; align-items: center; gap: 1rem; }
        .badge { display: inline-block; padding: 0.2rem 0.65rem; border-radius: 999px; font-size: 0.85rem; font-weight: 600; }
        .badge-success { background: #dcfce7; color: #166534; }
        .badge-failed { background: #fee2e2; color: #991b1b; }
        .badge-skipped { background: #fef3c7; color: #92400e; }
    </style>
</head>
<body>
    <div class="card">
        <h1>Maintenance Runner</h1>
        <p>Use this page only when you need to run the Laravel migrations and database seeders on the live server. The secret token is required every time.</p>

        @if ($errors->any())
            <div class="error">
                <strong>Validation error:</strong> {{ $errors->first() }}
            </div>
        @endif

        @if (session('status'))
            <div class="status">{{ session('status') }}</div>
        @endif

        @if (session('runner_error'))
            <div class="error">{{ session('runner_error') }}</div>
        @endif

        <form method="POST" action="{{ route('maintenance.trigger.run') }}">
            @csrf
            <label for="token">Secret token</label>
            <input type="password" id="token" name="token" placeholder="Enter the secret token" required>
            <button type="submit">Run migrations &amp; seeders</button>
        </form>

        @if (session('results'))
            <div style="margin-top: 2rem;">
                @foreach (session('results') as $label => $result)
                    <div class="result-block">
                        <div class="result-header">
                            <h2>{{ ucfirst($label) }} command</h2>
                            @php
                                $badgeClass = $result['success'] ? 'badge-success' : ($result['skipped'] ? 'badge-skipped' : 'badge-failed');
                                $badgeText = $result['success'] ? 'Success' : ($result['skipped'] ? 'Skipped' : 'Failed');
                            @endphp
                            <span class="badge {{ $badgeClass }}">{{ $badgeText }}</span>
                        </div>

                        @if (! empty($result['error']))
                            <div class="error-inline">{{ $result['error'] }}</div>
                        @endif

                        @if (! empty($result['output']))
                            <pre>{{ $result['output'] }}</pre>
                        @endif
                    </div>
                @endforeach
            </div>
        @endif
    </div>
</body>
</html>
