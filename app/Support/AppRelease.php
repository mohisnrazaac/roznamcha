<?php

namespace App\Support;

class AppRelease
{
    protected static ?string $resolvedRelease = null;

    /**
     * Get the current application release identifier (<git short sha>-<UTC build timestamp>).
     */
    public static function get(): string
    {
        if (static::$resolvedRelease !== null) {
            return static::$resolvedRelease;
        }

        // 1. Check explicit config / env
        $configured = config('app.release');
        if (is_string($configured) && trim($configured) !== '') {
            return static::$resolvedRelease = trim($configured);
        }

        // 2. Check .release or release.txt file written during build/deploy
        $releaseFile = base_path('.release');
        if (file_exists($releaseFile)) {
            $content = trim((string) file_get_contents($releaseFile));
            if ($content !== '') {
                return static::$resolvedRelease = $content;
            }
        }

        $fallbackFile = base_path('release.txt');
        if (file_exists($fallbackFile)) {
            $content = trim((string) file_get_contents($fallbackFile));
            if ($content !== '') {
                return static::$resolvedRelease = $content;
            }
        }

        // 3. Check git directly if available
        if (is_dir(base_path('.git')) && function_exists('shell_exec')) {
            $gitOutput = @shell_exec('git -C '.escapeshellarg(base_path()).' log -1 --format="%h-%cd" --date=format-local:"%Y%m%dT%H%M%SZ" 2>/dev/null');
            if (is_string($gitOutput) && trim($gitOutput) !== '') {
                return static::$resolvedRelease = trim($gitOutput);
            }
        }

        // 4. Fallback deterministic release identifier
        return static::$resolvedRelease = 'v1.0.0-'.gmdate('Ymd\THis\Z');
    }

    /**
     * Override or reset the resolved release (useful for testing).
     */
    public static function set(?string $release): void
    {
        static::$resolvedRelease = $release;
    }
}
