## 1. Research & UX

- [x] 1.1 Confirm the card designer UX scope for v1 (template preview only; saving disabled).
- [x] 1.2 Confirm navigation placement and naming in the dashboard shell.

## 2. Implementation

- [x] 2.1 Create `/dashboard/card-designer` route that renders the existing `CardDesigner` component inside `AppShell`.
- [x] 2.2 Update AppShell navigation to make "Card Designer" a real link.
- [x] 2.3 Ensure the page metadata (title/description) matches the dashboard preview tone.

## 3. Validation & Docs

- [x] 3.1 Add a minimal test ensuring the Card Designer route renders (or add unit test coverage for any new utility functions introduced).
- [x] 3.2 Run lint/tests/build and `openspec validate add-card-designer-page --strict --no-interactive`.
