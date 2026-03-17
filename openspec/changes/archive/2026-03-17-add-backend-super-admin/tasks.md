## 1. Project Setup
- [/] 1.1 Install dependencies (Prisma, NextAuth, bcrypt, database drivers)
- [ ] 1.2 Initialize Prisma (`npx prisma init`)

## 2. Database Schema
- [x] 2.1 Define standard NextAuth models (`User`, `Account`, `Session`)
- [x] 2.2 Create `Role` enum (`SUPER_ADMIN`, `GYM_OWNER`, `EMPLOYEE`)
- [x] 2.3 Create `Gym` model (multitenancy anchor)
- [x] 2.4 Add relationships between `User` (as Gym Owner/Employee) and `Gym`
- [x] 2.5 Run initial database migration

## 3. Authentication Integration
- [x] 3.1 Setup `src/lib/prisma.ts` for database connection pooling
- [x] 3.2 Configure Auth options in `src/app/api/auth/[...nextauth]/route.ts`
- [x] 3.3 Ensure NextAuth callbacks include the user's `role` and `gymId` in the JWT and session context
- [x] 3.4 Create a dummy/seed script to generate the first `SUPER_ADMIN` user

## 4. Super Admin Panel
- [x] 4.1 Create `src/app/super-admin/layout.tsx` enforcing `SUPER_ADMIN` access
- [x] 4.2 Build Gym Dashboard UI (`/super-admin`) displaying summary metrics
- [x] 4.3 Create Gym Management page (`/super-admin/gyms`) - list, create, update Gyms
- [x] 4.4 Create Gym Owners Management page (`/super-admin/owners`) - assign users to gyms
