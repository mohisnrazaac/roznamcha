<?php
// Purpose: One-time public_html cleanup for AdSense review. Deletes only clearly unsafe public files. Delete this script after running.

declare(strict_types=1);

set_time_limit(0);
header('Content-Type: application/json; charset=utf-8');

$root = realpath(__DIR__) ?: __DIR__;
$scriptPath = realpath(__FILE__) ?: __FILE__;

$safeRootFiles = [
    '.htaccess',
    'ads.txt',
    'favicon.ico',
    'google58ef9dafdf5c3b09.html',
    'index.php',
    'manifest.webmanifest',
    'robots.txt',
    'service-worker.js',
    basename(__FILE__),
];

$safeTopLevelDirs = [
    'build',
    'css',
    'documentimages',
    'fonts',
    'icons',
    'images',
    'img',
    'js',
    'media',
    'storage',
    'vendor',
];

$dangerousExactNames = [
    '_build_probe.php',
    '_build_probe.php ',
    'adsense-production-audit.php',
    'adsense-production-fix.php',
    'adsense-resubmission-validator.php',
    'blog-migrate.php',
    'deploy-runner-fixed.php',
    'deploy-runner-no-npm.php',
    'deploy-runner.php',
    'deploy-tools-migrate.php',
    'deploy_daily_return_hooks.php',
    'dply-ruuner.php',
    'error_log',
    'one_time_artisan.php',
    'regenerate-sitemaps.php',
    'run-migration.php',
    'run-migrations.php',
    'run_seeder.php',
    'run-seo-page-snapshots-direct.php',
    'run-seo-page-snapshots-migration.php',
    'run-smart-budget-template-migrations.php',
    'run_activation_migrations.php',
    'storage-link.php',
];

$dangerousExactDirs = [
    '21aprbuild',
    '2junebuild',
];

$dangerousExtensions = [
    'bak',
    'backup',
    'gz',
    'log',
    'old',
    'phar',
    'rar',
    'sql',
    'sqlite',
    'tar',
    'tgz',
    'zip',
];

$dangerousNamePatterns = [
    '/\.env(?:\.|$)/i',
    '/composer\.(?:json|lock)$/i',
    '/package-lock\.json$/i',
    '/package\.json$/i',
    '/phpunit/i',
    '/backup/i',
    '/database/i',
    '/dump/i',
    '/migration/i',
    '/deploy/i',
    '/runner/i',
    '/debug/i',
];

$deleteConfirmed = (string) ($_GET['delete'] ?? '') === 'YES';

$report = [
    'generated_at' => gmdate('c'),
    'root' => $root,
    'mode' => $deleteConfirmed ? 'delete_clearly_unsafe_public_files' : 'dry_run_only_no_files_deleted',
    'deleted' => [],
    'would_delete' => [],
    'kept' => [],
    'failed' => [],
    'skipped_directories' => [],
    'notes' => [
        'Only public_html/public files are scanned.',
        'Core public assets, build, storage, media, icons, robots.txt, ads.txt, service worker, manifest, favicon, Google verification, and index.php are kept.',
        'Default mode is dry run. To delete matched files, run with ?delete=YES after reviewing would_delete.',
        'Delete this script manually after one successful cleanup.',
    ],
];

