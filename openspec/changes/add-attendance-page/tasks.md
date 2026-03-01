## 1. Research & UX

- [x] 1.1 Confirm Attendance page v1 scope: today summary, recent activity list, disabled biometric check-in placeholder.
- [x] 1.2 Confirm navigation: Attendance link goes to `/dashboard/attendance` and replaces the current placeholder.

## 2. Implementation

- [x] 2.1 Create `/dashboard/attendance` route that renders the Attendance experience inside `AppShell`.
- [x] 2.2 Update AppShell navigation so "Attendance" has `href: /dashboard/attendance`.
- [x] 2.3 Add mock data for today's attendance summary and recent check-in/check-out events.
- [x] 2.4 Build Attendance page: summary tiles (present/expected), recent activity list, disabled "Record check-in" (biometric) action.
- [x] 2.5 Set page metadata (title/description) for the Attendance route.

## 3. Validation & Docs

- [x] 3.1 Add a minimal test that the Attendance route renders (or unit tests for new utilities).
- [x] 3.2 Run lint/tests/build and `openspec validate add-attendance-page --strict --no-interactive`.
