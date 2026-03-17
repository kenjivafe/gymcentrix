# Change: Card designer page

## Why

The membership card designer is a distinct workflow and should live on a dedicated page instead of competing with operational dashboard content. This keeps the dashboard analytics-focused while still allowing stakeholders to preview the card template experience.

## What Changes

- Add a dedicated Card Designer page under the dashboard at `/dashboard/card-designer`.
- Reuse the existing UI-first `CardDesigner` component and keep save actions disabled until backend persistence is implemented.
- Enable sidebar navigation entry for Card Designer to route to the new page.

## Impact

- Affected specs: card-designer-page (new capability)
- Affected code: App shell navigation, new `/dashboard/card-designer` route, reuse existing card designer components.
