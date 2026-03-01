## ADDED Requirements

### Requirement: Attendance Page Access

The system SHALL provide an Attendance page accessible via the dashboard app shell navigation that renders a daily attendance overview using deterministic mock data.

#### Scenario: Attendance page loads

- **WHEN** an operator clicks "Attendance" in the sidebar
- **THEN** the UI SHALL navigate to `/dashboard/attendance` and render the attendance experience (summary and recent activity).

### Requirement: Today Summary and Recent Activity

The system SHALL display a today attendance summary (e.g. present count vs expected) and a list of recent check-in/check-out events.

#### Scenario: Summary shows deterministic counts

- **WHEN** the attendance page is visible
- **THEN** summary tiles SHALL show deterministic mock values for the day (e.g. present, expected) and the recent activity list SHALL show mock check-in/check-out events.

### Requirement: Biometric Check-In Placeholder

The system SHALL expose a disabled placeholder action for recording a biometric check-in until the backend is implemented.

#### Scenario: Record check-in is disabled

- **WHEN** the operator views the attendance page
- **THEN** the UI SHALL show a disabled "Record check-in" (or equivalent biometric) action with a clear hint that it is coming when the backend is ready.
