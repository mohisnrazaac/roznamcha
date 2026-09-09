<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Concerns\BuildsPublicSeo;
use App\Http\Controllers\Controller;
use App\Models\User;
use App\Support\ActivationSession;
use App\Support\EventRecorder;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;
use Inertia\Response;

class RegisterController extends Controller
{
    use BuildsPublicSeo;

    public function showRegister(Request $request, EventRecorder $events): Response|RedirectResponse
    {
        if (Auth::check()) {
            if ($request->filled('return_to')) {
                return redirect($request->query('return_to'));
            }

            if (ActivationSession::hasReturn($request)) {
                return redirect(ActivationSession::pullReturn($request));
            }

            return redirect()->route('dashboard');
        }

        if ($request->filled('return_to')) {
            ActivationSession::rememberReturn($request, $request->query('return_to'));
        }

        $events->record('signup_started', [
            'path' => $request->path(),
            'ref' => $request->headers->get('referer'),
        ]);

        return Inertia::render('Auth/Register', [
            'returnTo' => ActivationSession::currentReturn($request),
            'seo' => $this->publicSeo('register'),
        ]);
    }

    public function register(Request $request): RedirectResponse
    {
        if ($request->filled('return_to')) {
            ActivationSession::rememberReturn($request, $request->input('return_to'));
        }

        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', 'unique:users,email'],
            'password' => ['required', 'string', 'min:6', 'confirmed'],
        ]);

        $user = User::create([
            'name' => $data['name'],
            'email' => $data['email'],
            'password' => Hash::make($data['password']),
            'role' => 'user',
        ]);

        event(new Registered($user));

        Auth::login($user);

        $destination = ActivationSession::hasReturn($request)
            ? ActivationSession::pullReturn($request)
            : '/dashboard';

        return redirect($destination);
    }
}
