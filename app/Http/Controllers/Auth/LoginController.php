<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Support\ActivationSession;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class LoginController extends Controller
{
    public function showLogin(Request $request): Response
    {
        if ($request->filled('return_to')) {
            ActivationSession::rememberReturn($request, $request->query('return_to'));
        }

        return Inertia::render('Auth/Login', [
            'returnTo' => ActivationSession::currentReturn($request, '/dashboard'),
        ]);
    }

    public function login(Request $request): RedirectResponse
    {
        if ($request->filled('return_to')) {
            ActivationSession::rememberReturn($request, $request->input('return_to'));
        }

        $credentials = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required'],
        ]);

        if (Auth::attempt($credentials, $request->boolean('remember'))) {
            $request->session()->regenerate();

            if (ActivationSession::hasReturn($request)) {
                return redirect(ActivationSession::pullReturn($request));
            }

            return redirect()->intended('/dashboard');
        }

        return back()->withErrors([
            'email' => 'The provided credentials do not match our records.',
        ])->onlyInput('email');
    }

    public function logout(Request $request): RedirectResponse
    {
        Auth::logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect('/');
    }
}
