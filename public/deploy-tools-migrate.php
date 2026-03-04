<?php

error_reporting(E_ALL);
ini_set('display_errors', '1');
@set_time_limit(0);
header('Content-Type: text/plain; charset=utf-8');

echo "Roznamcha Deploy Helper\n";
echo "PHP: ".PHP_VERSION."\n\n";

$action = isset($_GET['action']) ? (string) $_GET['action'] : 'migrate-tools';
$allowed = array('migrate-tools', 'migrate-all', 'clear-caches');

if (!in_array($action, $allowed, true)) {
    http_response_code(400);
    echo "Invalid action. Allowed: migrate-tools, migrate-all, clear-caches\n";
    exit;
}

$root = resolveProjectRoot(__DIR__);
chdir($root);

echo "Project root: {$root}\n";
echo "artisan exists: ".(file_exists($root.'/artisan') ? 'yes' : 'no')."\n";
echo "vendor autoload exists: ".(file_exists($root.'/vendor/autoload.php') ? 'yes' : 'no')."\n";
echo "bootstrap/app.php exists: ".(file_exists($root.'/bootstrap/app.php') ? 'yes' : 'no')."\n\n";

if (!file_exists($root.'/artisan') || !file_exists($root.'/vendor/autoload.php') || !file_exists($root.'/bootstrap/app.php')) {
    http_response_code(500);
    echo "Laravel bootstrap files not found. Check deployment paths.\n";
    exit;
}

try {
    require $root.'/vendor/autoload.php';
    $app = require $root.'/bootstrap/app.php';

    $kernel = $app->make('Illuminate\\Contracts\\Console\\Kernel');

    echo "Action: {$action}\n\n";

    if ($action === 'migrate-tools') {
        runArtisan($kernel, 'migrate', array(
            '--force' => true,
            '--path' => 'database/migrations/2026_02_22_120000_create_slab_rates_table.php',
        ));
        runArtisan($kernel, 'optimize:clear');
    }

    if ($action === 'migrate-all') {
        runArtisan($kernel, 'migrate', array('--force' => true));
        runArtisan($kernel, 'optimize:clear');
    }

    if ($action === 'clear-caches') {
        runArtisan($kernel, 'optimize:clear');
    }

    echo "Done. Delete public/deploy-tools-migrate.php after use.\n";
} catch (Throwable $e) {
    http_response_code(500);
    echo "Fatal: ".$e->getMessage()."\n";
    echo "File: ".$e->getFile().":".$e->getLine()."\n\n";
    echo $e->getTraceAsString()."\n";
}

function runArtisan($kernel, $command, $parameters = array())
{
    echo ">> php artisan {$command}\n";
    $code = $kernel->call($command, $parameters);
    echo $kernel->output()."\n";

    if ((int) $code !== 0) {
        throw new Exception("Command {$command} failed with exit code {$code}");
    }
}

function resolveProjectRoot($startDir)
{
    $envOverride = getenv('DEPLOY_PROJECT_ROOT');
    if ($envOverride && is_dir($envOverride)) {
        $real = realpath($envOverride);
        return $real ? $real : $envOverride;
    }

    $start = realpath($startDir);
    if (!$start) {
        $start = $startDir;
    }

    $queue = array(array($start, 0));
    $visited = array();
    $maxDepth = 5;

    while (!empty($queue)) {
        $item = array_shift($queue);
        $current = $item[0];
        $depth = $item[1];

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
            $queue[] = array($parent, $depth + 1);
        }

        $children = glob($current . '/*', GLOB_ONLYDIR);
        if (is_array($children)) {
            foreach ($children as $child) {
                $queue[] = array($child, $depth + 1);
            }
        }
    }

    return $start;
}

function looksLikeLaravel($path)
{
    return is_file($path.'/artisan') && is_file($path.'/.env');
}
