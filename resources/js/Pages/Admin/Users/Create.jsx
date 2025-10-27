import React from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Link, useForm } from '@inertiajs/react';

export default function UsersCreate() {
  const { data, setData, post, processing, errors } = useForm({
    name: '',
    email: '',
    password: '',
    role: 'user',
  });

  const submit = (event) => {
    event.preventDefault();
    post('/admin/users');
  };

  return (
    <AdminLayout>
      <div className="p-6 md:p-10 text-white">
        <div className="mb-6">
          <Link href="/admin/users" className="text-sm text-slate-400 hover:text-slate-200">
            ← Back to users
          </Link>
          <h1 className="mt-2 text-xl font-semibold">Create User</h1>
          <p className="text-sm text-slate-400">Invite a teammate or family member into Roznamcha.</p>
        </div>

        <form onSubmit={submit} className="max-w-xl space-y-5">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-slate-300">
              Name
            </label>
            <input
              id="name"
              type="text"
              value={data.name}
              onChange={(event) => setData('name', event.target.value)}
              required
              className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-800/60 px-3 py-2 text-sm text-white focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
            />
            {errors.name && <p className="mt-1 text-sm text-red-400">{errors.name}</p>}
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-slate-300">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={data.email}
              onChange={(event) => setData('email', event.target.value)}
              required
              className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-800/60 px-3 py-2 text-sm text-white focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
            />
            {errors.email && <p className="mt-1 text-sm text-red-400">{errors.email}</p>}
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-slate-300">
              Temporary Password
            </label>
            <input
              id="password"
              type="password"
              value={data.password}
              onChange={(event) => setData('password', event.target.value)}
              required
              className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-800/60 px-3 py-2 text-sm text-white focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
            />
            {errors.password && <p className="mt-1 text-sm text-red-400">{errors.password}</p>}
          </div>

          <div>
            <label htmlFor="role" className="block text-sm font-medium text-slate-300">
              Role
            </label>
            <select
              id="role"
              value={data.role}
              onChange={(event) => setData('role', event.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-800/60 px-3 py-2 text-sm text-white focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
            >
              <option value="user">Household user</option>
              <option value="admin">Admin</option>
            </select>
            {errors.role && <p className="mt-1 text-sm text-red-400">{errors.role}</p>}
          </div>

          <button
            type="submit"
            disabled={processing}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:bg-blue-900"
          >
            {processing ? 'Creating…' : 'Create user'}
          </button>
        </form>
      </div>
    </AdminLayout>
  );
}
