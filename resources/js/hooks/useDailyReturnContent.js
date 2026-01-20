import { useEffect, useState } from 'react';

let cachedPayload = null;
let inflightPromise = null;

// Shared client hook that fetches and caches the DailyReturn API so multiple widgets reuse identical data.
export function useDailyReturnContent() {
    const [state, setState] = useState({
        data: cachedPayload,
        loading: !cachedPayload,
        error: null,
    });

    useEffect(() => {
        if (cachedPayload) {
            return;
        }

        let mounted = true;

        const resolveEndpoint = () => {
            if (typeof route === 'function') {
                try {
                    return route('daily-return.snapshot');
                } catch (error) {
                    // Swallow because Ziggy throws if not booted yet.
                }
            }

            return '/daily-return/snapshot';
        };

        const fetchPayload = async () => {
            try {
                if (!inflightPromise) {
                    inflightPromise = fetch(resolveEndpoint(), {
                        method: 'GET',
                        headers: {
                            Accept: 'application/json',
                        },
                        credentials: 'same-origin',
                    })
                        .then((response) => {
                            if (!response.ok) {
                                throw new Error('Failed to load daily snapshot.');
                            }
                            return response.json();
                        })
                        .then((json) => json.data ?? json)
                        .finally(() => {
                            inflightPromise = null;
                        });
                }

                const payload = await inflightPromise;
                cachedPayload = payload;

                if (mounted) {
                    setState({ data: payload, loading: false, error: null });
                }
            } catch (error) {
                if (mounted) {
                    setState({
                        data: null,
                        loading: false,
                        error: error.message ?? 'Unable to load daily snapshot.',
                    });
                }
            }
        };

        fetchPayload();

        return () => {
            mounted = false;
        };
    }, []);

    return state;
}
