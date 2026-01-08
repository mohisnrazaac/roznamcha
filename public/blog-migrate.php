<?php

declare(strict_types=1);

set_time_limit(0);
header('Content-Type: text/plain; charset=utf-8');

$root = resolveProjectRoot(__DIR__);
chdir($root);

$commands = [
    'php artisan migrate --path=database/migrations/2025_12_19_110510_create_blog_posts_table.php --force',
    'php artisan migrate --path=database/migrations/2025_12_19_110514_create_blog_categories_table.php --force',
    'php artisan migrate --path=database/migrations/2025_12_19_110518_create_blog_category_post_table.php --force',
    'php artisan db:seed --class=BlogSeeder --force',
];

foreach ($commands as $command) {
    [$expandable, $resolved] = expandCommand($command);
    if (! $expandable) {
        echo "[skip] {$resolved}\n";
        continue;
    }

    echo "[run] {$resolved}\n";
    [$code, $output] = runCommand($resolved);
    echo $output . "\n";

    if ($code !== 0) {
        echo "Command failed (exit {$code}). Aborting.\n";
        exit($code);
    }
}

echo "Blog migrations and seed completed.\n";

function runCommand(string $command): array
{
    $proc = proc_open(
        $command,
        [
            1 => ['pipe', 'w'],
            2 => ['pipe', 'w'],
        ],
        $pipes
    );

    if (! is_resource($proc)) {
        return [1, "Unable to start {$command}"];
    }

    $stdout = stream_get_contents($pipes[1]);
    $stderr = stream_get_contents($pipes[2]);
    foreach ($pipes as $pipe) {
        fclose($pipe);
    }

    $exit = proc_close($proc);
    $output = trim($stdout."\n".$stderr);

    return [$exit, $output];
}

function expandCommand(string $command): array
{
    if (! preg_match('/^(\\S+)/', $command, $matches)) {
        return [false, "Unable to parse command: {$command}"];
    }

    $binary = $matches[1];
    $envKey = $binary === 'php' ? 'DEPLOY_PHP_BIN' : null;
    $resolved = resolveBinary($binary, $envKey);

    if (! $resolved) {
        $hint = $envKey
            ? "Binary {$binary} missing. Set {$envKey} in .env with full path."
            : "Binary {$binary} missing on server.";

        return [false, $hint];
    }

    $updated = preg_replace('/^'.preg_quote($binary, '/').'/', $resolved, $command, 1);

    return [true, $updated];
}

function resolveBinary(string $binary, ?string $envKey = null): ?string
{
    if ($envKey) {
        $custom = getenv($envKey);
        if ($custom && is_executable($custom)) {
            return $custom;
        }
    }

    $which = trim((string) shell_exec("command -v {$binary} 2>/dev/null"));
    return $which !== '' && is_executable($which) ? $which : null;
}

function resolveProjectRoot(string $startDir): string
{
    $override = getenv('DEPLOY_PROJECT_ROOT');
    if ($override && is_dir($override)) {
        return realpath($override) ?: $override;
    }

    $start = realpath($startDir) ?: $startDir;
    $depth = 0;
    $maxDepth = 4;

    $queue = [[$start, 0]];
    $seen = [];

    while (! empty($queue)) {
        [$current, $depth] = array_shift($queue);

        if (isset($seen[$current])) {
            continue;
        }
        $seen[$current] = true;

        if (looksLikeLaravel($current)) {
            return $current;
        }

        if ($depth >= $maxDepth) {
            continue;
        }

        $parent = dirname($current);
        if ($parent && $parent !== $current) {
            $queue[] = [$parent, $depth + 1];
        }

        foreach (glob($current.'/*', GLOB_ONLYDIR) ?: [] as $child) {
            $queue[] = [$child, $depth + 1];
        }
    }

    return $start;
}

function looksLikeLaravel(string $path): bool
{
    return is_file($path.'/artisan') && is_file($path.'/.env');
}
