# Change: Collapsible sidebar on mobile

## Why

On mobile screens, the dashboard sidebar currently occupies significant vertical space when visible, reducing the main content area. Operators on phones and small tablets need the ability to hide the sidebar and reclaim screen space, then open it when they want to navigate. A collapsible sidebar (e.g. hamburger trigger, slide-out drawer) improves mobile UX while keeping navigation accessible.

## What Changes

- On mobile viewports (below the `lg` breakpoint), the dashboard sidebar SHALL be collapsible: hidden by default or collapsed, with a toggle control (e.g. hamburger menu, header button) to open and close it.
- When open on mobile, the sidebar MAY appear as an overlay or slide-out drawer that does not push the main content; when closed, the toggle control remains visible so users can reopen navigation.
- On desktop (lg and up), the sidebar SHALL remain always visible as today (no change to current behavior).
- Optionally, tapping a nav link on mobile MAY close the sidebar after navigation to reduce clutter.

## Impact

- Affected specs: app-shell (new capability)
- Affected code: `src/components/layout/app-shell.tsx` (responsive behavior, toggle state, mobile drawer/overlay styling).
