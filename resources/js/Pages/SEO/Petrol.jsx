// Purpose: Render petrol-price SEO pages with the shared living-page layout and petrol-specific visual treatment. Date: 2026-03-29. Author: Mohsin.

import React from 'react';
import SeoLandingPage from '../../Components/SEO/SeoLandingPage';

export default function Petrol(props) {
    return (
        <SeoLandingPage
            {...props}
            theme={{
                badgeClass: 'bg-amber-100 text-amber-900 border-amber-200',
                heroClass: 'from-white via-amber-50 to-orange-100',
                accentClass: 'text-amber-700',
                panelClass: 'bg-white border-slate-200',
            }}
        />
    );
}
