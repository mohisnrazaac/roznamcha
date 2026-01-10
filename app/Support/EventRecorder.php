<?php

namespace App\Support;

use App\Models\Event;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Arr;
use Throwable;

class EventRecorder
{
    public function __construct(private Request $request)
    {
    }

    public function record(string $name, array $meta = [], ?User $user = null): void
    {
        try {
            $user = $user ?: $this->request->user();
            $sessionId = $this->resolveSessionId();

            if (! $sessionId) {
                return;
            }

            Event::query()->create([
                'user_id' => $user?->id,
                'session_id' => $sessionId,
                'name' => $name,
                'meta' => empty($meta) ? null : $meta,
                'created_at' => now(),
            ]);
        } catch (Throwable $exception) {
            report($exception);
        }
    }

    protected function resolveSessionId(): ?string
    {
        if ($this->request->hasSession()) {
            return $this->request->session()->getId();
        }

        $cookies = $this->request->cookies;

        if ($cookies && $cookies->has('roz_session')) {
            return (string) $cookies->get('roz_session');
        }

        return sha1(implode('|', Arr::whereNotNull([
            $this->request->ip(),
            $this->request->userAgent(),
            (string) microtime(true),
        ])));
    }
}
