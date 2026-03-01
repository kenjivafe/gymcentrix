# Change: Accounting page in dashboard

## Why

Operators need a quick, reliable view of daily revenue, payment mix, refunds, and outstanding balances. Today the UI preview focuses on members and operations, but lacks a financial cockpit for cashier reconciliation and management reporting.

## What Changes

- Add a dashboard-accessible Accounting page for financial tracking (UI-first, mock data initially).
- Provide a daily summary (gross revenue, net revenue, refunds, cash vs card mix).
- List recent transactions (membership payments, PT sessions, day passes, merchandise) with search and filters.
- Provide a transaction detail drawer with payer/member reference, payment method, line items, and placeholder actions (issue refund, export receipt) in disabled state.

## Impact

- Affected specs: accounting-page (new capability)
- Affected code: App shell navigation, new `/dashboard/accounting` route, mock accounting data utilities, accounting UI components.
