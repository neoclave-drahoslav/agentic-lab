---
applyTo: "packages/ui/**"
---
<!--
DO NOT EDIT.
Generated from .agents/ canonical sources.
Run: npm run agents:generate
-->

# Frontend Platform Copilot Instructions

These path-specific instructions are generated from `.agents/` canonical sources
and apply when GitHub Copilot works on `packages/ui/**`.

## Domain Ownership

Owner team: Team Experience

Runtime paths:
- `packages/ui/**`
- `apps/web/**`

Instruction source paths:
- `.agents/domains/frontend/**`

Required reviewers:
- @team-experience

## Required Global Policies

- Global Engineering Rules: .agents/source/global.md
- Domain Ownership Rules: .agents/source/domain-ownership.md
- Functional Project Generation Rules: .agents/source/project-generation.md
- Security Rules: .agents/source/security.md
- Testing Rules: .agents/source/testing.md
- Git Workflow: .agents/source/git-workflow.md

## Domain Context

### Frontend Platform

Domain id: `frontend`
Owner team: Team Experience
Risk level: medium

Runtime paths:
- `packages/ui/**`
- `apps/web/**`

Instruction source paths:
- `.agents/domains/frontend/**`

Required reviewers:
- @team-experience

Verification commands:
- `npm run test -- --scope=frontend`
- `npm run storybook:test`

### Domain Context

The frontend platform domain owns shared UI components, design tokens,
accessibility patterns, and cross-product interaction conventions.

## Responsibilities

- Shared UI components and composition patterns.
- Design tokens and visual consistency.
- Accessibility behavior.
- Cross-product frontend developer experience.

## Boundaries

- Shared components must remain backward compatible by default.
- Accessibility is part of done, not a follow-up.
- Visual changes should avoid layout shift and text overflow.
- Domain product logic should not move into generic UI primitives.

### Ownership

Owner team: Team Experience.

Runtime paths:

- `packages/ui/**`
- `apps/web/**`

Instruction source paths:

- `.agents/domains/frontend/**`

Required reviewers:

- `@team-experience`

## Review Triggers

- Shared component API changes.
- Design token changes.
- Accessibility behavior changes.
- Changes that affect multiple product surfaces.

### Testing

Required commands:

- `npm run test -- --scope=frontend`
- `npm run storybook:test`

## Required Coverage

- Component behavior for public APIs.
- Accessibility states and keyboard interaction.
- Layout stability for responsive surfaces.
- Visual regression coverage when available.

### Agent Overrides

- Prefer existing shared components and tokens before adding new primitives.
- Do not move product-specific business logic into shared UI packages.
- Check text overflow, keyboard behavior, and accessible names for UI changes.
- Call out cross-product impact when changing shared component APIs.

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

- `npm run test -- --scope=frontend`
- `npm run storybook:test`

## Handoff Format

- What changed in this path scope.
- Which commands were run.
- Whether cross-domain review is needed.
