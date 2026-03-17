## ADDED Requirements

### Requirement: Employees Attendance Page Access

The system SHALL expose an Employees entry inside the dashboard shell that routes to a staff attendance overview fed by deterministic mock data (no backend calls yet).

#### Scenario: Employees nav entry

- **WHEN** an operator clicks "Employees" in the sidebar or CTA link
- **THEN** the UI SHALL navigate to `/dashboard/employees` and render the employees attendance experience with loading placeholders while mock data is prepared.

### Requirement: Employee Attendance List & Filters

The system SHALL list each staff member with role, current shift block, last biometric check-in, attendance streak/compliance badge, and provide search/filter controls for role and attendance status.

#### Scenario: Search staff roster

- **WHEN** the operator types a name or email query
- **THEN** the list SHALL filter client-side to the matching employees in real time.

#### Scenario: Attendance status filter

- **WHEN** the operator selects a status pill such as "On Track" or "Missed"
- **THEN** only staff with that compliance status SHALL remain visible until cleared.

### Requirement: Employee Detail Drawer

The system SHALL surface a detail drawer or modal that expands the selected employee record with biometric ID, shift calendar, recent attendance events, and disabled escalations (notify manager, mark excused).

#### Scenario: Drawer reveals attendance history

- **WHEN** the operator clicks an employee row/card
- **THEN** a drawer SHALL slide in showing photo/initials, role, biometric ID, streak, last three attendance logs, and placeholder actions in disabled state.

#### Scenario: Drawer dismissal

- **WHEN** the operator clicks the close control or presses Escape
- **THEN** the drawer SHALL dismiss and focus SHALL return to the prior list position.
