## ADDED Requirements

### Requirement: Collapsible Sidebar on Mobile

On mobile viewports (below the `lg` breakpoint), the dashboard app shell sidebar SHALL be collapsible. The sidebar SHALL be hidden or collapsed by default, and a toggle control (e.g. hamburger menu) SHALL allow the user to open and close it.

#### Scenario: Sidebar hidden by default on mobile

- **WHEN** an operator views a dashboard page on a mobile viewport (width below `lg`)
- **THEN** the sidebar SHALL be hidden or collapsed by default, and the main content SHALL occupy the full viewport width.

#### Scenario: Toggle opens sidebar on mobile

- **WHEN** the operator taps the sidebar toggle (e.g. hamburger) on mobile
- **THEN** the sidebar SHALL open (e.g. as overlay or slide-out drawer) and display all navigation entries.

#### Scenario: Toggle closes sidebar on mobile

- **WHEN** the operator taps the toggle again or dismisses the sidebar (e.g. tap outside, ESC)
- **THEN** the sidebar SHALL close and the main content SHALL be visible again.

### Requirement: Sidebar Always Visible on Desktop

On desktop viewports (lg and above), the sidebar SHALL remain always visible and SHALL NOT be collapsible. The toggle control SHALL NOT be shown on desktop.

#### Scenario: Desktop layout unchanged

- **WHEN** an operator views a dashboard page on a desktop viewport (width at or above `lg`)
- **THEN** the sidebar SHALL be visible at all times and SHALL NOT display a collapse/hamburger toggle.
