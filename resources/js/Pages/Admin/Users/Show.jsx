import React from 'react';
import { Link, router, usePage } from '@inertiajs/react';
import ControlRoomLayout from '@/Layouts/ControlRoomLayout';
import { deleteResource } from '@/lib/inertia';

const safeRoute = (name, params, fallback) => {
  try {
    return route(name, params);
  } catch (error) {
    return typeof fallback === 'function' ? fallback(params) : fallback ?? '#';
  }
};

export default function UsersShow({ managedUser, kharchas = [], rationItems = [] }) {
  const { props } = usePage();
  const flash = props.flash ?? {};
  const currency = props.translations?.commons?.currency ?? '₨';

  const editLabel = 'Edit';
  const deleteLabel = 'Delete';
  const deleteExpenseConfirm = 'Delete this expense?';
  const deleteRationConfirm = 'Delete this ration item?';

  const deleteUser = (force = false) => {
    const message = force
      ? `Force delete ${managedUser.name}? This will remove all of their data.`
      : `Delete ${managedUser.name}?`;

    if (!window.confirm(message)) {
      return;
    }

    const endpoint = safeRoute('admin.users.destroy', managedUser.id, `/admin/users/${managedUser.id}`);

    deleteResource(endpoint, {
      data: { force },
      preserveScroll: true,
    });
  };

  const deleteExpense = (expenseId) => {
    if (!window.confirm(deleteExpenseConfirm)) {
      return;
    }

    const endpoint = safeRoute(
      'admin.users.kharcha.destroy',
      { user: managedUser.id, expense: expenseId },
      `/admin/users/${managedUser.id}/kharcha/${expenseId}`,
    );

    deleteResource(endpoint, { preserveScroll: true });
  };

  const deleteRation = (rationId) => {
    if (!window.confirm(deleteRationConfirm)) {
      return;
    }

    const endpoint = safeRoute(
      'admin.users.ration.destroy',
      { user: managedUser.id, ration: rationId },
      `/admin/users/${managedUser.id}/ration/${rationId}`,
    );

    deleteResource(endpoint, { preserveScroll: true });
  };

  const formatAmount = (value) => `${currency} ${Number(value ?? 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}`;

  const hasRelatedRecords = (managedUser.kharcha_count ?? 0) + (managedUser.ration_count ?? 0) > 0;

  return (
    <ControlRoomLayout active="users">
      <div className="p-6 md:p-10 text-white space-y-6">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <Link href={route('admin.users.index')} className="text-xs uppercase tracking-wide text-slate-400 hover:text-slate-200">
              ← Back to users
            </Link>
            <h1 className="mt-2 text-2xl font-semibold">{managedUser.name}</h1>
            <p className="text-sm text-slate-400">{managedUser.email}</p>
            <p className="text-xs text-slate-500">
              Role: {managedUser.role} · Joined {managedUser.created_at}
            </p>
          </div>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => deleteUser(false)}
              className="rounded-lg bg-red-500/80 px-4 py-2 text-sm font-semibold text-white hover:bg-red-500"
            >
              Delete User
            </button>
            {hasRelatedRecords && (
              <button
                type="button"
                onClick={() => deleteUser(true)}
                className="rounded-lg border border-red-400 px-4 py-2 text-sm font-semibold text-red-300 hover:bg-red-500/10"
              >
                Force Delete
              </button>
            )}
          </div>
        </div>

        {flash.success && (
          <div className="rounded-lg border border-emerald-500/50 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-100">
            {flash.success}
          </div>
        )}

        {flash.error && (
          <div className="rounded-lg border border-red-500/50 bg-red-500/10 px-4 py-3 text-sm text-red-100">
            {flash.error}
          </div>
        )}

        <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <StatCard label="Kharcha entries" value={managedUser.kharcha_count ?? 0} />
          <StatCard label="Ration items" value={managedUser.ration_count ?? 0} />
          <StatCard
            label="Records total"
            value={(managedUser.kharcha_count ?? 0) + (managedUser.ration_count ?? 0)}
            accent
          />
        </section>

        {hasRelatedRecords && (
          <p className="text-sm text-slate-400">
            Force deleting will purge {managedUser.kharcha_count} kharcha and {managedUser.ration_count} ration entries permanently.
          </p>
        )}

        <section className="rounded-2xl border border-slate-800 bg-slate-900/60">
          <header className="border-b border-slate-800 px-6 py-4">
            <h2 className="text-lg font-semibold">Kharcha overview</h2>
            <p className="text-sm text-slate-400">Showing latest {kharchas.length} entries.</p>
          </header>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-slate-900/80 text-xs uppercase text-slate-400">
                <tr>
                  <th className="px-4 py-3 text-left">Date</th>
                  <th className="px-4 py-3 text-left">Category</th>
                  <th className="px-4 py-3 text-left">Note</th>
                  <th className="px-4 py-3 text-right">Amount</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-100">
                {kharchas.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-4 py-6 text-center text-slate-500">
                      No expenses yet.
                    </td>
                  </tr>
                )}
                {kharchas.map((expense) => (
                  <tr key={expense.id} className="hover:bg-slate-800/40">
                    <td className="px-4 py-3">{expense.date ?? '—'}</td>
                    <td className="px-4 py-3">{expense.category?.name ?? 'Uncategorized'}</td>
                    <td className="px-4 py-3 text-slate-400">{expense.note ?? '—'}</td>
                    <td className="px-4 py-3 text-right font-semibold">{formatAmount(expense.amount)}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-3 text-xs font-semibold">
                        <Link
                          href={route('panel.kharcha.edit', expense.id)}
                          className="text-yellow-300 hover:text-yellow-200"
                        >
                          {editLabel}
                        </Link>
                        <button
                          type="button"
                          onClick={() => deleteExpense(expense.id)}
                          className="text-red-300 hover:text-red-200"
                        >
                          {deleteLabel}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="rounded-2xl border border-slate-800 bg-slate-900/60">
          <header className="border-b border-slate-800 px-6 py-4">
            <h2 className="text-lg font-semibold">Ration overview</h2>
            <p className="text-sm text-slate-400">Active pantry items for this user.</p>
          </header>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-slate-900/80 text-xs uppercase text-slate-400">
                <tr>
                  <th className="px-4 py-3 text-left">Item</th>
                  <th className="px-4 py-3 text-left">Unit</th>
                  <th className="px-4 py-3 text-left">Status</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-100">
                {rationItems.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-4 py-6 text-center text-slate-500">
                      No ration items yet.
                    </td>
                  </tr>
                )}
                {rationItems.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-800/40">
                    <td className="px-4 py-3 font-semibold">{item.name}</td>
                    <td className="px-4 py-3 text-slate-400">{item.unit ?? '—'}</td>
                    <td className="px-4 py-3 text-slate-300">
                      {item.is_active ? (
                        <span className="rounded-full bg-emerald-500/20 px-2 py-1 text-xs text-emerald-300">Active</span>
                      ) : (
                        <span className="rounded-full bg-slate-700/60 px-2 py-1 text-xs text-slate-400">Archived</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-3 text-xs font-semibold">
                        <Link
                          href={route('panel.ration.edit', item.id)}
                          className="text-yellow-300 hover:text-yellow-200"
                        >
                          {editLabel}
                        </Link>
                        <button
                          type="button"
                          onClick={() => deleteRation(item.id)}
                          className="text-red-300 hover:text-red-200"
                        >
                          {deleteLabel}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </ControlRoomLayout>
  );
}

function StatCard({ label, value, accent = false }) {
  return (
    <div
      className={`rounded-2xl border p-5 ${
        accent ? 'border-yellow-400/70 bg-yellow-400/10 text-yellow-200' : 'border-slate-800 bg-slate-900/60 text-slate-100'
      }`}
    >
      <p className="text-xs uppercase tracking-wide text-slate-400">{label}</p>
      <p className="mt-2 text-2xl font-semibold">{value}</p>
    </div>
  );
}
