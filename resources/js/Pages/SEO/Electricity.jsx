// Purpose: Render electricity-calculator SEO pages with the shared living-page layout and high-retention interactive calculator suite. Date: 2026-09-10. Author: Principal Full-Stack Engineer & UX Specialist.

import React from 'react';
import SeoLandingPage from '../../Components/SEO/SeoLandingPage';
import ElectricityCalculatorSuite from '../../Components/Calculators/ElectricityCalculatorSuite';

export default function Electricity(props) {
    const discoKey = (props.pageKey || 'lesco').toLowerCase();

    return (
        <SeoLandingPage
            {...props}
            theme={{
                badgeClass: 'bg-sky-100 text-sky-900 border-sky-200',
                heroClass: 'from-white via-sky-50 to-cyan-100',
                accentClass: 'text-sky-700',
                panelClass: 'bg-white border-slate-200',
            }}
            interactiveWidget={
                <ElectricityCalculatorSuite
                    initialDisco={discoKey}
                    initialUnits={204}
                    showDiscoSelector={true}
                />
            }
        />
    );
}
