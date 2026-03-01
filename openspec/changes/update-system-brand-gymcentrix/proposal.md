# Change: System rebrand to Gymcentrix and Brand Studio–driven identity

## Why

The product should be named Gymcentrix and support multi-tenant branding: each gym can set its own business name, logo, and colors. Brand Studio should be the single place to configure system name (product name, default "Gymcentrix"), gym name (business/tenant name), logo, and colors, and the admin panel and other surfaces should reflect these values so branding is consistent and operator-configurable.

## What Changes

- **Default system name:** The product name SHALL default to "Gymcentrix" (replacing "Elevate" as the system/product name where applicable).
- **Brand Studio as source of truth:** Brand Studio SHALL allow editing: system name (product name), gym name (business name), logo URL, primary color, and secondary color. These values SHALL be consumed app-wide (e.g. via shared context or config); save may remain disabled until backend exists, with in-session or client-side persistence acceptable for the preview.
- **Admin panel (app shell):** The dashboard sidebar SHALL display the system name (e.g. "Gymcentrix") as the main heading and the gym name below it (e.g. "Elevate Lifestyle & Fitness" or operator-configured name). Logo and colors from Brand Studio SHALL be used where the shell shows brand (e.g. icon area, accents).
- **Consistency:** Page titles, landing, and other references to the product or gym SHALL use the configurable system name and gym name where appropriate (scope can be limited to admin panel for v1 if needed).

## Impact

- Affected specs: brand-studio, app-shell (or dashboard)
- Affected code: Brand Studio page and brand state (add system name + gym name; expose via context/store), app shell (read brand context; show system name + gym name with gym name below), mock data defaults (Gymcentrix, optional default gym name), and any hardcoded "Elevate" product or tenant strings in the admin flow.
