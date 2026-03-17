## 1. Research & UX

- [ ] 1.1 Audit current dashboard shell + CTA surface for adding an Employees link alongside Members.
- [ ] 1.2 Define mock employee attendance dataset (roles, biometric IDs, shift windows, streak/compliance metrics) and drawer layout.

## 2. Implementation

- [ ] 2.1 Create `src/lib/employees.ts` with typed mock data plus search/filter helpers.
- [ ] 2.2 Build `EmployeesPage` component with loading/empty states, attendance list cards/table, and filter toolbar.
- [ ] 2.3 Implement employee detail drawer showing attendance history, biometric info, and disabled management actions.
- [ ] 2.4 Add `/dashboard/employees` route, integrate AppShell navigation + dashboard CTA link.

## 3. Validation & Docs

- [ ] 3.1 Write unit tests for employees filter utilities and drawer open/close state.
- [ ] 3.2 Document mock staff data contract + future biometric handoff expectations.
- [ ] 3.3 Run lint/tests/build and `openspec validate add-employees-attendance-page --strict --no-interactive`.
