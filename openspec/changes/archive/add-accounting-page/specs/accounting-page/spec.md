## ADDED Requirements

### Requirement: Accounting Page Access

The system SHALL provide an Accounting page accessible via the dashboard app shell navigation that renders financial summaries and transactions using deterministic mock data.

#### Scenario: Accounting page loads

- **WHEN** a staff operator clicks "Accounting" in the sidebar
- **THEN** the UI SHALL navigate to `/dashboard/accounting` and render summary cards and a transaction log with loading placeholders while mock data is prepared.

### Requirement: Daily Summary Analytics

The system SHALL display daily accounting summaries including gross revenue, net revenue, refunds, and payment method mix.

#### Scenario: Summary cards show deterministic metrics

- **WHEN** the accounting page is visible
- **THEN** summary tiles SHALL show deterministic mock metrics for the day and label the reporting window.

### Requirement: Transaction Log with Search & Filters

The system SHALL list recent transactions and provide search and filters to locate records by payer/member reference, category, payment method, date preset, and status.

#### Scenario: Search narrows transaction log

- **WHEN** the operator types a query into the search input
- **THEN** the transaction list SHALL filter client-side to matching payer names, member emails, or receipt identifiers.

#### Scenario: Filters isolate card transactions

- **WHEN** the operator selects the payment method filter "Card"
- **THEN** only card-based transactions SHALL remain visible until the filter is cleared.

### Requirement: Transaction Detail Drawer

The system SHALL provide a transaction detail drawer/modal showing line items, payer information, payment method, totals, and placeholder actions.

#### Scenario: Drawer reveals transaction details

- **WHEN** the operator selects a transaction from the list
- **THEN** a drawer SHALL display receipt id, timestamp, payer/member reference, line item breakdown, and total/refund metadata.

#### Scenario: Placeholder actions are disabled

- **WHEN** the operator views the transaction detail drawer
- **THEN** the UI SHALL show disabled placeholder actions for issuing refunds and exporting receipts.
