<?php

declare(strict_types=1);

set_time_limit(0);
header('Content-Type: text/plain; charset=utf-8');

$rootPath = resolveProjectRoot(__DIR__);
chdir($rootPath);

ensureBootstrapCache($rootPath);

$commands = [
    'npm install --omit=dev',
    'npm run build',
];

$commands[] = 'php artisan route:clear';
$commands[] = 'php artisan config:clear';
$commands[] = 'php artisan cache:clear';
$commands[] = 'php artisan view:clear';

if (shouldRunOptimize()) {
    $commands[] = 'php artisan optimize:clear';
    $commands[] = 'php artisan optimize';
}

foreach ($commands as $command) {
    [$expandable, $resolved] = expandCommand($command);

    if (!$expandable) {
        echo "Skipping: {$command}\n{$resolved}\n";
        continue;
    }

    echo "Running: {$resolved}\n";
    [$exitCode, $output] = runCommand($resolved);
    echo $output . "\n";

    if ($exitCode !== 0) {
        echo "Command failed with exit code {$exitCode}. Aborting remaining steps.\n";
        exit($exitCode);
    }
}

echo "All commands completed successfully.\n";

function runCommand(string $command): array
{
    $process = proc_open(
        $command,
        [
            1 => ['pipe', 'w'],
            2 => ['pipe', 'w'],
        ],
        $pipes
    );

    if (!is_resource($process)) {
        return [1, "Unable to start process for {$command}"];
    }

    $stdout = stream_get_contents($pipes[1]);
    $stderr = stream_get_contents($pipes[2]);
    fclose($pipes[1]);
    fclose($pipes[2]);

    $exitCode = proc_close($process);
    $output = trim($stdout . "\n" . $stderr);

    return [$exitCode, $output];
}

function expandCommand(string $command): array
{
    if (!preg_match('/^(\\S+)/', $command, $matches)) {
        return [false, "Unable to parse command: {$command}"];
    }

    $binary = $matches[1];
    $envKey = match ($binary) {
        'npm' => 'DEPLOY_NPM_BIN',
        'php' => 'DEPLOY_PHP_BIN',
        default => null,
    };

    $resolved = resolveBinary($binary, $envKey);

    if (!$resolved) {
        $hint = "Missing executable: {$binary}. Install it on the server or define {$envKey} in .env with the full path.";
        return [false, $hint];
    }

    $commandWithResolvedBinary = preg_replace('/^' . preg_quote($binary, '/') . '/', $resolved, $command, 1);

    return [true, $commandWithResolvedBinary];
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
    if ($which !== '' && is_executable($which)) {
        return $which;
    }

    return null;
}

function resolveProjectRoot(string $startDir): string
{
    $envOverride = getenv('DEPLOY_PROJECT_ROOT');
    if ($envOverride && is_dir($envOverride)) {
        return realpath($envOverride) ?: $envOverride;
    }

    $start = realpath($startDir) ?: $startDir;
    $maxDepth = 4;
    $queue = [[$start, 0]];
    $visited = [];

    while (!empty($queue)) {
        [$current, $depth] = array_shift($queue);
        if (isset($visited[$current])) {
            continue;
        }
        $visited[$current] = true;

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

        foreach (glob($current . '/*', GLOB_ONLYDIR) ?: [] as $child) {
            $queue[] = [$child, $depth + 1];
        }
    }

    return $start;
}

function looksLikeLaravel(string $path): bool
{
    return is_file($path . '/artisan') && is_file($path . '/.env');
}

function shouldRunOptimize(): bool
{
    $value = getenv('DEPLOY_RUN_OPTIMIZE');
    if ($value === false || $value === '') {
        return true;
    }

    return filter_var($value, FILTER_VALIDATE_BOOLEAN, FILTER_NULL_ON_FAILURE) ?? false;
}

function ensureBootstrapCache(string $rootPath): void
{
    $cacheDir = $rootPath.'/bootstrap/cache';

    if (! is_dir($cacheDir)) {
        if (! mkdir($cacheDir, 0775, true) && ! is_dir($cacheDir)) {
            throw new RuntimeException("Unable to create bootstrap/cache directory at {$cacheDir}");
        }
    }

    if (! is_writable($cacheDir)) {
        @chmod($cacheDir, 0775);
    }
}
