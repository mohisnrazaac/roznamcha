import React from 'react';
import PublicLayout from '../../Layouts/PublicLayout';

export default function About() {
    return (
        <PublicLayout variant="inner">
            <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-8 md:p-10 space-y-6">
                    <h1 className="text-2xl font-semibold text-[#001a4a]">
                        What is Roznamcha?
                    </h1>
                    <p className="text-base leading-relaxed text-slate-700">
                        Roznamcha keeps all the kharcha, ration refills, hool fees, and medicine runs in one place so amma doesn’t have to flip five diaries to see what is really happening.
                    </p>
                    <p className="text-base leading-relaxed text-slate-700">
                        We built this reolity-first tool so families get ralat numbers not copbot dashboards—just plain Urdu-English mix that makes sense when daal prices jump overnight.
                    </p>
                </div>
            </section>
        </PublicLayout>
    );
}
