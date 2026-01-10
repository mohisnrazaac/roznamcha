<?php

namespace App\Support;

use Illuminate\Http\Request;
use Illuminate\Support\Arr;
use Illuminate\Support\Str;

class ActivationSession
{
    public const RETURN_KEY = 'activation.return';
    public const COMPLETE_KEY = 'activation.complete';
    public const PREFILL_KEY = 'activation.prefill';

    public static function rememberReturn(Request $request, ?string $target, string $fallback = '/onboarding'): string
    {
        $normalized = static::normalize($target, $fallback);
        $request->session()->put(static::RETURN_KEY, $normalized);

        return $normalized;
    }

    public static function pullReturn(Request $request, string $fallback = '/dashboard'): string
    {
        return $request->session()->pull(static::RETURN_KEY, $fallback);
    }

    public static function rememberCompletion(Request $request, ?string $target, string $fallback = '/dashboard'): string
    {
        $normalized = static::normalize($target, $fallback);
        $request->session()->put(static::COMPLETE_KEY, $normalized);

        return $normalized;
    }

    public static function hasCompletion(Request $request): bool
    {
        return $request->session()->has(static::COMPLETE_KEY);
    }

    public static function pullCompletion(Request $request, string $fallback = '/dashboard'): string
    {
        return $request->session()->pull(static::COMPLETE_KEY, $fallback);
    }

    public static function hasReturn(Request $request): bool
    {
        return $request->session()->has(static::RETURN_KEY);
    }

    public static function currentReturn(Request $request, string $fallback = '/dashboard'): string
    {
        return $request->session()->get(static::RETURN_KEY, $fallback);
    }

    public static function storePrefill(Request $request, array $prefill): void
    {
        $request->session()->put(static::PREFILL_KEY, Arr::only($prefill, ['category', 'tags', 'amount', 'note']));
    }

    public static function getPrefill(Request $request): array
    {
        return $request->session()->get(static::PREFILL_KEY, []);
    }

    public static function forgetPrefill(Request $request): void
    {
        $request->session()->forget(static::PREFILL_KEY);
    }

    protected static function normalize(?string $target, string $fallback): string
    {
        $target = trim((string) $target);

        if ($target === '' || Str::startsWith($target, ['http://', 'https://'])) {
            return $fallback;
        }

        if (! Str::startsWith($target, '/')) {
            $target = '/'.ltrim($target, '/');
        }

        return Str::limit($target, 255, '');
    }
}
