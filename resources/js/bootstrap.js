import axios from 'axios';

window.axios = axios;
window.axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

let csrfTokenPromise = null;

export function fetchCsrfToken() {
    if (typeof window === 'undefined') {
        return Promise.resolve('');
    }

    if (!csrfTokenPromise) {
        csrfTokenPromise = fetch('/csrf-token', {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'X-Requested-With': 'XMLHttpRequest',
            },
            credentials: 'same-origin',
        })
            .then((res) => {
                if (!res.ok) {
                    throw new Error(`Failed to fetch CSRF token: ${res.status}`);
                }
                return res.json();
            })
            .then((data) => {
                const token = data?.csrf_token;
                if (token) {
                    let meta = document.querySelector('meta[name="csrf-token"]');
                    if (!meta) {
                        meta = document.createElement('meta');
                        meta.setAttribute('name', 'csrf-token');
                        document.head.appendChild(meta);
                    }
                    meta.setAttribute('content', token);

                    if (window.axios) {
                        window.axios.defaults.headers.common['X-CSRF-TOKEN'] = token;
                    }
                    window.csrfToken = token;

                    document.querySelectorAll('input[name="_token"]').forEach((input) => {
                        input.value = token;
                    });

                    return token;
                }
                return '';
            })
            .catch((err) => {
                console.warn('[CSRF] Error refreshing CSRF token:', err);
                csrfTokenPromise = null;
                return '';
            });
    }

    return csrfTokenPromise;
}

export async function ensureCsrfToken() {
    if (typeof document === 'undefined') {
        return '';
    }

    const meta = document.querySelector('meta[name="csrf-token"]');
    const existing = meta?.getAttribute('content');
    if (existing && existing.trim().length > 0) {
        return existing;
    }

    return await fetchCsrfToken();
}

window.getCsrfToken = ensureCsrfToken;

// Axios request interceptor: ensure CSRF token is present on all state-mutating requests
axios.interceptors.request.use(async (config) => {
    const method = (config.method || 'get').toUpperCase();
    if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(method)) {
        const token = await ensureCsrfToken();
        if (token) {
            config.headers = config.headers || {};
            config.headers['X-CSRF-TOKEN'] = token;
        }
    }
    return config;
});

// Axios response interceptor: auto-recover from 419 token expiration
axios.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        if (error.response && error.response.status === 419 && originalRequest && !originalRequest._retry) {
            originalRequest._retry = true;
            csrfTokenPromise = null;
            const freshToken = await fetchCsrfToken();
            if (freshToken) {
                originalRequest.headers = originalRequest.headers || {};
                originalRequest.headers['X-CSRF-TOKEN'] = freshToken;
                return axios(originalRequest);
            }
        }
        return Promise.reject(error);
    }
);

// Auto-hydrate on page boot if CSRF meta tag is not rendered
if (typeof window !== 'undefined') {
    const existingToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
    if (existingToken && existingToken.trim().length > 0) {
        window.axios.defaults.headers.common['X-CSRF-TOKEN'] = existingToken;
        window.csrfToken = existingToken;
    } else {
        fetchCsrfToken();
    }
}

export default {
    fetchCsrfToken,
    ensureCsrfToken,
};
