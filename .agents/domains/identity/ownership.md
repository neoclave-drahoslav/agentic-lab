# Identity Ownership

Owner team: Team Platform.

Runtime paths:

- `apps/identity/**`
- `packages/auth-client/**`

Instruction source paths:

- `.agents/domains/identity/**`

Required reviewers:

- `@team-platform`
- `@security-reviewers` for auth, permission, token, or tenant-boundary changes.

## Review Triggers

- Login, session, token, permission, role, or tenant-boundary changes.
- Any change that weakens a guard, fallback, or deny path.
- Any new machine-to-machine or agent identity flow.