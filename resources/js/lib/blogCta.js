export async function triggerBlogCta({ postId, slug, returnTo, ctaRoute = 'register', prefill = null }) {
    const csrfToken = document.head.querySelector('meta[name="csrf-token"]')?.getAttribute('content');

    const payload = {
        post_id: postId,
        slug,
        return_to: returnTo,
        cta_route: ctaRoute,
    };

    if (prefill) {
        payload.prefill = prefill;
    }

    try {
        const response = await fetch(route('events.blog-cta-click'), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': csrfToken ?? '',
                Accept: 'application/json',
            },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            throw new Error('CTA request failed');
        }

        const data = await response.json();

        if (data?.redirect) {
            window.location.href = data.redirect;
            return;
        }
    } catch (error) {
        console.error('CTA redirect failed', error);
    }

    const fallback = route(ctaRoute, { return_to: '/onboarding' });
    window.location.href = fallback;
}
