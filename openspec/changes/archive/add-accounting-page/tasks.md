## 1. Research & UX

- [x] 1.1 Confirm accounting scope for v1 (revenue summary + transaction log; no exports/refunds yet).
- [x] 1.2 Define mock transaction data contract (payer/member, category, method, totals, timestamps, status).

## 2. Implementation

- [x] 2.1 Create `src/lib/accounting.ts` with typed mock data + filter helpers.
- [x] 2.2 Build `AccountingPage` UI with summary cards, transaction list/table, and loading/empty states.
- [x] 2.3 Implement search + filters (date range preset, method, category, status).
- [x] 2.4 Add transaction detail drawer with line items and disabled placeholder actions (refund, export receipt).
- [x] 2.5 Add `/dashboard/accounting` route and integrate AppShell navigation + dashboard CTA link.

## 3. Validation & Docs

- [x] 3.1 Write unit tests for accounting filter utilities.
- [x] 3.2 Document mock accounting data contract + future backend handoff expectations.
- [x] 3.3 Run lint/tests/build and `openspec validate add-accounting-page --strict --no-interactive`.
