# Change: Refresh dashboard with analytics focus

## Why

The current dashboard preview includes UI blocks that are not part of the immediate operational cockpit (Quick Actions and the Membership Card Designer). Stakeholders need a more analytics-forward overview that communicates performance at a glance and leaves tool-specific workflows (e.g., card designer) to dedicated pages.

## What Changes

- Remove the Quick Actions module from `/dashboard`.
- Remove the Membership Card Designer module from `/dashboard` (it will move to a dedicated page in a future change).
- Introduce an Analytics section on `/dashboard` driven by deterministic mock data, including at-a-glance trends and breakdowns.
- Keep the overall dashboard shell/navigation intact and maintain UI-first behavior (no backend calls).

## Impact

- Affected specs: dashboard (new/updated capability delta)
- Affected code: `src/app/dashboard/page.tsx`, any dashboard analytics components + mock data utilities.
