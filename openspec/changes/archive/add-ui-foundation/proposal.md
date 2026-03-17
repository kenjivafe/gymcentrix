# Change: Establish UI foundation for the gym membership system

## Why

Gym owners need a usable interface to explore the system while backend integrations (RFID, biometrics, APIs) are still under development. A UI-first experience lets stakeholders validate flows, copy, and visual hierarchy before wiring real data.

## What Changes

- Introduce a responsive UI shell with persistent navigation, theming tokens, and layout regions dedicated to cards, dashboards, and notifications.
- Add dashboard surfaces for membership KPIs, quick actions, and recent activity using mock data sources.
- Provide a membership card designer interface with instant visual preview and gated save/publish controls until services exist.
- Define loading, empty, and disabled interaction states so UI remains polished even without backend connections.

## Impact

- Affected specs: `ui-foundation` (new capability)
- Affected code: Next.js app shell components, layout primitives, Tailwind theme tokens, Storybook/docs for UI behaviors
