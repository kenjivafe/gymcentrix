## Context
Gymcentrix is transitioning from a static UI foundation to a dynamic, multitenant application. We need a strong data layer and secure authentication mechanism to manage diverse user roles across different gyms.

## Goals / Non-Goals
- **Goals**: Set up user authentication with NextAuth, configure Prisma ORM for a PostgreSQL database, establish multi-table schema for Gyms and Users, and create the Super Admin panel.
- **Non-Goals**: Building the tenant-specific (Gym Owner) dashboard, defining biometric system APIs, or creating member-facing mobile views at this stage.

## Decisions
- **Decision**: Use Prisma ORM. *Rationale*: Excellent type-safety with TypeScript, easy integration with Next.js, and reliable migration system.
- **Decision**: Use NextAuth.js. *Rationale*: The standard, most secure way to handle auth in Next.js App Router. Supports the standard Prisma adapter out-of-the-box.
- **Decision**: Implement a single `User` table with a `Role` enum. *Rationale*: Keeps authentication unified while relying on roles (`SUPER_ADMIN`, `GYM_OWNER`, etc.) to control access to different application zones.

## Risks / Trade-offs
- **Risk**: Complexity of managing varying permissions for users in a multitenant setup.
- **Mitigation**: We rely on strict layout-level boundary checks (e.g., verifying `session.user.role === 'SUPER_ADMIN'` in `src/app/super-admin/layout.tsx`) and route handlers.

## Migration Plan
Since there is no existing database, this acts as the initial migration and schema formulation.
