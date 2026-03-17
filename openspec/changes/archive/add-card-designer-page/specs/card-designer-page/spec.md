## ADDED Requirements

### Requirement: Card Designer Page Access

The system SHALL provide a Card Designer page accessible via the dashboard app shell navigation that renders a membership card template editor using deterministic mock data.

#### Scenario: Card designer page loads

- **WHEN** a stakeholder clicks "Card Designer" in the sidebar
- **THEN** the UI SHALL navigate to `/dashboard/card-designer` and render the card designer experience.

### Requirement: UI-First Template Editing

The system SHALL allow stakeholders to adjust card template fields (member name, tier, colors, avatar seed) and preview the resulting card in real time, without backend persistence.

#### Scenario: Live preview updates

- **WHEN** the user changes a template field
- **THEN** the card preview SHALL update immediately in the UI.

#### Scenario: Save remains disabled

- **WHEN** the user attempts to save the template
- **THEN** the UI SHALL present the save action in a disabled state until backend storage is implemented.
