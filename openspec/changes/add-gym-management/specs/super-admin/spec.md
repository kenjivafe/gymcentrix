## ADDED Requirements
### Requirement: Gym Registration
The Super Admin SHALL be able to register a new gym tenant by providing a name and assigning an owner.

#### Scenario: Register new gym successfully
- **WHEN** a super admin provides a valid gym name and owner email
- **THEN** a new gym record is created in the database
- **AND** a user with the specified email is assigned or promoted to the `GYM_OWNER` role for that gym
