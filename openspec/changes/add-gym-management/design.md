## Context
Gym onboarding is a critical developer/super-admin workflow. It requires atomicity to ensure both the gym record and its corresponding owner account are configured correctly.

## Goals / Non-Goals
- Goals: Atomic creation of gyms and owners.
- Non-Goals: Deleting gyms (archiving/soft-delete will be handled later).

## Decisions
- **Decision**: Use Next.js Server Actions for data mutations to keep logic close to the components while maintaining type safety.
- **Decision**: Link existing users if the email matches, otherwise create a new `GYM_OWNER` user.

## Risks / Trade-offs
- Multiple gyms per owner? Currently, the schema supports one owner per gym but a user can own multiple gyms (one-to-many from User to Gym).
