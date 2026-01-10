import React, { useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { usePage } from '@inertiajs/react';
import { triggerBlogCta } from '../../lib/blogCta';

export default function SchoolFeeIncreaseCalculator({ post, returnPath }) {
    const { props } = usePage();
    const isAuthenticated = Boolean(props?.auth?.user);
    const [currentFee, setCurrentFee] = useState('');
    const [increasePercent, setIncreasePercent] = useState('');
    const [error, setError] = useState(null);

    const results = useMemo(() => {
        const fee = parseFloat(currentFee);
        const percent = parseFloat(increasePercent);

        if (Number.isNaN(fee) || Number.isNaN(percent)) {
            return null;
        }

        const difference = fee * (percent / 100);
        const newMonthly = fee + difference;

        return {
            newMonthly,
            difference,
            yearly: difference * 12,
        };
    }, [currentFee, increasePercent]);

    const handleSave = async () => {
        if (!results) {
            setError('Add current fee and increase % first.');
            return;
        }

        setError(null);

        const note = 'School fee increase';

        if (isAuthenticated) {
            const params = new URLSearchParams({
                prefillCategory: 'School',
                prefillAmount: results.difference.toFixed(2),
                prefillNote: note,
            });
            window.location.href = `${route('onboarding.first-expense')}?${params.toString()}`;

            return;
        }

        await triggerBlogCta({
            postId: post?.id,
            slug: post?.slug,
            returnTo: returnPath,
            prefill: {
                category: 'School',
                amount: results.difference.toFixed(2),
                note,
                tags: ['fees'],
            },
        });
    };

    return (
        <div className="rounded-2xl border border-[#001a4a]/10 bg-white p-6 shadow-sm">
            <div className="flex flex-col gap-4 md:flex-row md:items-end">
                <div className="flex-1">
                    <label className="text-xs font-semibold uppercase tracking-wide text-[#001a4a]">
                        Current monthly school fee (PKR)
                    </label>
                    <input
                        type="number"
                        min="0"
                        value={currentFee}
                        onChange={(event) => setCurrentFee(event.target.value)}
                        className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-2 text-lg font-semibold text-[#001a4a]"
                        placeholder="15000"
                    />
                </div>
                <div className="flex-1">
                    <label className="text-xs font-semibold uppercase tracking-wide text-[#001a4a]">
                        Increase percentage (%)
                    </label>
                    <input
                        type="number"
                        min="0"
                        value={increasePercent}
                        onChange={(event) => setIncreasePercent(event.target.value)}
                        className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-2 text-lg font-semibold text-[#001a4a]"
                        placeholder="18"
                    />
                </div>
                <button
                    type="button"
                    onClick={handleSave}
                    className="rounded-2xl bg-[#001a4a] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#001a4a]/90"
                >
                    Save in Roznamcha
                </button>
            </div>

            {error && <p className="mt-3 text-sm text-red-500">{error}</p>}

            {results && (
                <div className="mt-4 grid gap-4 rounded-xl bg-[#f6f4ff] p-4 text-sm text-[#001a4a] sm:grid-cols-3">
                    <ResultBlock label="New monthly fee" value={results.newMonthly} />
                    <ResultBlock label="Monthly increase" value={results.difference} />
                    <ResultBlock label="Yearly impact" value={results.yearly} />
                </div>
            )}
        </div>
    );
}

function ResultBlock({ label, value }) {
    return (
        <div>
            <p className="text-xs uppercase tracking-wide text-[#001a4a]/60">{label}</p>
            <p className="mt-1 text-xl font-semibold">PKR {Number(value || 0).toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
        </div>
    );
}

ResultBlock.propTypes = {
    label: PropTypes.string.isRequired,
    value: PropTypes.number,
};

SchoolFeeIncreaseCalculator.propTypes = {
    post: PropTypes.object.isRequired,
    returnPath: PropTypes.string.isRequired,
};
