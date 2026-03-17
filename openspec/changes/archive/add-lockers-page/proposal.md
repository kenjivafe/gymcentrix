# Change: Lockers page with session occupancy via RFID

## Why

Lockers are a core on-site experience and need operational visibility: which lockers are currently occupied, who claimed them, and whether they were released at checkout. Without a dedicated view, front desk staff must guess availability and cannot easily resolve disputes.

## What Changes

- Add a new dashboard page for tracking locker occupancy in real time (UI-first, mock data initially).
- Model locker sessions claimed by RFID tap at the locker reader.
- Release lockers when the member taps their RFID card for logout at the cashier.
- Provide quick search and filters to find lockers by number/zone and isolate occupied vs available.
- Show a locker detail drawer with session metadata (member, card, claim time, duration) and placeholder actions (force release, flag maintenance) in disabled state.

## Impact

- Affected specs: lockers-page (new capability)
- Affected code: App shell navigation, new `/dashboard/lockers` route, mock data + filtering utilities, locker detail drawer UI.
