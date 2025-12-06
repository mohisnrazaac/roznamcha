import React from 'react';
import { useForm, usePage, router } from '@inertiajs/react';
import ControlRoomLayout from '@/Layouts/ControlRoomLayout';
import ExpenseForm from '@/Components/forms/ExpenseForm';

export default function KharchaEdit({ expense, categories }) {
  const { props } = usePage();
  const translations = props.translations ?? {};

  const form = useForm({
    amount: expense.amount ?? '',
    tx_date: expense.tx_date,
    category_id: expense.category_id ?? '',
    note: expense.note ?? '',
  });

  const submit = (event) => {
    event.preventDefault();
    form.put(route('panel.kharcha.update', expense.id));
  };

  const destroy = () => {
    if (confirm('Delete this expense?')) {
      router.delete(route('panel.kharcha.destroy', expense.id));
    }
  };

  return (
    <ControlRoomLayout active="kharcha" user={props.auth?.user}>
      <div className="p-6 md:p-10 text-white space-y-6 max-w-3xl">
        <header className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs text-slate-400 uppercase tracking-wide">Panel › Kharcha</p>
            <h1 className="text-2xl font-semibold">{translations.kharcha?.edit_expense}</h1>
            <p className="text-sm text-slate-400">{translations.kharcha?.subtitle}</p>
          </div>
          <button
            type="button"
            onClick={destroy}
            className="rounded-lg border border-red-400 px-3 py-2 text-xs font-semibold text-red-300 hover:bg-red-400/20"
          >
            {translations.actions?.delete}
          </button>
        </header>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6">
          <ExpenseForm
            form={form}
            categories={categories}
            translations={translations}
            onSubmit={submit}
            onCancel={() => router.visit(route('panel.kharcha.index'))}
          />
        </div>
      </div>
    </ControlRoomLayout>
  );
}
