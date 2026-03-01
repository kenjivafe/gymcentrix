## 1. Research & UX

- [x] 1.1 Confirm Settings v1 scope: subscription types (name, duration, price), discounts (name, description, duration, price; "always" duration), feature toggles (lockers, employees, attendance, card designer).
- [x] 1.2 Confirm navigation: Settings link goes to `/dashboard/settings` and replaces the current placeholder.
- [x] 1.3 Decide behavior when a feature is disabled (e.g. hide nav item only vs hide and redirect).

## 2. Implementation

- [x] 2.1 Create `/dashboard/settings` route that renders the Settings experience inside `AppShell`.
- [x] 2.2 Update AppShell navigation so "Settings" has `href: /dashboard/settings`.
- [x] 2.3 Add mock data and types for subscription types and discounts (including "always" duration for discounts).
- [x] 2.4 Build Settings page: section for subscription types (list/edit with name, duration, price).
- [x] 2.5 Build Settings page: section for discounts (list/edit with name, description, duration, price; duration option "Always").
- [x] 2.6 Build Settings page: section for feature toggles (enable/disable Lockers, Employees, Attendance, Card Designer) and wire visibility in app shell or routing as agreed.
- [x] 2.7 Set page metadata (title/description) for the Settings route.

## 3. Validation & Docs

- [x] 3.1 Add a minimal test that the Settings route renders (or unit tests for settings helpers).
- [x] 3.2 Run lint/tests/build and `openspec validate add-settings-page --strict --no-interactive`.
