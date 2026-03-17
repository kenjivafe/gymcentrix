## ADDED Requirements
### Requirement: User Authentication
The system SHALL authenticate users using robust session management.

#### Scenario: User logs in successfully
- **WHEN** a user provides valid credentials
- **THEN** a secure session is established and the user context is populated.

### Requirement: Role-Based Access Control
The system SHALL enforce role-based access control based on user roles (e.g., SUPER_ADMIN, GYM_OWNER).

#### Scenario: Super Admin accesses restricted route
- **WHEN** a user with the SUPER_ADMIN role navigates to /super-admin
- **THEN** they successfully view the protected layout.

#### Scenario: Unauthorized Access Denial
- **WHEN** a user without the SUPER_ADMIN role bounds navigates to /super-admin
- **THEN** they are immediately redirected to an unauthorized or login page.
