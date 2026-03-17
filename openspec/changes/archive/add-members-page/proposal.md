# Change: Add Members Page with search & detail drawer

## Why

The dashboard preview currently teases a "Members" nav item but there is no dedicated surface to review member profiles. Stakeholders need a mock experience to browse, search, and inspect members before backend services are ready. Delivering a Members page also de-risks future integration work by defining the layout and data contract upfront.

## What Changes

- Create a `/dashboard/members` (or `/members`) route inside the UI shell that lists member cards/rows using deterministic mock data.
- Provide quick filters (status, tier) and a fuzzy search bar for name/email lookups.
- Add a member detail drawer/modal showcasing profile info, RFID card metadata, attendance streaks, and action buttons (freeze, resend card) in disabled/mock state.
- Reuse UI-state components (loading/empty) and ensure layout is responsive across desktop and tablet.

## Impact

- Affected specs: new `members-page` capability; update navigation requirements to include link.
- Affected code: App shell navigation, mock data providers, Members page components, filtering logic, modal/drawer UI, documentation.
