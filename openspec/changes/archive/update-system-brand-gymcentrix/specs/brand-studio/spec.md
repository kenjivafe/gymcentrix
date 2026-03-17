## ADDED Requirements

### Requirement: System Name and Gym Name in Brand Studio

The system SHALL allow stakeholders to configure in Brand Studio a system name (product name, default "Gymcentrix") and a gym name (tenant or business name). These SHALL be editable alongside logo, primary color, and secondary color.

#### Scenario: System name and gym name are editable

- **WHEN** the user opens Brand Studio
- **THEN** the UI SHALL show inputs for system name and gym name in addition to logo and colors, with the system name defaulting to "Gymcentrix".

#### Scenario: Brand changes apply across the app

- **WHEN** the user changes system name, gym name, logo, or colors in Brand Studio
- **THEN** the admin panel and other consumers of brand data SHALL reflect those values (e.g. app shell updates so that system name and gym name are visible as configured).

### Requirement: Admin Panel Displays System Name and Gym Name

The admin panel (dashboard app shell) SHALL display the system name as the main heading in the sidebar and the gym name directly below it.

#### Scenario: Sidebar shows system name then gym name

- **WHEN** an operator views any dashboard page
- **THEN** the sidebar SHALL show the configured system name (e.g. "Gymcentrix") as the primary heading and the gym name on the line below (e.g. "Elevate Lifestyle & Fitness" or the configured gym name).

#### Scenario: Brand Studio drives sidebar branding

- **WHEN** the operator changes the system name or gym name in Brand Studio
- **THEN** the dashboard sidebar SHALL update to show the new system name and gym name without requiring a full page reload (e.g. via shared brand context or state).

## MODIFIED Requirements

### Requirement: Brand Identity Editor (UI-First)

The system SHALL allow stakeholders to configure brand identity elements: system name (product name), gym name (business name), logo, primary color, secondary color, and optional typography. Changes SHALL be previewed in real time and SHALL drive the admin panel and other surfaces that consume brand data. Backend persistence MAY remain disabled; in-session or client-side storage is acceptable for the preview.

#### Scenario: Live preview updates

- **WHEN** the user changes a brand setting (e.g. system name, gym name, primary color, or logo)
- **THEN** the preview and any consumer (e.g. app shell) SHALL update immediately in the UI.

#### Scenario: Save remains disabled

- **WHEN** the user attempts to save or publish brand settings
- **THEN** the UI SHALL present save/publish actions in a disabled state until backend storage is implemented (brand may still apply in-session via context or local state).
