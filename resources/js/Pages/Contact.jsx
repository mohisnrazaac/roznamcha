import React from 'react';
import PublicLayout from '@/Layouts/PublicLayout';

export default function Contact() {
  return (
    <PublicLayout>
      <section id="contact" className="max-w-xl mx-auto px-4 py-16">
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6">
          <h1 className="text-xl font-bold text-slate-900 mb-2">
            Contact Us
          </h1>
          <p className="text-slate-600 text-sm mb-6">
            Tell us what you need. We’ll reply on email when we’re ready.
            Shukriya.
          </p>

          <form className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Name
              </label>
              <input
                type="text"
                className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#003a8c]/30 focus:border-[#003a8c]"
                placeholder="Your name"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Email
              </label>
              <input
                type="email"
                className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#003a8c]/30 focus:border-[#003a8c]"
                placeholder="you@email.com"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Message
              </label>
              <textarea
                rows="4"
                className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#003a8c]/30 focus:border-[#003a8c]"
                placeholder="How can we help?"
              />
            </div>

            <button
              type="button"
              className="bg-[#003a8c] hover:bg-[#002a66] text-white font-semibold text-sm px-4 py-2 rounded-md shadow"
            >
              Send
            </button>
          </form>
        </div>
      </section>
    </PublicLayout>
  );
}
