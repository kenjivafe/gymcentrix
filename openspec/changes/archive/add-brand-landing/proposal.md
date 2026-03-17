# Change: Add Elevate Lifestyle & Fitness landing page and move dashboard to /dashboard

## Why

Currently the root path immediately drops users into the internal dashboard mock. We need a branded marketing landing page for Elevate Lifestyle & Fitness that communicates value, highlights programs, and funnels visitors into registration. The internal UI preview should move to `/dashboard` so future auth and routing align with production expectations.

## What Changes

- Introduce a polished marketing landing page at `/` with hero messaging, program highlights, testimonials, CTA buttons, and mobile parity.
- Wire CTA buttons to both the public registration flow and dashboard preview for stakeholders.
- Relocate the existing UI foundation experience (dashboard shell, KPIs, card designer) to `/dashboard`, updating navigation and links accordingly.
- Update routing defaults, metadata, and documentation so `/dashboard` is the new internal entry point.

## Impact

- Affected specs: `marketing-landing` (new capability), `ui-foundation` (path update)
- Affected code: Next.js routing (app pages), layout shell navigation, landing components, link targets, documentation/deployment instructions
