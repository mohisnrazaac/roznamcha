# Ration Cost Estimator Tool

## Summary
- Added a public Ration Cost Estimator tool at `/tools/ration-cost-estimator`.
- Uses configurable base prices (no live pricing API yet).
- Supports household size and monthly quantities for atta, rice, oil, sugar, and daal.
- Shows an estimated monthly total plus a placeholder comparison line.
- Includes a non-blocking “Save this” CTA to signup.

## Public Placement
- Added to the public navigation as “Tools”.
- Added a hero CTA and footer link on the home page.
- Added a public tool callout on the Features page.
- Added a blog index header CTA and sidebar card.
- Added the tool link to blog post tool CTAs.

## Implementation
- Controller: `app/Http/Controllers/PublicTools/RationCostEstimatorController.php`
- Inertia page: `resources/js/Pages/Public/Tools/RationCostEstimator.jsx`
- Layout: `resources/js/Layouts/ToolLayout.jsx`
- Route: `routes/web.php`
- Config: `config/ration_cost_estimator.php`

## Extension Points
- Inline comments mark where to swap config-based pricing for DB or API-driven prices.
- Household-size scaling can be applied to quantities in the UI when the model is ready.

## Commands Run
- `npm run build`
- `composer run test`
