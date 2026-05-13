<!--
DO NOT EDIT.
Generated from .agents/ canonical sources.
Run: npm run agents:generate
-->

# Codex Repository Instructions

Codex reads AGENTS.md files from the repository tree. It receives the same canonical agent roster, policies, domains, and project-generation rules as every other tool.

## Operating Model

This file is generated from the canonical instruction source in `.agents/`.
If a rule is wrong, edit the source file and regenerate adapters.

## Global Policies

### Global Engineering Rules

These rules apply to every agent, tool, and domain.

- All agent tools must work from generated adapters derived from the same `.agents/` canonical sources.
- Treat tool-specific files as adapters, not as independent sources of truth.
- Use the canonical role roster consistently: Architect, Implementer, Tester, Reviewer, and Integrator.
- Read the relevant domain context before editing files.
- Keep changes scoped to the requested behavior.
- Prefer existing repo patterns over new abstractions.
- Do not rewrite unrelated code while implementing a task.
- State assumptions when the request is ambiguous.
- Report changed files and verification steps in the handoff.

## Default Workflow

1. Understand the project brief and identify the owning domains.
2. Use the Architect role to define the implementation shape and acceptance criteria.
3. Use the Implementer role to make the smallest coherent change.
4. Use the Tester role to add or run verification for required behavior.
5. Use the Reviewer role to inspect risk, boundaries, and missing coverage.
6. Use the Integrator role to confirm the project works as one functional whole.
7. Summarize what changed, what was verified, and any residual risk.

### Domain Ownership Rules

This repository supports decentralized domain ownership inside one centralized
agent instruction system.

## Ownership Model

- Platform or architecture owners maintain `.agents/source/**`, `.agents/roles/**`, `.agents/templates/**`, and `scripts/agents.mjs`.
- Domain teams maintain their own `.agents/domains/<domain>/**` instruction sources.
- Generated adapters are not owned by individual teams; they are build outputs from canonical sources.
- Runtime code ownership should align with the domain `runtimePaths` declared in `.agents/config.json`.

## Required Domain Files

Each domain must provide:

- `domain.md` for responsibilities and boundaries.
- `ownership.md` for owner team, runtime paths, source paths, and reviewers.
- `testing.md` for required commands and coverage expectations.
- `agent-overrides.md` for domain-specific agent constraints.

## Cross-Domain Work

When a task touches more than one domain, agents must:

- Read every affected domain's instruction sources.
- Preserve each domain's ownership boundaries.
- Call out integration risk in the handoff.
- Request review from every affected domain owner.

### Functional Project Generation Rules

This instruction system can be used to generate a small functional software
project from a shared project brief. The goal is a coherent working product,
not a code-similarity exercise and not identical source code across tools.

## Shared Inputs

Every supported tool must receive the same inputs:

- Generated tool adapter from `.agents/` canonical sources.
- The same project brief.
- The same domain boundaries.
- The same role roster.
- The same acceptance criteria.
- The same verification expectations.

## Expected Output

A generated project should include:

- A clear README with setup, run, test, and demo instructions.
- A small but functional implementation of the requested product behavior.
- Source structure that reflects the domain boundaries in the brief.
- Tests for the core user flows and risk-sensitive behavior.
- Minimal seed data or fixtures when useful for local demonstration.
- A final handoff that states assumptions, files changed, and checks run.

## Functional Consistency

Different tools may produce different implementations. They should still
converge on the same externally visible behavior:

- Same user-facing capabilities.
- Same public API or command contract, when specified.
- Same authorization and validation behavior.
- Same domain ownership rules.
- Same testable acceptance criteria.

## Project Brief Requirements

A project brief should define:

- Product goal.
- In-scope features.
- Out-of-scope features.
- Target users.
- Required domains.
- Acceptance criteria.
- Required commands for run, build, and test.
- Any non-negotiable technical constraints.

## Tool Independence

Do not add rules that depend on one model's private behavior. If a tool needs a
specific file location or format, express that through an adapter template while
keeping the underlying rule canonical and tool-agnostic.

### Security Rules

Agents must treat security-sensitive changes as high-friction work.

- Do not expose secrets, tokens, credentials, or customer data.
- Do not broaden permissions without explicit justification.
- Treat authentication, authorization, billing, PII, and audit logging as high-risk.
- Prefer least privilege for tools, services, and agent actions.
- Add or update tests when changing permission logic.
- Ask for a human security review when touching critical flows.

## Agent Tooling Boundaries

- Tools that execute commands must run in a controlled workspace.
- Destructive operations require explicit human approval.
- Network access should be limited to the task need.
- Generated code must not introduce hidden telemetry or data exfiltration.

### Testing Rules

Every agent handoff must describe verification.

- Run the narrowest relevant tests first.
- Add or update tests for changed behavior.
- Prefer deterministic tests over snapshot-only validation.
- If tests cannot be run, explain why and state the remaining risk.
- For cross-domain changes, run checks for each affected domain.

## Test Selection

- Local behavior change: run domain unit tests.
- Public API change: run contract or integration tests.
- Shared package change: run all direct consumer tests when feasible.
- Security-sensitive change: run security checks and request human review.

### Git Workflow

Agents must preserve developer work.

- Never revert user changes unless explicitly asked.
- Do not amend commits or rewrite history unless requested.
- Keep generated files in sync with their canonical sources.
- Generated files must include a "DO NOT EDIT" banner.
- Handoffs should list changed files and checks run.

## Generated Files

Generated files are build artifacts. If a generated file needs to change,
edit the source under `.agents/` and run:

```bash
npm run agents:generate
```

## Agent Roles

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

## Domain Index

### Billing

Domain id: `billing`
Owner team: Team Revenue
Risk level: high

Runtime paths:
- `apps/billing/**`
- `packages/billing-client/**`

Generated domain adapters:
- `apps/billing/AGENTS.md`
- `.github/instructions/billing.instructions.md`
- `.cursor/rules/billing-domain.mdc`

### Identity

Domain id: `identity`
Owner team: Team Platform
Risk level: critical

Runtime paths:
- `apps/identity/**`
- `packages/auth-client/**`

Generated domain adapters:
- `apps/identity/AGENTS.md`
- `.github/instructions/identity.instructions.md`
- `.cursor/rules/identity-domain.mdc`

### Frontend Platform

Domain id: `frontend`
Owner team: Team Experience
Risk level: medium

Runtime paths:
- `packages/ui/**`
- `apps/web/**`

Generated domain adapters:
- `packages/ui/AGENTS.md`
- `.github/instructions/frontend.instructions.md`
- `.cursor/rules/frontend-domain.mdc`

## Handoff Format

Every agent should finish with:

- Summary of the change.
- Files changed.
- Verification run.
- Risks, skipped checks, or handoff needs.
