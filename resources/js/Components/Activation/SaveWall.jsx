import React from 'react';
import { router } from '@inertiajs/react';

const jsonToBase64Url = (value) => {
    try {
        const json = JSON.stringify(value ?? {});
        const utf8 = encodeURIComponent(json).replace(/%([0-9A-F]{2})/g, (_, hex) => String.fromCharCode(parseInt(hex, 16)));
        const base64 = btoa(utf8);

        return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
    } catch {
        return '';
    }
};

const getCsrfToken = () => document.head.querySelector('meta[name="csrf-token"]')?.getAttribute('content') ?? '';

const resolveEndpoint = (value) => {
    if (!value) return '';
    if (value.startsWith('/')) return value;

    try {
        return route(value);
    } catch {
        return value;
    }
};

export default function SaveWall({ toolKey, inputs, results, isAuthenticated, saveEndpoint, returnUrl }) {
    const [isSaving, setIsSaving] = React.useState(false);
    const [saveMessage, setSaveMessage] = React.useState('');

    const endpoint = resolveEndpoint(saveEndpoint);

    // ROZNAMCHA-ACTIVATION: attach save CTA directly below results to force compare habit loop.
    const handleLoggedInSave = () => {
        if (!endpoint || isSaving) return;

        setIsSaving(true);
        setSaveMessage('');

        router.post(
            endpoint,
            {
                tool_key: toolKey,
                source: 'tool_save_wall',
                return_url: returnUrl,
                inputs,
                results,
            },
            {
                preserveState: true,
                preserveScroll: true,
                onSuccess: () => setSaveMessage('Saved. Come back next month to compare.'),
                onFinish: () => setIsSaving(false),
            }
        );
    };

    const handleGuestSave = async () => {
        if (isSaving) return;

        setIsSaving(true);
        setSaveMessage('');

        const statePayload = {
            tool_key: toolKey,
            source: 'tool_save_wall',
            inputs,
            results,
        };

        const encodedState = jsonToBase64Url(statePayload);
        let destination = returnUrl;

        if (encodedState && encodedState.length <= 850) {
            const params = new URLSearchParams();
            params.set('tool_key', toolKey);
            params.set('source', 'tool_save_wall');
            params.set('tool_state', encodedState);
            destination = `${returnUrl}${returnUrl.includes('?') ? '&' : '?'}${params.toString()}`;
        } else {
            try {
                const response = await fetch(route('guest.stash'), {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Accept: 'application/json',
                        'X-CSRF-TOKEN': getCsrfToken(),
                        'X-Requested-With': 'XMLHttpRequest',
                    },
                    credentials: 'same-origin',
                    body: JSON.stringify({
                        tool_key: toolKey,
                        state: statePayload,
                        return_url: returnUrl,
                    }),
                });

                const data = await response.json().catch(() => ({}));
                if (!response.ok || !data?.stash_id) {
                    throw new Error('Unable to preserve tool state.');
                }

                const params = new URLSearchParams();
                params.set('tool_key', toolKey);
                params.set('source', 'tool_save_wall');
                params.set('activation_stash', data.stash_id);
                destination = `${returnUrl}${returnUrl.includes('?') ? '&' : '?'}${params.toString()}`;
            } catch {
                setSaveMessage('Could not preserve this state. Please try again.');
                setIsSaving(false);
                return;
            }
        }

        router.visit(route('register', { return_to: destination }));
    };

    return (
        <section className="rounded-2xl border border-yellow-300/50 bg-[#001a4a] p-5 text-white shadow-lg">
            <p className="text-xl font-semibold">Want to see how this changes next month?</p>
            <p className="mt-1 text-sm text-white/85">We’ll save today’s numbers so you can compare later.</p>

            <button
                type="button"
                onClick={isAuthenticated ? handleLoggedInSave : handleGuestSave}
                disabled={isSaving}
                className="mt-4 inline-flex items-center justify-center rounded-full bg-yellow-300 px-5 py-2.5 text-sm font-semibold text-[#001a4a] hover:bg-white disabled:cursor-not-allowed disabled:opacity-70"
            >
                {isSaving ? 'Saving...' : 'Save this for my household.'}
            </button>

            <p className="mt-2 text-xs text-white/75">No spam. Just your own data, remembered.</p>
            {saveMessage ? <p className="mt-2 text-sm text-emerald-200">{saveMessage}</p> : null}
        </section>
    );
}
