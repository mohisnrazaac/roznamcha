<!-- Purpose: Document homepage growth updates and smoke tests. Date: 2026-01-28. Author: Codex. -->
# Growth & Conversion Phase 1

## What Changed
- Added persistent Sign up/Login CTAs in the public header plus responsive mobile nav.
- Reworked the homepage hero, trust strips, demo placeholder, and social proof sections to push signups earlier.
- Created the `/features` route, controller action, and React page covering all six core modules.
- Injected Organization + WebSite JSON-LD via the public layout, added the ROZNAMCHA_YOUTUBE_DEMO_URL config, and documented growth scope here.

## How to Test
1. Load the homepage as a guest; confirm hero CTAs, trust copy, demo placeholder, and AI banner alignment.
2. Toggle the `ROZNAMCHA_YOUTUBE_DEMO_URL` env (e.g., run `php artisan serve` with it set) to switch the demo placeholder between iframe/placeholder.
3. Visit `/features` and scroll through each module card, ensuring CTAs hit `/register`.
4. Authenticate, reload the homepage, and verify the header swaps to Open App/Logout buttons without layout breaks.

## Screens to Verify
- Homepage hero + trust strip
- Homepage demo section + social proof
- Features page (desktop + mobile sticky CTA)
- Public header on all marketing routes

## Smoke Test Checklist
- [ ] Guest sees Sign up + Login in header
- [ ] Auth user sees Dashboard/Open App
- [ ] /register works
- [ ] /features loads
- [ ] Homepage loads fast, no console errors
- [ ] Demo placeholder renders when env is empty
- [ ] If ROZNAMCHA_YOUTUBE_DEMO_URL is set, iframe renders
