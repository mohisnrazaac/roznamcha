<?php

namespace App\Http\Middleware;

use App\Models\Household;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Str;

class SetHouseholdContext
{
    public function handle(Request $request, Closure $next)
    {
        if (! config('roznamcha.enable_households')) {
            return $next($request);
        }

        if (! Schema::hasTable('households') || ! Schema::hasTable('household_user')) {
            return $next($request);
        }

        $user = $request->user();

        if (! $user) {
            return $next($request);
        }

        $currentHousehold = $request->attributes->get('currentHousehold');

        if (! $currentHousehold) {
            $currentHousehold = $user->households()->first();

            if (! $currentHousehold) {
                $currentHousehold = Household::create([
                    'name' => "{$user->name}'s Home",
                    'slug' => Str::slug($user->name) . '-' . Str::random(5),
                    'owner_id' => $user->id,
                ]);

                $user->households()->attach($currentHousehold->id, ['is_owner' => true]);
            }
        }

        app()->instance('currentHousehold', $currentHousehold);
        $request->attributes->set('currentHousehold', $currentHousehold);

        return $next($request);
    }
}
