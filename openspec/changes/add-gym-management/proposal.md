# Change: Add Gym Management

## Why
Currently, the Super Admin panel only lists gyms but doesn't provide a way to register new gym tenants. We need a functional interface and backend logic to onboard new gyms and their owners.

## What Changes
- **ADDED** Gym Registration Server Action: Handles database creation of Gyms and linking to owners.
- **ADDED** Gym Creation UI: A modal form on the `/super-admin/gyms` page.
- **ADDED** Owner Management: Provisioning `GYM_OWNER` roles during gym creation.

## Impact
- Affected specs: `super-admin`
- Affected code: `src/app/super-admin/gyms/page.tsx`, `src/app/actions/gym.ts`
