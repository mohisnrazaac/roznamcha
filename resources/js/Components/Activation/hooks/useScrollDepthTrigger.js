import React from 'react';

export default function useScrollDepthTrigger(threshold = 0.7) {
    const [isTriggered, setIsTriggered] = React.useState(false);

    React.useEffect(() => {
        if (isTriggered) {
            return undefined;
        }

        const onScroll = () => {
            const doc = document.documentElement;
            const maxScrollable = Math.max(1, doc.scrollHeight - window.innerHeight);
            const depth = window.scrollY / maxScrollable;

            if (depth >= threshold) {
                setIsTriggered(true);
            }
        };

        onScroll();
        window.addEventListener('scroll', onScroll, { passive: true });
        window.addEventListener('resize', onScroll);

        return () => {
            window.removeEventListener('scroll', onScroll);
            window.removeEventListener('resize', onScroll);
        };
    }, [isTriggered, threshold]);

    return isTriggered;
}
