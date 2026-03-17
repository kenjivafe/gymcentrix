## ADDED Requirements

### Requirement: Elevate Lifestyle & Fitness Landing Page

The system SHALL provide a branded marketing landing page at `/` that highlights Elevate Lifestyle & Fitness offerings and directs visitors to key actions.

#### Scenario: Hero content renders on desktop and mobile

- **WHEN** a visitor loads `/` on any viewport
- **THEN** the hero section SHALL display brand messaging, a background visual, and CTA buttons without requiring authentication.

#### Scenario: Sections highlight programs and testimonials

- **WHEN** the visitor scrolls the landing page
- **THEN** they SHALL see program highlights (membership tiers, personal training, wellness services) and at least one testimonial block with mock content.

### Requirement: Landing Page Calls-To-Action

The system SHALL provide CTA buttons linking to `/register` for public enrollment and `/dashboard` for stakeholders previewing the internal UI.

#### Scenario: Registration CTA

- **WHEN** a visitor clicks "Join Elevate" (or equivalent) on the landing page
- **THEN** they SHALL be routed to `/register` in the same tab/window.

#### Scenario: Dashboard preview CTA

- **WHEN** a stakeholder clicks "View Dashboard" (or equivalent) CTA
- **THEN** they SHALL be routed to `/dashboard` where the internal UI preview lives.

### Requirement: Dashboard Path Relocation

The system SHALL serve the existing UI foundation experience from `/dashboard` and ensure navigation updates reflect the new path.

#### Scenario: Dashboard accessible at /dashboard

- **WHEN** a user visits `/dashboard`
- **THEN** the responsive UI shell, KPI widgets, quick actions, and card designer SHALL load exactly as previously available at `/`.

#### Scenario: Links updated

- **WHEN** any internal navigation or CTA references the dashboard
- **THEN** the link target SHALL point to `/dashboard`, and `/` shall no longer render the dashboard content.
