# Gymcentrix — Gym Membership Management System

Gym membership and RFID operations UI for **Gymcentrix**. The admin panel is branded with the Gymcentrix app logo; each gym configures its own logo, name, and colors in Brand Studio.

This repository delivers a **UI-first** Next.js dashboard backed by **mock data**, with future integrations planned for RFID hardware, locker control, and biometric attendance.

## Tech Stack

- Next.js 14 (App Router)
- React 18 + TypeScript
- Tailwind CSS
- Vitest
- OpenSpec (spec-driven workflow under `openspec/`)

## Getting Started

### Prerequisites

- Node.js 18+
- npm

### Install

```bash
npm install
```

### Run the dev server

```bash
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000).

### Other scripts

```bash
npm run lint
npm run test
npm run build
npm run start
```

## App Routes

| Route | Description |
|-------|-------------|
| `/` | Marketing landing page |
| `/register` | Public registration preview (mock API) |
| `/dashboard` | Operations dashboard (KPIs, timeline, quick actions) |
| `/dashboard/members` | Members directory (search, filters, detail drawer) |
| `/dashboard/employees` | Employees attendance (roster, compliance, detail drawer) |
| `/dashboard/lockers` | Lockers occupancy (RFID session mock, drawer) |
| `/dashboard/accounting` | Accounting (daily summary, transaction log, filters) |
| `/dashboard/attendance` | Daily attendance (today summary, recent check-ins, biometric placeholder) |
| `/dashboard/card-designer` | Membership card template editor (live preview) |
| `/dashboard/brand-studio` | Gym brand: gym name, gym logo, primary/secondary colors |
| `/dashboard/settings` | Subscription types, discounts, feature toggles (Lockers, Employees, Attendance, Card Designer) |

## Admin Panel Branding

- **Top of sidebar:** Gymcentrix app logo (fixed; not editable in Brand Studio).
- **Below:** Gym logo + gym name — configured in **Brand Studio** (gym logo URL, gym name, colors). Default gym logo: `/brand/elevate-logo.png` (or `.jpg` if you use that file).

## Current UI Capabilities (Mocked)

- **Members** — Search, filters, detail drawer
- **Employees** — Attendance compliance, biometric ID in drawer
- **Lockers** — Available vs occupied, RFID sessions
- **Accounting** — Daily summary, transaction log, search/filters, detail drawer
- **Attendance** — Today summary, recent check-in/check-out list, disabled “Record check-in” (biometric)
- **Card Designer** — Template fields + live preview (save disabled until backend)
- **Brand Studio** — Gym name, gym logo URL, primary/secondary colors (no persistence yet)
- **Settings** — Subscription types (name, duration, price), discounts (name, description, duration “Always”, price), feature toggles for dashboard modules
- **Dashboard** — KPI tiles, analytics, activity timeline

## OpenSpec Workflow

This project uses OpenSpec for change proposals and specs.

### Create a change

1. Add a folder under `openspec/changes/<change-id>/` (e.g. `add-settings-page`).
2. Add `proposal.md`, `tasks.md`, and `specs/<capability>/spec.md` with ADDED/MODIFIED/REMOVED requirements and scenarios.
3. Validate:

```bash
openspec validate <change-id> --strict --no-interactive
```

### Implement an approved change

Follow the checklist in `openspec/changes/<change-id>/tasks.md` and mark items `- [x]` when done.

## Troubleshooting

### Dev server starts but pages return 404 for `/_next/static/...`

Often caused by a stale Next.js dev cache.

1. Stop the dev server.
2. Delete the `.next` folder.
3. Restart:

```bash
npm run dev
```

If it persists, reinstall dependencies:

```bash
rm -rf node_modules package-lock.json
npm install
npm run dev
```

## License

TBD
