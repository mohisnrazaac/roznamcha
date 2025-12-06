import React from 'react';
import PublicLayout from '../../Layouts/PublicLayout';

export default function Contact() {
    return (
        <PublicLayout variant="inner">
            <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-8 md:p-10 space-y-8">
                    <div>
                        <h1 className="text-2xl font-semibold text-[#001a4a] mb-2">Contact</h1>
                        <p className="text-sm text-slate-600">
                            Have a suggestion or issue? Drop us a message and the team will get back.
                        </p>
                    </div>

                    <form className="space-y-5" onSubmit={(event) => event.preventDefault()}>
                        <div className="space-y-2">
                            <label htmlFor="name" className="text-sm font-medium text-slate-700">
                                Name
                            </label>
                            <input
                                id="name"
                                type="text"
                                className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-slate-900 shadow-sm focus:border-[#001a4a] focus:outline-none focus:ring-2 focus:ring-[#001a4a]/30"
                                placeholder="Your name"
                            />
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="email" className="text-sm font-medium text-slate-700">
                                Email
                            </label>
                            <input
                                id="email"
                                type="email"
                                className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-slate-900 shadow-sm focus:border-[#001a4a] focus:outline-none focus:ring-2 focus:ring-[#001a4a]/30"
                                placeholder="you@example.com"
                            />
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="message" className="text-sm font-medium text-slate-700">
                                Message
                            </label>
                            <textarea
                                id="message"
                                rows="4"
                                className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-slate-900 shadow-sm focus:border-[#001a4a] focus:outline-none focus:ring-2 focus:ring-[#001a4a]/30"
                                placeholder="Tell us what's going on"
                            ></textarea>
                        </div>

                        <button
                            type="submit"
                            className="w-full rounded-lg bg-[#001a4a] text-white py-2.5 text-sm font-semibold shadow hover:bg-[#112e66] transition"
                        >
                            Send
                        </button>
                    </form>
                </div>
            </section>
        </PublicLayout>
    );
}
