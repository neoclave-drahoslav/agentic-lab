# Agent Instruction Lab

Small demo project for managing agent instructions in a multi-domain monorepo.

The core idea:

```text
canonical sources in .agents/
        -> generated tool adapters
        -> Claude, Codex, Cursor, Copilot, and domain-local agents
```

Humans edit only `.agents/**` source files. Tool-specific files such as
`CLAUDE.md`, `AGENTS.md`, `.cursor/rules/*.mdc`, and
`.github/copilot-instructions.md` are generated outputs.

## Quick Start

```bash
npm run agents:generate
npm run agents:check
```

## What This Demonstrates

- One canonical place for global engineering rules.
- One canonical roster of tool-independent agents.
- Domain-specific context for a monorepo.
- Decentralized ownership where each team owns its own domain instructions.
- Generated adapters for different agent tools.
- GitHub Copilot repository-wide and path-specific instructions.
- Drift detection suitable for CI.
- A shared contract for generating a functional project from the same brief.

## Canonical Agent Roster

Every tool receives the same roles through its generated adapter:

- Project Architect Agent.
- Implementation Agent.
- Test Agent.
- Review Agent.
- Integration Agent.

The tool is only the runtime. The role contract is the source of consistency.

## Multi-Team Domain Ownership

Global rules, role definitions, templates, and the generator are owned by the
platform or architecture group. Domain teams own only their own instruction
subtree:

```text
.agents/domains/billing/**   -> Team Revenue
.agents/domains/identity/**  -> Team Platform
.agents/domains/frontend/**  -> Team Experience
```

Each domain subtree contains:

```text
domain.md          responsibilities and boundaries
ownership.md       owner team, runtime paths, reviewers
testing.md         required commands and coverage expectations
agent-overrides.md domain-specific constraints for agents
```

The generated adapters include both global policy and the relevant domain-owned
context, so every tool sees the same rules without every team editing every tool
file.

## Generated Adapter Targets

- `CLAUDE.md` for Claude.
- `AGENTS.md` for Codex and agent-compatible tools.
- `.cursor/rules/agentic-engineering.mdc` for Cursor.
- `.github/copilot-instructions.md` for GitHub Copilot repository-wide instructions.
- `.github/instructions/*.instructions.md` for GitHub Copilot path-specific domain instructions.
- `apps/*/AGENTS.md` and `packages/*/AGENTS.md` for domain-local agent context.

## Demo Flow

1. Show `.agents/source`, `.agents/roles`, and `.agents/domains/<domain>`.
2. Open `.agents/domains/billing/ownership.md` to show team-owned domain metadata.
3. Open `.github/CODEOWNERS` to show review ownership for instruction sources and runtime paths.
4. Run `npm run agents:generate`.
5. Open `CLAUDE.md`, `AGENTS.md`, `.cursor/rules/agentic-engineering.mdc`, and `.github/copilot-instructions.md`.
6. Open `.github/instructions/billing.instructions.md` and `apps/billing/AGENTS.md` to show path/domain-aware local context.
7. Edit a generated file manually.
8. Run `npm run agents:check` and show the drift failure.
9. Re-run `npm run agents:generate` to restore generated outputs.

Use `docs/team-demo.md` as the short team-facing talk track.

## Using This To Generate A Project

This repository does not contain the generated application. Instead, it defines
the instruction layer that each tool should consume before generating one.

A project generation run should use:

- The generated adapter for the tool being used.
- The same external project brief.
- The same canonical role roster.
- The same domain boundaries and acceptance criteria.

The expected result is functional consistency, not byte-for-byte identical code.


## GitHub Actions

The repository includes a validation workflow at `.github/workflows/agent-instructions.yml`.
It runs on pull requests, pushes to `main` or `master`, and manual dispatch.
See `docs/github-actions.md` for setup and test instructions.

## CI Validation

The included GitHub Actions workflow validates generated instruction files with
this sequence:

```bash
npm ci
npm run agents:check
npm run agents:generate
git diff --exit-code
```

`agents:check` fails fast when generated adapters are missing or out of sync.
The generate + diff step proves the generator is reproducible and that the PR
includes every generated file that should change.

For normal development, the expected PR flow is:

```bash
npm run agents:generate
npm run agents:check
git add .
git commit -m "Update agent instructions"
```

The key rule is simple: canonical source changes and generated adapter changes
belong in the same PR. If generated adapters drift from canonical sources, the
build should fail.
