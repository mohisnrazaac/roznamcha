<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\ValidationException;
use Illuminate\Validation\Rules\Password as PasswordRule;

class PasswordController extends Controller
{
    public function update(Request $request): RedirectResponse
    {
        Log::info('Admin password update request received', [
            'user_id' => optional($request->user())->id,
            'email' => optional($request->user())->email,
            'ip' => $request->ip(),
            'uri' => $request->getRequestUri(),
            'method' => $request->method(),
        ]);

        $validated = $request->validate([
            'old_password' => ['required'],
            'password' => ['required', 'confirmed', PasswordRule::min(8)],
        ]);

        $user = $request->user();

        if (! Hash::check($validated['old_password'], $user->password)) {
            throw ValidationException::withMessages([
                'old_password' => ['The current password is incorrect.'],
            ]);
        }

        Log::info('Admin password update validated', [
            'user_id' => $user->id,
        ]);

        $user->forceFill([
            'password' => Hash::make($validated['password']),
        ])->save();

        Auth::logoutOtherDevices($validated['password']);

        Log::info('User password updated via admin panel', [
            'user_id' => $user->id,
            'email' => $user->email,
            'ip' => $request->ip(),
        ]);

        Log::info('Admin password updated, logging out user', [
            'user_id' => $user->id,
        ]);

        Auth::logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect()->route('login')->with('status', 'Password updated. Please log in again.');
    }
}
