## ADDED Requirements

### Requirement: Lockers Page Access

The system SHALL provide a Lockers page accessible via the dashboard app shell navigation that lists lockers and their current occupancy state using deterministic mock data.

#### Scenario: Lockers page loads

- **WHEN** a staff operator clicks "Lockers" in the sidebar
- **THEN** the UI SHALL navigate to `/dashboard/lockers` and render a lockers list with loading placeholders while mock data is prepared.

### Requirement: Occupancy State Model

The system SHALL represent each locker as either available or occupied for the current session, with occupancy bound to a member RFID card claim event and released on cashier logout.

#### Scenario: Member claims a locker via RFID tap

- **WHEN** a member taps their RFID card on a locker reader
- **THEN** the locker SHALL transition to occupied and record the member identity, RFID identifier, and claim timestamp for the session.

#### Scenario: Member releases locker at cashier logout

- **WHEN** the member taps their RFID card for logout at the cashier
- **THEN** any locker session claimed by that RFID identifier SHALL be released and the locker SHALL transition back to available.

### Requirement: Search & Filters

The system SHALL provide search and filters to locate lockers by number/zone and narrow by occupancy state.

#### Scenario: Search locker inventory

- **WHEN** the operator searches by locker number or zone
- **THEN** the list SHALL filter client-side to matching lockers in real time.

#### Scenario: Filter by occupied lockers

- **WHEN** the operator applies the "Occupied" filter
- **THEN** only occupied lockers SHALL remain visible until the filter is cleared.

### Requirement: Locker Detail Drawer

The system SHALL allow viewing a locker detail drawer/modal with session metadata and operational actions.

#### Scenario: Drawer shows locker session details

- **WHEN** the operator selects an occupied locker
- **THEN** a drawer SHALL display locker number, zone, occupancy status, member identity, RFID identifier, claim time, and session duration-to-date.

#### Scenario: Placeholder actions are present

- **WHEN** the operator views the locker drawer
- **THEN** the UI SHALL show disabled placeholder actions for force release and maintenance flagging.
