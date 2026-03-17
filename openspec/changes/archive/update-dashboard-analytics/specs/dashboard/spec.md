## MODIFIED Requirements

### Requirement: Dashboard Overview Layout

The system SHALL provide a dashboard overview at `/dashboard` that surfaces operational KPIs and analytics using deterministic mock data, without backend calls.

#### Scenario: Dashboard loads analytics-forward modules

- **WHEN** a stakeholder navigates to `/dashboard`
- **THEN** the dashboard SHALL render KPI tiles and an Analytics section (trends + breakdowns) alongside existing contextual modules (e.g., activity timeline), using mock data.

#### Scenario: Quick actions are removed

- **WHEN** a stakeholder views the dashboard modules
- **THEN** the Quick Actions module SHALL NOT be present on `/dashboard`.

#### Scenario: Card designer is removed

- **WHEN** a stakeholder views the dashboard modules
- **THEN** the Membership Card Designer module SHALL NOT be present on `/dashboard` and SHALL be deferred to a future dedicated page.
