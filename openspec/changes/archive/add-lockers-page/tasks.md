## 1. Research & UX

- [ ] 1.1 Confirm locker layout assumptions (zones, numbering scheme, total locker count) and occupancy states.
- [ ] 1.2 Define the mock data contract for locker sessions (RFID claim at locker, release at cashier logout).

## 2. Implementation

- [ ] 2.1 Create `src/lib/lockers.ts` with types, mock lockers + sessions, and filter helpers.
- [ ] 2.2 Build `LockersPage` list/table UI with loading/empty states, occupancy badges, and search/filters.
- [ ] 2.3 Add locker detail drawer/modal showing member/session details and disabled actions (force release, mark maintenance).
- [ ] 2.4 Add `/dashboard/lockers` route and integrate into AppShell navigation + dashboard CTA.

## 3. Validation & Docs

- [ ] 3.1 Write unit tests for lockers filter utilities and key session state transitions (claim/release simulation helpers).
- [ ] 3.2 Document mock locker session lifecycle and backend integration expectations (RFID readers + cashier logout).
- [ ] 3.3 Run lint/tests/build and `openspec validate add-lockers-page --strict --no-interactive`.
