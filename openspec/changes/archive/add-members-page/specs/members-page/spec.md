## ADDED Requirements

### Requirement: Members List View

The system SHALL provide a members page accessible via the app shell navigation that lists member profiles with key metadata (photo/initials, tier, status, last check-in).

#### Scenario: Members page loads

- **WHEN** a stakeholder clicks "Members" in the sidebar
- **THEN** the UI SHALL display a responsive list/grid of members using deterministic mock data, without backend calls.

#### Scenario: Loading & empty states

- **WHEN** member data is being fetched or filters yield zero results
- **THEN** the page SHALL show the shared loading placeholders or empty state messaging.

### Requirement: Search & Filter Controls

The system SHALL include search and filter controls to help users quickly find members by name/email and narrow by status/tier.

#### Scenario: Search narrows results

- **WHEN** the user types a query into the search input
- **THEN** the members list SHALL filter client-side to matching names or emails in real time.

#### Scenario: Filter pills

- **WHEN** the user applies a status or tier filter
- **THEN** the list SHALL update accordingly and show a clear indicator of the active filters, with ability to clear.

### Requirement: Member Detail Drawer

The system SHALL allow viewing expanded member details via a drawer/modal containing profile info, RFID card metadata, attendance streaks, and action buttons.

#### Scenario: Drawer opens with details

- **WHEN** the user selects a member from the list
- **THEN** a drawer SHALL slide in showing member photo/initials, contact info, membership tier, RFID card number, attendance history snippet, and placeholder actions (freeze membership, resend card) in disabled state.

#### Scenario: Drawer closes

- **WHEN** the user clicks the close button or backdrop
- **THEN** the drawer SHALL dismiss and the members list remains in its previous scroll position.
