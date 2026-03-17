## ADDED Requirements

### Requirement: Responsive UI Shell

The system SHALL provide a responsive layout shell with persistent navigation that adapts between desktop and mobile breakpoints using purely client-side state and mock data sources.

#### Scenario: Desktop layout renders

- **WHEN** the UI shell loads on a viewport wider than 1024px
- **THEN** the header, sidebar, and main content region SHALL render simultaneously without backend requests.

#### Scenario: Mobile layout renders

- **WHEN** the viewport width is below 1024px
- **THEN** the sidebar SHALL collapse into a toggleable drawer while retaining access to all navigation entries.

### Requirement: Dashboard Mock Data Widgets

The system SHALL expose dashboard widgets for membership KPIs, recent activity, and quick actions powered entirely by deterministic mock data providers.

#### Scenario: KPIs display mock values

- **WHEN** the dashboard loads
- **THEN** KPI tiles SHALL show predefined totals for members, active cards, and attendance without external API calls.

#### Scenario: Recent activity timeline renders

- **WHEN** the dashboard loads
- **THEN** the recent activity list SHALL display at least five timestamped entries sourced from mock data.

### Requirement: Membership Card Designer Preview

The system SHALL include a membership card designer interface that allows editing member metadata, brand colors, and placement, showing live previews while disabling persistence actions.

#### Scenario: Live preview updates

- **WHEN** the user changes text or color inputs in the designer
- **THEN** the preview card SHALL update immediately in the UI without saving any backend record.

#### Scenario: Save actions disabled

- **WHEN** the user attempts to save or publish a card
- **THEN** the UI SHALL show a disabled state explaining that backend services are not yet connected.

### Requirement: UI State Handling Without Backend

The system SHALL define reusable components for loading, empty, and disabled states to communicate backend unavailability while keeping the interface consistent.

#### Scenario: Loading placeholders

- **WHEN** mock data is being resolved (e.g., simulated latency)
- **THEN** skeleton placeholders SHALL display in each dashboard widget until data appears.

#### Scenario: Empty state messaging

- **WHEN** a mock data provider intentionally returns no records
- **THEN** the UI SHALL show an empty state illustration with guidance on what data will appear once services are wired.
