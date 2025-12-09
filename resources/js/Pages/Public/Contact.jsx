import React, { useEffect } from 'react';
import { Link, useForm, usePage } from '@inertiajs/react';
import PublicLayout from '../../Layouts/PublicLayout';
import SeoHead from '../../Components/SeoHead';
import { seoContent, buildWebPageSchema } from '../../lib/seo';

const contactReasons = [
    'Trouble entering expenses inside Kharcha Map',
    'Questions about tracking grocery prices in Ration Brain',
    'Ideas for new Survival Report insights or reminders',
    'Bug reports, billing issues, or suspected data problems',
    'Partnerships with NGOs, community groups, or media',
];

export default function Contact() {
    const { props } = usePage();
    const { formTimestamp, flash = {} } = props;
    const seo = seoContent.contact;
    const jsonLd = buildWebPageSchema(seo);

    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        subject: '',
        message: '',
        website: '',
        timestamp: formTimestamp ?? '',
    });

    useEffect(() => {
        setData('timestamp', formTimestamp ?? '');
    }, [formTimestamp]);

    const submit = (event) => {
        event.preventDefault();
        post(route('public.contact.send'), {
            onSuccess: () => {
                reset('subject', 'message');
                setData('website', '');
            },
        });
    };

    return (
        <PublicLayout variant="inner">
            <SeoHead {...seo} jsonLd={jsonLd} />

            <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-8">
                <header className="space-y-2 text-center">
                    <h1 className="text-3xl font-bold text-[#001a4a]">Contact Roznamcha</h1>
                    <p className="text-base text-slate-700">
                        Reach us for support, feedback, partnerships, or any ideas that make Kharcha Map, Ration Brain, and the Survival Report more
                        useful for Pakistani households.
                    </p>
                </header>

                {flash?.status && (
                    <div className="rounded-xl border border-emerald-300 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
                        {flash.status}
                    </div>
                )}

                <form onSubmit={submit} className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 space-y-5">
                    <Field
                        label="Full name"
                        name="name"
                        type="text"
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                        error={errors.name}
                    />
                    <Field
                        label="Email"
                        name="email"
                        type="email"
                        value={data.email}
                        onChange={(e) => setData('email', e.target.value)}
                        error={errors.email}
                    />
                    <Field
                        label="Subject"
                        name="subject"
                        type="text"
                        value={data.subject}
                        onChange={(e) => setData('subject', e.target.value)}
                        error={errors.subject}
                    />
                    <div className="space-y-2">
                        <label htmlFor="message" className="text-sm font-medium text-slate-700">
                            Message
                        </label>
                        <textarea
                            id="message"
                            rows="5"
                            className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-slate-900 shadow-sm focus:border-[#001a4a] focus:outline-none focus:ring-2 focus:ring-[#001a4a]/30"
                            placeholder="Share your request or feedback"
                            value={data.message}
                            onChange={(e) => setData('message', e.target.value)}
                        />
                        {errors.message && <p className="text-sm text-red-600">{errors.message}</p>}
                    </div>

                    <input
                        type="text"
                        name="website"
                        value={data.website}
                        onChange={(e) => setData('website', e.target.value)}
                        className="hidden"
                        autoComplete="off"
                        tabIndex="-1"
                    />
                    <input type="hidden" name="timestamp" value={data.timestamp} />

                    <button
                        type="submit"
                        className="w-full rounded-lg bg-[#001a4a] px-4 py-3 text-sm font-semibold text-yellow-300 shadow hover:bg-[#112e66]"
                        disabled={processing}
                    >
                        {processing ? 'Sending…' : 'Send message'}
                    </button>
                </form>

                <section className="bg-white border border-slate-200 rounded-2xl p-6 space-y-3 text-left">
                    <h2 className="text-xl font-semibold text-[#001a4a]">How to reach us</h2>
                    <p className="text-base text-slate-700">
                        Email{' '}
                        <a href="mailto:support@roznamcha.pk" className="text-[#001a4a] font-semibold">
                            support@roznamcha.pk
                        </a>{' '}
                        for direct help. The same team reads the in-app contact form, so feel free to use whichever is easier. WhatsApp and social
                        support will arrive later once we can guarantee timely responses there as well.
                    </p>
                </section>

                <section className="bg-white border border-slate-200 rounded-2xl p-6 space-y-3 text-left">
                    <h2 className="text-xl font-semibold text-[#001a4a]">When to contact us</h2>
                    <ul className="list-disc pl-5 space-y-1 text-slate-700">
                        {contactReasons.map((item) => (
                            <li key={item}>{item}</li>
                        ))}
                    </ul>
                </section>

                <section className="bg-white border border-slate-200 rounded-2xl p-6 space-y-3 text-left">
                    <h2 className="text-xl font-semibold text-[#001a4a]">Response time and privacy</h2>
                    <p className="text-base text-slate-700">
                        We reply within two working days, often sooner. Your email, phone, or message content stays private and is used only to solve
                        your request. We do not share support conversations with third parties.
                    </p>
                </section>

                <div className="text-sm text-slate-600 text-center space-y-2">
                    <p>
                        Need product details first? Visit the{' '}
                        <Link href={route('public.home')} className="font-semibold text-[#001a4a] hover:underline">
                            Home
                        </Link>{' '}
                        page or explore{' '}
                        <Link href={route('public.kharcha-map')} className="font-semibold text-[#001a4a] hover:underline">
                            Kharcha Map
                        </Link>
                        ,{' '}
                        <Link href={route('public.ration-brain')} className="font-semibold text-[#001a4a] hover:underline">
                            Ration Brain
                        </Link>{' '}
                        and{' '}
                        <Link href={route('public.survival-report')} className="font-semibold text-[#001a4a] hover:underline">
                            Survival Report
                        </Link>
                        . Learn more about the story on the{' '}
                        <Link href={route('public.about')} className="font-semibold text-[#001a4a] hover:underline">
                            About
                        </Link>{' '}
                        page.
                    </p>
                </div>
            </section>
        </PublicLayout>
    );
}

function Field({ label, name, type = 'text', value, onChange, error }) {
    return (
        <div className="space-y-2">
            <label htmlFor={name} className="text-sm font-medium text-slate-700">
                {label}
            </label>
            <input
                id={name}
                name={name}
                type={type}
                className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-slate-900 shadow-sm focus:border-[#001a4a] focus:outline-none focus:ring-2 focus:ring-[#001a4a]/30"
                value={value}
                onChange={onChange}
                placeholder={label}
            />
            {error && <p className="text-sm text-red-600">{error}</p>}
        </div>
    );
}
