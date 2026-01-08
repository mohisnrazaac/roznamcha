<?php

declare(strict_types=1);

set_time_limit(0);
header('Content-Type: text/plain; charset=utf-8');

$root = resolveProjectRoot(__DIR__);
chdir($root);

[$expandable, $command] = expandCommand('php artisan storage:link');
if (! $expandable) {
    echo "[skip] {$command}\n";
    exit(0);
}

echo "[run] {$command}\n";
[$exit, $output] = runCommand($command);
echo $output . "\n";

if ($exit !== 0) {
    echo "storage:link failed with exit code {$exit}\n";
    exit($exit);
}

echo "Storage symlink created.\n";

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
            ? "Binary {$binary} missing. Set {$envKey} with full path."
            : "Binary {$binary} is not available on the server.";

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
    $queue = [[$start, 0]];
    $maxDepth = 4;
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
