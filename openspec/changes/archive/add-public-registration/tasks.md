## 1. Discovery & UX

- [ ] 1.1 Audit existing marketing/public routes to confirm no conflicting entry points.
- [ ] 1.2 Define registration content hierarchy (hero, plan options, personal training pitch, FAQs).

## 2. UI Implementation

- [ ] 2.1 Build responsive registration page with hero, membership selector, training opt-in, and confirmation section using mock data.
- [ ] 2.2 Implement multi-step form experience with validation hints, consent checkboxes, and spam-protection widgets (e.g., honeypot/captcha placeholder).

## 3. Data & API Layer

- [ ] 3.1 Create submission API route that queues payloads (temporary in-memory or mocked persistence until service exists).
- [ ] 3.2 Emit notification/analytics events (console/log mocks) for sales and trainer team handoffs.

## 4. Testing & Documentation

- [ ] 4.1 Write unit/integration tests covering happy path and validation failures.
- [ ] 4.2 Document data contract and manual review steps in README/handbook.
- [ ] 4.3 Validate against OpenSpec and lint/build before requesting approval.
