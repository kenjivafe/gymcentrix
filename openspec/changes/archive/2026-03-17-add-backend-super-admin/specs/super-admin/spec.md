## ADDED Requirements
### Requirement: View Gyms
The Super Admin dashboard SHALL provide a view listing all gym tenants in the system.

#### Scenario: Developer lists gyms
- **WHEN** a super admin visits the gyms management page
- **THEN** they see an overview of all gyms including name and owner contact status.

### Requirement: Manage Gyms
The Super Admin dashboard SHALL allow creating and modifying Gym records.

#### Scenario: Developer registers a new gym
- **WHEN** a super admin submits the create gym form
- **THEN** a new gym record is persisted in the database.

### Requirement: Manage Gym Owners
The Super Admin dashboard SHALL allow assigning a user as an owner to a Gym.

#### Scenario: Developer assigns an owner
- **WHEN** a super admin creates a new user and grants them the GYM_OWNER role tied to a Gym ID
- **THEN** that user gains access to their specific gym tenant dashboard.
