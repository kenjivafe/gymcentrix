# Change: Add public self-service registration experience

## Why

Potential members currently have no way to express interest digitally. Providing a public registration surface lets prospects enroll for gym memberships or personal training packages, streamlining lead capture and reducing manual data entry for staff.

## What Changes

- Introduce a responsive public-facing registration page that educates visitors and gathers required profile, goal, and plan selection details.
- Support dual flows: standard membership enrollment and optional personal training add-ons, including trainer preferences and schedule hints.
- Capture consent, policy acknowledgements, and confirmation messaging while queuing submissions for back-office review or automated onboarding hooks.
- Wire submissions to backend APIs (or interim persistence) with validation, spam protection, and analytics events.

## Impact

- Affected specs: `public-registration` (new capability)
- Affected code: Marketing/public Next.js route, shared form components, submission API route/queue, persistence layer for leads, notification hooks for sales/trainers
