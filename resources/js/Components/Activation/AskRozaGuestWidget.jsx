import React from 'react';
import { Link, router, usePage } from '@inertiajs/react';

const starterQuestions = [
    'How to cut electricity bill by 5,000 PKR?',
    'Is Utility Store cheaper for my family size?',
    'What’s a realistic school fee budget for next year?',
];

export default function AskRozaGuestWidget({ sourceUrl = '/' }) {
    const { flash } = usePage().props;
    const [question, setQuestion] = React.useState('');
    const [isSubmitting, setIsSubmitting] = React.useState(false);
    const [response, setResponse] = React.useState(flash?.askRozaTip ?? null);

    React.useEffect(() => {
        if (flash?.askRozaTip) {
            setResponse(flash.askRozaTip);
        }
    }, [flash?.askRozaTip]);

    // ROZNAMCHA-ACTIVATION: guest-mode Ask Roza uses short answers + save-progress CTA.
    const submitQuestion = (value) => {
        const finalQuestion = (value ?? question).trim();
        if (!finalQuestion || isSubmitting) return;

        setIsSubmitting(true);

        router.post(
            route('guest.askRoza'),
            {
                question: finalQuestion,
                source_url: sourceUrl,
            },
            {
                preserveState: true,
                preserveScroll: true,
                onFinish: () => setIsSubmitting(false),
            }
        );
    };

    return (
        <section className="rounded-2xl border border-yellow-300/50 bg-[#001a4a] p-5 text-white shadow-xl sm:p-6">
            <p className="text-xs uppercase tracking-[0.3em] text-yellow-200">Guest Mode</p>
            <h2 className="mt-2 text-2xl font-semibold">Ask Roza</h2>

            <div className="mt-4 flex flex-col gap-3">
                <input
                    type="text"
                    value={question}
                    onChange={(event) => setQuestion(event.target.value)}
                    onKeyDown={(event) => {
                        if (event.key === 'Enter') {
                            event.preventDefault();
                            submitQuestion();
                        }
                    }}
                    placeholder="Ask Roza: How can I save 5,000 PKR on my electricity bill this month?"
                    className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-sm text-white placeholder:text-white/55 focus:border-yellow-300 focus:outline-none"
                />

                <button
                    type="button"
                    onClick={() => submitQuestion()}
                    disabled={isSubmitting}
                    className="inline-flex w-full items-center justify-center rounded-full bg-yellow-300 px-5 py-2.5 text-sm font-semibold text-[#001a4a] hover:bg-white disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto"
                >
                    {isSubmitting ? 'Thinking...' : 'Get quick tip'}
                </button>
            </div>

            <div className="mt-3 flex flex-wrap gap-2">
                {starterQuestions.map((chip) => (
                    <button
                        key={chip}
                        type="button"
                        onClick={() => {
                            setQuestion(chip);
                            submitQuestion(chip);
                        }}
                        className="rounded-full border border-white/25 bg-white/5 px-3 py-1.5 text-xs text-white/90 hover:bg-white/10"
                    >
                        {chip}
                    </button>
                ))}
            </div>

            {response ? (
                <div className="mt-4 space-y-3 rounded-xl border border-white/15 bg-white/10 p-4">
                    <p className="text-sm text-white/95">{response.tip_text}</p>

                    {(response.related_links ?? []).length > 0 ? (
                        <div className="space-y-1">
                            {(response.related_links ?? []).map((link) => (
                                <Link
                                    key={`${link.url}-${link.title}`}
                                    href={link.url}
                                    className="block text-sm font-semibold text-yellow-200 hover:text-white"
                                >
                                    {link.title}
                                </Link>
                            ))}
                        </div>
                    ) : null}

                    <div className="rounded-lg border border-yellow-200/50 bg-[#001432] px-3 py-3">
                        <p className="text-sm font-semibold text-yellow-100">Sign up to track this advice</p>
                        <p className="mt-1 text-xs text-yellow-100/80">Save it now. Compare your progress next month.</p>
                        <Link
                            href={route('register', { return_to: sourceUrl })}
                            className="mt-3 inline-flex items-center justify-center rounded-full bg-yellow-300 px-4 py-2 text-xs font-semibold text-[#001a4a] hover:bg-white"
                        >
                            Sign up to track this advice
                        </Link>
                    </div>
                </div>
            ) : null}
        </section>
    );
}
