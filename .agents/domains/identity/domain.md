# Identity Domain

The identity domain owns authentication, authorization, sessions, tenant access,
and audit signals. It is a critical domain because defects can expose data or
grant unintended access.

## Responsibilities

- Users, sessions, roles, permissions, and tenant membership.
- Authentication and authorization guards.
- Token lifecycle and credential-adjacent flows.
- Security audit events for access changes.

## Boundaries

- Authorization checks must be explicit and close to the protected operation.
- Session changes require compatibility with existing clients.
- Audit events must be emitted for privilege and access changes.
- Token handling must avoid logging secrets or credentials.