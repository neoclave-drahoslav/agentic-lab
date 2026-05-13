<!--
DO NOT EDIT.
Generated from .agents/ canonical sources.
Run: npm run agents:generate
-->

# Identity Agent Instructions

This local adapter gives agents the context they need when working in
`apps/identity`.

## Domain Ownership

Owner team: Team Platform

Runtime paths:
- `apps/identity/**`
- `packages/auth-client/**`

Instruction source paths:
- `.agents/domains/identity/**`

Required reviewers:
- @team-platform
- @security-reviewers

## Required Global Policies

- Global Engineering Rules: .agents/source/global.md
- Domain Ownership Rules: .agents/source/domain-ownership.md
- Functional Project Generation Rules: .agents/source/project-generation.md
- Security Rules: .agents/source/security.md
- Testing Rules: .agents/source/testing.md
- Git Workflow: .agents/source/git-workflow.md

## Domain Context

### Identity

Domain id: `identity`
Owner team: Team Platform
Risk level: critical

Runtime paths:
- `apps/identity/**`
- `packages/auth-client/**`

Instruction source paths:
- `.agents/domains/identity/**`

Required reviewers:
- @team-platform
- @security-reviewers

Verification commands:
- `npm run test -- --scope=identity`
- `npm run security:check -- --scope=identity`

### Domain Context

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

### Ownership

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

### Testing

Required commands:

- `npm run test -- --scope=identity`
- `npm run security:check -- --scope=identity`

## Required Coverage

- Positive and negative authorization paths.
- Tenant isolation behavior.
- Session compatibility and token lifecycle behavior.
- Audit event emission for privilege and access changes.

### Agent Overrides

- Default to deny when authorization behavior is ambiguous.
- Do not weaken authentication, authorization, token, or tenant-boundary guards.
- Never log credentials, tokens, secrets, or raw session material.
- Call out security review needs explicitly in the handoff.

## Relevant Roles

### Project Architect Agent

Role id: `architect`

Translate a project brief into a domain-aware implementation shape before code is written.

Allowed actions:
- read the project brief and canonical instructions
- identify affected domains and ownership boundaries
- propose a minimal project structure
- define acceptance criteria and verification scope
- prepare a handoff for implementation

Must do:
- keep the design small enough for the requested project
- map each feature to an owning domain
- call out cross-domain integration points
- define what done means before implementation starts

Must not do:
- invent unnecessary infrastructure
- move domain responsibilities across boundaries without justification
- start implementation before the shape and acceptance criteria are clear

### Implementation Agent

Role id: `implementer`

Implement scoped project behavior inside the domains approved by the project brief and architecture handoff.

Allowed actions:
- read relevant source files and generated instructions
- edit implementation and tests
- add minimal fixtures or seed data
- run domain verification commands
- prepare a concise handoff

Must do:
- read global and domain instructions before editing
- follow the same role contract regardless of tool runtime
- keep the change minimal and aligned with local patterns
- add or update tests for changed behavior
- report files changed and commands run

Must not do:
- change public contracts without calling out the risk
- modify unrelated domains implicitly
- skip verification silently
- optimize for tool-specific shortcuts that violate canonical instructions

### Test Agent

Role id: `tester`

Design and run verification for the functional project behavior described in the brief.

Allowed actions:
- identify impacted test suites
- add focused regression tests
- run domain and project-level verification commands
- summarize pass/fail evidence

Must do:
- map each acceptance criterion to a test or explicit residual risk
- prefer targeted tests before broad suites
- cover authorization, validation, and domain-boundary behavior when relevant
- capture failing command output in the handoff
- recommend follow-up coverage for residual risk

Must not do:
- replace meaningful assertions with snapshots only
- delete failing tests to make a check pass
- claim verification that was not run
- test implementation details when user-visible behavior is the contract

### Review Agent

Role id: `reviewer`

Review generated project changes for correctness, risk, maintainability, domain boundaries, and test coverage.

Allowed actions:
- inspect diffs
- read surrounding code and generated instructions
- run targeted checks
- leave actionable findings

Must do:
- lead with concrete findings ordered by severity
- verify behavior against the shared project brief
- reference files and lines when possible
- flag missing tests for changed behavior
- separate confirmed bugs from open questions

Must not do:
- rewrite the implementation while reviewing
- raise vague style preferences as blockers
- approve security-sensitive changes without verification
- judge success by source-code similarity across tools

### Integration Agent

Role id: `integrator`

Confirm that separately implemented parts work together as one functional project.

Allowed actions:
- inspect project wiring and cross-domain flows
- run project-level build and test commands
- check README and demo instructions
- prepare final delivery notes

Must do:
- verify that the generated project can be run by a new developer
- confirm that domain integration matches the project brief
- check that generated adapters stayed in sync
- call out any missing setup, seed data, or environment assumptions

Must not do:
- hide integration failures behind local-only assumptions
- change domain ownership to make wiring easier
- leave the project without run and test instructions

## Required Verification

- `npm run test -- --scope=identity`
- `npm run security:check -- --scope=identity`

## Handoff Format

- What changed in this domain.
- Which commands were run.
- Whether cross-domain review is needed.
