import React from 'react';
import PublicLayout from '@/Layouts/PublicLayout';
import { Link, useForm } from '@inertiajs/react';

export default function Login({ canResetPassword = true, status, returnTo = '/dashboard' }) {
  const form = useForm({
    email: '',
    password: '',
    remember: false,
    return_to: returnTo,
  });

  const submit = (event) => {
    event.preventDefault();
    form.post('/login', {
      onFinish: () => form.reset('password'),
    });
  };

  return (
    <PublicLayout>
      <section className="max-w-sm mx-auto px-4 py-16">
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6 space-y-5">
          <div>
            <h1 className="text-xl font-bold text-slate-900 mb-2">
              Sign in to Roznamcha
            </h1>
            <p className="text-slate-600 text-xs leading-relaxed">
              Your data is private. Only you see your household numbers.
            </p>
          </div>

          {returnTo && returnTo.startsWith('/templates/') && (
            <div className="rounded-xl border border-blue-200 bg-blue-50 p-3 text-center">
              <p className="text-xs text-slate-700">
                Just looking to check this budget template?
              </p>
              <Link
                href={returnTo}
                className="mt-1 inline-flex items-center text-xs font-semibold text-blue-600 hover:text-blue-700 underline"
              >
                ← Continue viewing template without signing in
              </Link>
            </div>
          )}

          {status && (
            <div className="rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs text-emerald-700">
              {status}
            </div>
          )}

          <form onSubmit={submit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Email
              </label>
              <input
                type="email"
                value={form.data.email}
                onChange={(event) => form.setData('email', event.target.value)}
                className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#003a8c]/30 focus:border-[#003a8c]"
                placeholder="you@example.com"
                autoComplete="username"
              />
              {form.errors.email && (
                <p className="mt-1 text-[11px] text-red-500">{form.errors.email}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Password
              </label>
              <input
                type="password"
                value={form.data.password}
                onChange={(event) => form.setData('password', event.target.value)}
                className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#003a8c]/30 focus:border-[#003a8c]"
                placeholder="••••••••"
                autoComplete="current-password"
              />
              {form.errors.password && (
                <p className="mt-1 text-[11px] text-red-500">{form.errors.password}</p>
              )}
            </div>

            <div className="flex items-center justify-between text-xs text-slate-600">
              <label className="inline-flex items-center gap-2 select-none">
                <input
                  type="checkbox"
                  checked={form.data.remember}
                  onChange={(event) => form.setData('remember', event.target.checked)}
                  className="rounded border-slate-300 text-[#003a8c] focus:ring-[#003a8c]"
                />
                <span>Remember me</span>
              </label>

              {canResetPassword && (
                <Link
                  href={route('password.request')}
                  className="text-[11px] text-slate-500 hover:text-slate-700"
                >
                  Forgot password?
                </Link>
              )}
            </div>

            <button
              type="submit"
              disabled={form.processing}
              className="w-full bg-[#003a8c] hover:bg-[#002a66] disabled:bg-[#003a8c]/60 text-white font-semibold text-sm px-4 py-2 rounded-md shadow"
            >
              {form.processing ? 'Signing in…' : 'Login'}
            </button>
          </form>

          <p className="text-center text-xs text-slate-500 pt-2 border-t border-slate-100">
            Don't have an account?{' '}
            <Link
              href={
                returnTo && returnTo !== '/dashboard'
                  ? `/register?return_to=${encodeURIComponent(returnTo)}`
                  : '/register'
              }
              className="font-semibold text-[#003a8c] hover:underline"
            >
              Sign up
            </Link>
          </p>
        </div>
      </section>
    </PublicLayout>
  );
}
