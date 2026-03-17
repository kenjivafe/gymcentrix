## 1. Research & UX

- [x] 1.1 Identify current dashboard sections to keep (KPIs, activity timeline, CTAs) and decide where analytics blocks fit.
- [x] 1.2 Define analytics mock dataset (time-series trend, category breakdowns, top segments) and the visual patterns to use.

## 2. Implementation

- [x] 2.1 Remove Quick Actions module from `src/app/dashboard/page.tsx`.
- [x] 2.2 Remove Card Designer module from `src/app/dashboard/page.tsx`.
- [x] 2.3 Add analytics components (charts/summary cards) using mock data (no backend calls).
- [x] 2.4 Ensure responsive layout and consistent loading/empty states as needed.

## 3. Validation & Docs

- [x] 3.1 Add unit tests for analytics data formatting utilities.
- [x] 3.2 Run lint/tests/build and `openspec validate update-dashboard-analytics --strict --no-interactive`.
