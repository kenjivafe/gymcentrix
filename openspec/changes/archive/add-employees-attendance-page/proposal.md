# Change: Employees attendance page in dashboard

## Why

Gym leadership also needs visibility into staff operations. Today the dashboard only surfaces member-centric metrics, leaving no UI to review employee attendance compliance or identify missed shifts. A preview page with mock data keeps parity with other UI-first flows until the biometric backend is wired.

## What Changes

- Add a dashboard-accessible Employees page dedicated to staff attendance tracking.
- Display deterministic mock employee roster data (role, shift block, last check-in, attendance streak/compliance tags).
- Provide search + filters (role, attendance status) similar to the members view for quick triage.
- Include a detail drawer/modal that surfaces richer attendance history, biometric ID, and placeholder actions (e.g., notify manager) in disabled state.
- Link the dashboard hero CTA + sidebar navigation to the Employees page so preview builds stay discoverable.

## Impact

- Affected specs: employees-page (new capability)
- Affected code: App shell navigation, dashboard CTA section, new employees page route, shared mock data/utilities for staff attendance.
