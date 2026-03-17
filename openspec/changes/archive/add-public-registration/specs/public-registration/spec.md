## ADDED Requirements

### Requirement: Public Registration Landing Page

The system SHALL expose a public-facing registration page reachable without authentication that educates prospects and collects membership inquiries on desktop and mobile viewports.

#### Scenario: Visitor can access registration page

- **WHEN** a user navigates to `/register`
- **THEN** the system SHALL render hero content, plan highlights, and a call-to-action form without requiring login credentials.

#### Scenario: Layout adapts to mobile

- **WHEN** the visitor loads the page on a viewport under 768px
- **THEN** all sections (hero, plan selector, FAQs, form) SHALL stack vertically with preserved content and controls.

### Requirement: Membership Enrollment Form

The system SHALL provide a registration form that captures personal details, membership plan selection, goals, and consent acknowledgements.

#### Scenario: Required fields enforced

- **WHEN** a visitor submits the form without completing required personal details (name, email, phone) or plan selection
- **THEN** inline validation messages SHALL display and submission SHALL be blocked.

#### Scenario: Consent is recorded

- **WHEN** a visitor submits the form after checking policy and communication consent boxes
- **THEN** the captured payload SHALL contain timestamped consent flags for compliance review.

### Requirement: Personal Training Add-on Flow

The system SHALL allow visitors to optionally register for personal training, capturing trainer style preferences and scheduling availability.

#### Scenario: Opt-in reveals extra fields

- **WHEN** a visitor toggles "Add personal training"
- **THEN** additional inputs for training goals, preferred trainer attributes, and availability SHALL become visible and required only for that branch.

#### Scenario: Opt-out hides add-on data

- **WHEN** the visitor leaves personal training unchecked
- **THEN** the submission payload SHALL omit training-specific fields.

### Requirement: Submission Handling & Handoff

The system SHALL queue registration submissions for staff review, provide user-facing confirmation, and emit notification hooks.

#### Scenario: Success confirmation

- **WHEN** a visitor submits valid registration data
- **THEN** the UI SHALL show a confirmation message explaining next steps and estimated response time.

#### Scenario: Staff notification hook

- **WHEN** a submission is received
- **THEN** the system SHALL enqueue the payload (or store via mock persistence) and trigger a notification callback (mock email/log) for the sales and trainer teams.
