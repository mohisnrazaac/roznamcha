import React, { useEffect } from 'react';
import OnboardingLayout from '../../Layouts/OnboardingLayout';

export default function Done({ progress = {}, nextUrl = '/dashboard' }) {
    useEffect(() => {
        if (!nextUrl || nextUrl === '/dashboard') {
            return undefined;
        }

        const timer = setTimeout(() => {
            window.location.href = nextUrl;
        }, 2000);

        return () => clearTimeout(timer);
    }, [nextUrl]);

    return (
        <OnboardingLayout title="You're ready!" progress={progress}>
            <div className="space-y-4 text-slate-200">
                <p className="text-lg font-semibold text-white">
                    Household created, budget set, first expense logged. Roznamcha is now personalised for you.
                </p>
                <p className="text-sm text-slate-400">
                    Head to your Control Room to keep tracking kharcha or jump back to the article you came from.
                </p>

                <div className="flex flex-wrap gap-3">
                    <a
                        href="/panel/kharcha"
                        className="rounded-full bg-emerald-400/90 px-5 py-2 text-sm font-semibold text-emerald-950 transition hover:bg-emerald-300"
                    >
                        Go to Control Room
                    </a>
                    {nextUrl && (
                        <a
                            href={nextUrl}
                            className="rounded-full border border-slate-700 px-5 py-2 text-sm font-semibold text-slate-100 hover:bg-slate-800"
                        >
                            Continue reading
                        </a>
                    )}
                </div>
            </div>
        </OnboardingLayout>
    );
}
