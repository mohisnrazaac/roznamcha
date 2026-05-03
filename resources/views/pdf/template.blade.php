{{-- Purpose: Render free and pro smart budget template PDFs. Date: 2026-03-27. Author: Codex. --}}
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>{{ $document['title'] }}</title>
    <style>
        body {
            font-family: DejaVu Sans, sans-serif;
            font-size: 12px;
            color: #0f172a;
            margin: 24px;
        }

        h1, h2, h3, p {
            margin: 0;
        }

        .panel {
            border: 1px solid #dbe4f0;
            border-radius: 14px;
            padding: 16px;
            margin-bottom: 16px;
        }

        .hero {
            background: #f8fafc;
        }

        .eyebrow {
            font-size: 10px;
            text-transform: uppercase;
            letter-spacing: 0.24em;
            color: #9a6700;
            margin-bottom: 8px;
        }

        .stats td {
            width: 33.33%;
            padding: 10px 12px;
            background: #fff8e1;
            border: 1px solid #f1e2a4;
        }

        table {
            width: 100%;
            border-collapse: collapse;
        }

        th, td {
            border: 1px solid #dbe4f0;
            padding: 10px 12px;
            text-align: left;
        }

        th {
            background: #f8fafc;
        }

        ul {
            margin: 10px 0 0;
            padding-left: 18px;
        }

        li {
            margin-bottom: 8px;
        }

        .badge {
            display: inline-block;
            padding: 4px 8px;
            border-radius: 999px;
            font-size: 10px;
            font-weight: bold;
            text-transform: uppercase;
        }

        .badge-free {
            background: #dcfce7;
            color: #166534;
        }

        .badge-pro {
            background: #0f172a;
            color: #fde68a;
        }
    </style>
</head>
<body>
    <section class="panel hero">
        <p class="eyebrow">Roznamcha Smart Budget Templates</p>
        <h1>{{ $document['title'] }}</h1>
        <p style="margin-top: 8px;">
            <span class="badge {{ $document['mode'] === 'pro' ? 'badge-pro' : 'badge-free' }}">
                {{ strtoupper($document['mode']) }}
            </span>
        </p>
        <p style="margin-top: 14px; line-height: 1.6;">
            Built for Pakistani household survival. This export is meant to be saved, revisited, and compared against your real monthly kharcha instead of being used once and forgotten.
        </p>

        <table class="stats" style="margin-top: 16px;">
            <tr>
                <td>
                    <strong>Salary Target</strong><br>
                    PKR {{ number_format($document['salary']) }}
                </td>
                <td>
                    <strong>Family Size</strong><br>
                    {{ $document['family_size'] ?: 'N/A' }}
                </td>
                <td>
                    <strong>Generated Source</strong><br>
                    {{ strtoupper($document['source']) }}
                </td>
            </tr>
        </table>
    </section>

    <section class="panel">
        <p class="eyebrow">Free Version</p>
        <h2>Category Breakdown</h2>
        <table style="margin-top: 14px;">
            <thead>
                <tr>
                    <th>Category</th>
                    <th>Amount</th>
                    <th>Percentage</th>
                </tr>
            </thead>
            <tbody>
                @foreach ($document['categories'] as $item)
                    <tr>
                        <td>{{ $item['category'] }}</td>
                        <td>PKR {{ number_format($item['amount']) }}</td>
                        <td>{{ number_format($item['percentage'], 2) }}%</td>
                    </tr>
                @endforeach
            </tbody>
        </table>
    </section>

    <section class="panel">
        <p class="eyebrow">Free Version</p>
        <h2>Practical Saving Tips</h2>
        <ul>
            @foreach ($document['saving_tips'] as $tip)
                <li>{{ $tip }}</li>
            @endforeach
        </ul>
    </section>

    @if ($document['mode'] === 'pro')
        <section class="panel">
            <p class="eyebrow">PRO Version</p>
            <h2>Inflation Impact ({{ $document['inflation_rate_percent'] }}%)</h2>
            <table style="margin-top: 14px;">
                <thead>
                    <tr>
                        <th>Category</th>
                        <th>Current</th>
                        <th>Next Month</th>
                    </tr>
                </thead>
                <tbody>
                    @foreach ($document['inflation_categories'] as $item)
                        <tr>
                            <td>{{ $item['category'] }}</td>
                            <td>PKR {{ number_format($item['current_amount']) }}</td>
                            <td>PKR {{ number_format($item['inflated_amount']) }}</td>
                        </tr>
                    @endforeach
                </tbody>
            </table>
            <p style="margin-top: 12px; line-height: 1.6;">
                <strong>Projected next month total:</strong>
                PKR {{ number_format($document['next_month_projection']) }}
            </p>
        </section>

        <section class="panel">
            <p class="eyebrow">PRO Version</p>
            <h2>Ask Roza Tips</h2>
            <ul>
                @foreach ($document['ask_roza_tips'] as $tip)
                    <li>{{ $tip }}</li>
                @endforeach
            </ul>
            <p style="margin-top: 14px; color: #475569; line-height: 1.6;">
                Billing hook placeholder: JazzCash / SadaPay
            </p>
        </section>
    @endif
</body>
</html>
