## ADDED Requirements

### Requirement: Settings Page Access

The system SHALL provide a Settings page accessible via the dashboard app shell navigation that renders configuration for subscription types, discounts, and feature toggles.

#### Scenario: Settings page loads

- **WHEN** an operator clicks "Settings" in the sidebar
- **THEN** the UI SHALL navigate to `/dashboard/settings` and render the Settings experience with sections for subscriptions, discounts, and feature toggles.

### Requirement: Subscription Types Management

The system SHALL allow operators to view and edit subscription types. Each subscription type SHALL have name, duration, and price.

#### Scenario: Subscription list displays name duration and price

- **WHEN** the operator opens the Settings page and views the subscription types section
- **THEN** the UI SHALL list each subscription type with its name, duration, and price.

#### Scenario: Operator edits a subscription type

- **WHEN** the operator changes the name, duration, or price of a subscription type and confirms (e.g. save)
- **THEN** the UI SHALL update the displayed subscription type accordingly (persistence behavior SHALL follow backend availability; until then, UI-first or local mock state is acceptable).

### Requirement: Discounts Management

The system SHALL allow operators to view and edit discounts. Each discount SHALL have name, description, duration, and price. The system SHALL support a discount duration option meaning "always" (e.g. no end date or perpetual).

#### Scenario: Discount list displays name description duration and price

- **WHEN** the operator opens the Settings page and views the discounts section
- **THEN** the UI SHALL list each discount with its name, description, duration, and price.

#### Scenario: Discount duration can be Always

- **WHEN** the operator creates or edits a discount
- **THEN** the UI SHALL offer a duration option equivalent to "Always" (e.g. always valid or no expiry), in addition to any time-bound duration options.

#### Scenario: Operator edits a discount

- **WHEN** the operator changes the name, description, duration, or price of a discount and confirms
- **THEN** the UI SHALL update the displayed discount accordingly (persistence as for subscription types).

### Requirement: Feature Toggles for Dashboard Modules

The system SHALL provide in Settings options to enable or disable each of: Lockers, Employees, Attendance, and Card Designer. When a module is disabled, the system SHALL hide or otherwise make inaccessible the corresponding dashboard feature (e.g. sidebar entry) as defined by the implementation.

#### Scenario: Toggles control Lockers Employees Attendance and Card Designer

- **WHEN** the operator opens the Settings page and views the feature toggles section
- **THEN** the UI SHALL show an option to enable or disable each of Lockers, Employees, Attendance, and Card Designer.

#### Scenario: Disabling a module hides or disables its access

- **WHEN** the operator disables one of Lockers, Employees, Attendance, or Card Designer
- **THEN** the corresponding sidebar entry or feature SHALL be hidden or inaccessible until re-enabled (implementation may use nav visibility, routing, or feature flags).
