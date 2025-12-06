import React from 'react';
import PublicLayout from '@/Layouts/PublicLayout';
import { Link, useForm } from '@inertiajs/react';

export default function Login({ canResetPassword = true, status }) {
  const form = useForm({
    email: '',
    password: '',
    remember: false,
  });

  const submit = (event) => {
    event.preventDefault();
    form.post(route('login'), {
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
        </div>
      </section>
    </PublicLayout>
  );
}
