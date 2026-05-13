# Mini Demo: Agent Instructions in a Monorepo

## The Problem

Different agentic tools read instructions from different locations. If teams
edit those files manually, behavior drifts over time:

- Claude gets different rules than Codex.
- Cursor gets outdated domain boundaries.
- Copilot gets generic repository guidance but misses domain-specific context.
- Local `AGENTS.md` files diverge from global policy.

The problem gets sharper when multiple teams contribute to different domains in
the same monorepo.

## The Model

Centralize the instruction platform and decentralize domain ownership:

```text
.agents/source/**            platform-owned global policy
.agents/roles/**             platform-owned agent roster
.agents/templates/**         platform-owned adapter formats
.agents/domains/billing/**   Team Revenue-owned domain context
.agents/domains/identity/**  Team Platform-owned domain context
.agents/domains/frontend/**  Team Experience-owned domain context
```

Tool-specific files are generated adapters:

```text
.agents/ canonical source
        -> generator
        -> CLAUDE.md, AGENTS.md, .cursor/rules/*.mdc,
           .github/copilot-instructions.md, .github/instructions/*.instructions.md
```

## What To Show The Team

1. Open `.agents/source/domain-ownership.md`.
2. Open `.agents/domains/billing/domain.md`.
3. Open `.agents/domains/billing/ownership.md`.
4. Open `.agents/domains/billing/testing.md`.
5. Open `.agents/domains/billing/agent-overrides.md`.
6. Show `.agents/config.json`, where domain metadata, reviewers, runtime paths, and adapter targets are registered.
7. Show `.github/CODEOWNERS` as the review enforcement layer.
8. Run:

```bash
npm run agents:generate
npm run agents:check
```

9. Show the generated files:

- `AGENTS.md` for Codex.
- `CLAUDE.md` for Claude.
- `.cursor/rules/agentic-engineering.mdc` for Cursor.
- `.github/copilot-instructions.md` for Copilot repository-wide instructions.
- `.github/instructions/billing.instructions.md` for Copilot path-specific Billing context.
- `apps/billing/AGENTS.md` for local Billing agent context.

## Key Message

This is not just documentation. It is a small build system for agent behavior.
Every tool receives the same agent roster, policies, domain boundaries, and
project-generation contract through its own native instruction file.

Each team can update its own domain instructions without manually editing every
agent-tool file.

## Proposed Team Rule

Humans edit only canonical sources under `.agents/**`.

Domain teams edit only their own `.agents/domains/<domain>/**` subtree.

Agentic tools read their native generated instruction locations.

CI verifies that generated files have no drift.