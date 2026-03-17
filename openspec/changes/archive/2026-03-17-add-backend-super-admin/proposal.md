# Change: Add Backend Foundation and Super Admin Panel

## Why
Gymcentrix currently has a frontend UI but lacks a backend to persist data and authenticate users. To establish a multitenant application, we need a robust backend with an ORM, an authentication provider, and a Super Admin panel for administrators/developers to manage gym tenants and their respective owners.

## What Changes
- Integrate **NextAuth.js** for robust session management and authentication.
- Integrate **Prisma ORM** with a Postgres database to model our data schema.
- Introduce Role-Based Access Control (RBAC) to distinguish between `SUPER_ADMIN`, `GYM_OWNER`, and `EMPLOYEE`.
- Build a Super Admin Dashboard (`/super-admin`) featuring Gym and Gym Owner management UI and API routes.

## Impact
- Affected specs: `auth`, `super-admin` (new capabilities)
- Affected code: `src/app/api/auth`, `src/app/super-admin`, `src/lib/prisma.ts`
