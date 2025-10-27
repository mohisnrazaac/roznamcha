import React from 'react';
import PublicLayout from '@/Layouts/PublicLayout';

export default function About() {
  return (
    <PublicLayout>
      <section className="max-w-3xl mx-auto px-4 py-16">
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6">
          <h1 className="text-2xl font-bold text-slate-900 mb-4">
            What is Roznamcha?
          </h1>
          <p className="text-slate-700 text-sm leading-relaxed mb-4">
            Roznamcha is your household control center. It helps you record
            daily spend, monitor ration usage, remember school fees and
            medicine times, and prepare a survival plan for next month.
          </p>
          <p className="text-slate-700 text-sm leading-relaxed">
            Built for Pakistani families in Urdu and English. No corporate
            finance jargon. Just daily reality: cash, slips, kids’ fees,
            petrol, BP medicine, electricity bills — all in one cockpit.
          </p>
        </div>
      </section>
    </PublicLayout>
  );
}
