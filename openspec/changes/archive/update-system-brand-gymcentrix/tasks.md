## 1. Research & UX

- [x] 1.1 Confirm default system name "Gymcentrix" and that gym name is the tenant/business name shown below it in the admin panel.
- [x] 1.2 Confirm Brand Studio fields: system name, gym name, logo, primary color, secondary color; and that these drive the app shell and other consumers.

## 2. Implementation

- [x] 2.1 Add brand context (or extend existing approach) holding: systemName, gymName, logoUrl, primaryColor, secondaryColor; default systemName "Gymcentrix", default gymName as desired (e.g. "My Gym" or keep "Elevate Lifestyle & Fitness" as demo).
- [x] 2.2 Update Brand Studio UI: add system name and gym name inputs; keep logo and colors; ensure state is the same source consumed by the app shell (e.g. BrandStudio writes to context/store).
- [x] 2.3 Update app shell: read brand from context; display system name as main heading and gym name on the line below in the sidebar; use brand logo and colors where appropriate (e.g. icon/logo area, primary/accent).
- [x] 2.4 Replace hardcoded "Elevate" product name in admin-facing metadata/titles with system name from brand (e.g. "Dashboard | Gymcentrix" or dynamic).
- [x] 2.5 Ensure dashboard layout (or root of dashboard) provides brand context to app shell and Brand Studio so edits in Brand Studio update the shell in real time.

## 3. Validation & Docs

- [x] 3.1 Manually verify: change system name and gym name in Brand Studio and confirm admin panel shows them (system name on top, gym name below).
- [x] 3.2 Run lint/tests/build and `openspec validate update-system-brand-gymcentrix --strict --no-interactive`.
