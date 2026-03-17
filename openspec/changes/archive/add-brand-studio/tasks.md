## 1. Research & UX

- [x] 1.1 Confirm Brand Studio v1 scope (logo, primary/secondary colors, optional typography; save disabled).
- [x] 1.2 Confirm navigation: Brand Studio link goes to `/dashboard/brand-studio` and replaces the current placeholder.

## 2. Implementation

- [x] 2.1 Create `/dashboard/brand-studio` route that renders the Brand Studio experience inside `AppShell`.
- [x] 2.2 Update AppShell navigation so "Brand Studio" has `href: /dashboard/brand-studio`.
- [x] 2.3 Build Brand Studio page: logo area (upload placeholder or URL), primary/secondary color inputs, live preview of brand tokens; disable save/publish until backend exists.
- [x] 2.4 Set page metadata (title/description) for the Brand Studio route.

## 3. Validation & Docs

- [x] 3.1 Add a minimal test that the Brand Studio route renders (or unit tests for new utilities).
- [x] 3.2 Run lint/tests/build and `openspec validate add-brand-studio --strict --no-interactive`.
