# Change: Settings page in dashboard

## Why

Gym owners need a single place to configure business rules and feature visibility: subscription types (name, duration, price), discounts (including an "always" duration option), and which dashboard modules (Lockers, Employees, Attendance, Card Designer) are enabled. Today the Settings sidebar entry has no route and there is no UI to manage these.

## What Changes

- Add a Settings page under the dashboard at `/dashboard/settings`.
- **Subscription types:** Allow operators to view and edit subscription types with name, duration, and price (UI-first with mock data; persistence when backend exists).
- **Discounts:** Allow operators to view and edit discounts with name, description, duration, and price. Support a discount duration option equivalent to "always" (e.g. no end date or perpetual).
- **Feature toggles:** Provide options in Settings to enable or disable each of: Lockers, Employees, Attendance, Card Designer. When disabled, the corresponding sidebar entry or feature SHALL be hidden or inaccessible as specified.
- Wire the existing "Settings" sidebar entry to the new page.

## Impact

- Affected specs: settings-page (new capability)
- Affected code: App shell navigation (Settings href, optional feature visibility from toggles), new `/dashboard/settings` route, Settings page and sub-sections (subscriptions, discounts, feature toggles), mock or persisted config for subscriptions, discounts, and feature flags.
