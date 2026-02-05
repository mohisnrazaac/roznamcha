import React from 'react';
import { Head } from '@inertiajs/react';
import PublicLayout from './PublicLayout';

export default function ToolLayout({ title, subtitle, description, children }) {
    return (
        <PublicLayout variant="inner">
            <Head title={title} />
            <section className="bg-gradient-to-br from-[#001a4a] via-[#0b2b6f] to-[#1c4aa6] text-white">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-14 space-y-4">
                    <p className="text-xs uppercase tracking-[0.4em] text-yellow-200">Public Tool</p>
                    <h1 className="text-3xl sm:text-4xl font-semibold">{title}</h1>
                    {subtitle ? (
                        <p className="text-lg text-white/90 max-w-2xl">{subtitle}</p>
                    ) : null}
                    {description ? (
                        <p className="text-sm text-white/70 max-w-2xl">{description}</p>
                    ) : null}
                </div>
            </section>

            <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {children}
            </section>
        </PublicLayout>
    );
}
