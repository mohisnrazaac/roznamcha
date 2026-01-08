<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>Roznamcha – Offline</title>
        <link rel="icon" href="/favicon.ico">
        <style>
            :root {
                color-scheme: light dark;
            }
            body {
                font-family: 'Inter', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
                min-height: 100vh;
                margin: 0;
                display: flex;
                align-items: center;
                justify-content: center;
                padding: 2rem;
                background: #061325;
                color: #f8fafc;
            }
            .card {
                max-width: 480px;
                width: 100%;
                background: rgba(255, 255, 255, 0.04);
                border: 1px solid rgba(248, 250, 252, 0.16);
                border-radius: 1rem;
                padding: 2.5rem 2rem;
                text-align: center;
                backdrop-filter: blur(6px);
            }
            h1 {
                font-size: 1.75rem;
                margin-bottom: 1rem;
                letter-spacing: -0.01em;
            }
            p {
                font-size: 1rem;
                margin-bottom: 1.5rem;
                color: rgba(248, 250, 252, 0.9);
            }
            button {
                border: none;
                border-radius: 999px;
                padding: 0.85rem 1.75rem;
                font-size: 0.95rem;
                font-weight: 600;
                background: #ffb703;
                color: #061325;
                cursor: pointer;
            }
        </style>
    </head>
    <body>
        <main class="card">
            <h1>You are offline</h1>
            <p>Roznamcha couldn’t connect to the internet. Check your connection and reopen the app to keep tracking kharcha.</p>
            <button type="button" onclick="window.location.reload()">
                Try again
            </button>
        </main>
    </body>
</html>
