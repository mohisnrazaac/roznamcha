// Purpose: Render ration-cost SEO pages with the shared living-page layout and household-budget visual treatment. Date: 2026-03-29. Author: Mohsin.

import React from 'react';
import SeoLandingPage from '../../Components/SEO/SeoLandingPage';

export default function Ration(props) {
    return (
        <SeoLandingPage
            {...props}
            theme={{
                badgeClass: 'bg-emerald-100 text-emerald-900 border-emerald-200',
                heroClass: 'from-white via-emerald-50 to-lime-100',
                accentClass: 'text-emerald-700',
                panelClass: 'bg-white border-slate-200',
            }}
        />
    );
}
