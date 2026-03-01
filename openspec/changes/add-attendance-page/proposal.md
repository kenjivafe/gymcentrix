# Change: Attendance page in dashboard

## Why

Operators need a dedicated daily attendance view—who is checked in today, recent check-in/check-out events, and a clear place for future biometric check-in—separate from the staff roster on the Employees page. The sidebar already has an "Attendance" entry with no route; this change gives it a page and a UI-first experience until the biometric backend is wired.

## What Changes

- Add an Attendance page under the dashboard at `/dashboard/attendance`.
- Show a today summary (e.g. present count vs expected) and a recent activity list (check-in/check-out events) using deterministic mock data.
- Provide a disabled placeholder action for recording a biometric check-in until the backend exists.
- Wire the existing "Attendance" sidebar entry to the new page.

## Impact

- Affected specs: attendance-page (new capability)
- Affected code: App shell navigation, new `/dashboard/attendance` route, attendance page component and mock data (e.g. today summary and activity log).
