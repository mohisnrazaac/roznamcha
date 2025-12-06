import React from 'react';
import { useForm, usePage, router } from '@inertiajs/react';
import ControlRoomLayout from '@/Layouts/ControlRoomLayout';
import ExpenseForm from '@/Components/forms/ExpenseForm';

export default function KharchaCreate({ categories }) {
  const { props } = usePage();
  const translations = props.translations ?? {};

  const form = useForm({
    amount: '',
    tx_date: new Date().toISOString().slice(0, 10),
    category_id: '',
    note: '',
  });

  const submit = (event) => {
    event.preventDefault();
    form.post(route('panel.kharcha.store'));
  };

  return (
    <ControlRoomLayout active="kharcha" user={props.auth?.user}>
      <div className="p-6 md:p-10 text-white space-y-6 max-w-3xl">
        <header>
          <p className="text-xs text-slate-400 uppercase tracking-wide">Panel › Kharcha</p>
          <h1 className="text-2xl font-semibold">{translations.kharcha?.add_expense}</h1>
          <p className="text-sm text-slate-400">{translations.kharcha?.subtitle}</p>
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
