// Purpose: Render electricity-calculator SEO pages with the shared living-page layout and utility-focused visual treatment. Date: 2026-03-29. Author: Mohsin.

import React from 'react';
import SeoLandingPage from '../../Components/SEO/SeoLandingPage';

export default function Electricity(props) {
    return (
        <SeoLandingPage
            {...props}
            theme={{
                badgeClass: 'bg-sky-100 text-sky-900 border-sky-200',
                heroClass: 'from-white via-sky-50 to-cyan-100',
                accentClass: 'text-sky-700',
                panelClass: 'bg-white border-slate-200',
            }}
        />
    );
}