try {
    $iterator = new RecursiveIteratorIterator(
        new RecursiveCallbackFilterIterator(
            new RecursiveDirectoryIterator($root, FilesystemIterator::SKIP_DOTS),
            function (SplFileInfo $current) use ($root, $safeTopLevelDirs, $dangerousExactDirs, &$report): bool {
                if (! $current->isDir()) {
                    return true;
                }

                $relative = relativePath($root, $current->getPathname());
                $parts = explode('/', $relative);

                if (count($parts) === 1 && in_array($parts[0], $safeTopLevelDirs, true)) {
                    $report['skipped_directories'][] = $relative;

                    return false;
                }

                if (count($parts) === 1 && in_array($parts[0], $dangerousExactDirs, true)) {
                    return true;
                }

                if (str_starts_with($current->getFilename(), '.')) {
                    return false;
                }

                return true;
            }
        ),
        RecursiveIteratorIterator::SELF_FIRST
    );

    foreach ($iterator as $file) {
        if (! $file instanceof SplFileInfo) {
            continue;
        }

        $path = $file->getPathname();
        $realPath = realpath($path) ?: $path;

        if ($realPath === $scriptPath) {
            $report['kept'][] = [
                'path' => relativePath($root, $path),
                'reason' => 'current cleanup script',
            ];
            continue;
        }

        $relative = relativePath($root, $path);
        $basename = $file->getBasename();
        $extension = strtolower($file->getExtension());

        if ($file->isDir()) {
            if (dirname($relative) === '.' && in_array($basename, $dangerousExactDirs, true)) {
                $reason = 'old public build backup directory';

                if (! $deleteConfirmed) {
                    $report['would_delete'][] = [
                        'path' => $relative,
                        'reason' => $reason,
                    ];
                } elseif (removeDirectory($path)) {
                    $report['deleted'][] = [
                        'path' => $relative,
                        'reason' => $reason,
                    ];
                } else {
                    $report['failed'][] = [
                        'path' => $relative,
                        'reason' => $reason,
                        'error' => 'directory removal failed',
                    ];
                }
            }

            continue;
        }

        if (dirname($relative) === '.' && (in_array($basename, $safeRootFiles, true) || isVerificationFile($basename))) {
            $report['kept'][] = [
                'path' => $relative,
                'reason' => 'safe root file',
            ];
            continue;
        }

        $reason = deletionReason($relative, $basename, $extension, $dangerousExactNames, $dangerousExtensions, $dangerousNamePatterns);

        if ($reason === null) {
            $report['kept'][] = [
                'path' => $relative,
                'reason' => 'not matched by cleanup rules',
            ];
            continue;
        }

        if (! $deleteConfirmed) {
            $report['would_delete'][] = [
                'path' => $relative,
                'reason' => $reason,
            ];
            continue;
        }

        if (@unlink($path)) {
            $report['deleted'][] = [
                'path' => $relative,
                'reason' => $reason,
            ];
        } else {
            $report['failed'][] = [
                'path' => $relative,
                'reason' => $reason,
                'error' => 'unlink failed',
            ];
        }
    }

    $report['summary'] = [
        'deleted_count' => count($report['deleted']),
        'would_delete_count' => count($report['would_delete']),
        'failed_count' => count($report['failed']),
        'kept_count' => count($report['kept']),
        'skipped_directory_count' => count(array_unique($report['skipped_directories'])),
        'status' => ! $deleteConfirmed
            ? 'dry_run_review_before_delete'
            : ($report['failed'] === [] ? 'completed' : 'completed_with_failures'),
    ];

    echo json_encode($report, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
} catch (Throwable $throwable) {
    http_response_code(500);
    echo json_encode([
        'error' => 'Cleanup failed.',
        'message' => $throwable->getMessage(),
        'file' => $throwable->getFile(),
        'line' => $throwable->getLine(),
        'partial_report' => $report,
    ], JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
}

function deletionReason(
    string $relative,
    string $basename,
    string $extension,
    array $dangerousExactNames,
    array $dangerousExtensions,
    array $dangerousNamePatterns
): ?string {
    if (in_array($basename, $dangerousExactNames, true) || in_array(trim($basename), $dangerousExactNames, true)) {
        return 'known temporary deploy/audit/migration script';
    }

    if (in_array($extension, $dangerousExtensions, true)) {
        return 'archive, dump, log, backup, or database-like file extension';
    }

    foreach ($dangerousNamePatterns as $pattern) {
        if (preg_match($pattern, $basename) === 1 || preg_match($pattern, $relative) === 1) {
            return 'suspicious public filename pattern';
        }
    }

    return null;
}

function isVerificationFile(string $basename): bool
{
    return preg_match('/^(google[a-z0-9_-]+|BingSiteAuth)\.(html|xml)$/i', $basename) === 1;
}

function removeDirectory(string $path): bool
{
    if (! is_dir($path)) {
        return false;
    }

    $iterator = new RecursiveIteratorIterator(
        new RecursiveDirectoryIterator($path, FilesystemIterator::SKIP_DOTS),
        RecursiveIteratorIterator::CHILD_FIRST
    );

    foreach ($iterator as $item) {
        if ($item->isDir()) {
            if (! @rmdir($item->getPathname())) {
                return false;
            }
        } elseif (! @unlink($item->getPathname())) {
            return false;
        }
    }

    return @rmdir($path);
}

function relativePath(string $root, string $path): string
{
    $root = rtrim(str_replace('\\', '/', $root), '/');
    $path = str_replace('\\', '/', $path);

    if (str_starts_with($path, $root.'/')) {
        return substr($path, strlen($root) + 1);
    }

    return basename($path);
}
