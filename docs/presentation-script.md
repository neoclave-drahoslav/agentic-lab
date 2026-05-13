# Presentation Script

## 1. Problem

Different agent tools read instructions from different locations. If teams edit
those locations directly, Claude, Codex, Cursor, Copilot, and internal agents
can drift.

In a multi-domain monorepo, drift also happens between teams: each team may add
local instructions, review expectations, and test rules in a different style.

## 2. Principle

Tool-specific instruction files should be generated adapters, not the source of
truth.

```text
.agents canonical sources -> generated adapters -> agent tools
```

The ownership model is centralized platform, decentralized domain ownership.

## 3. What We Standardize

- Global engineering rules.
- Security and testing policies.
- Domain boundaries and ownership.
- Reusable agent roles.
- Project generation expectations.
- Handoff and verification expectations.

## 4. What Domain Teams Own

Each domain team owns its own canonical instruction subtree:

- `domain.md` for responsibilities and boundaries.
- `ownership.md` for owner team, runtime paths, and reviewers.
- `testing.md` for required commands and coverage expectations.
- `agent-overrides.md` for domain-specific agent constraints.

## 5. Canonical Agent Roster

Every tool receives the same role definitions:

- Project Architect Agent.
- Implementation Agent.
- Test Agent.
- Review Agent.
- Integration Agent.

The tool is only the runtime. The role contract is canonical.

## 6. Generated Adapter Targets

- `CLAUDE.md` for Claude.
- `AGENTS.md` for Codex and compatible agent tools.
- `.cursor/rules/agentic-engineering.mdc` for Cursor.
- `.github/copilot-instructions.md` for GitHub Copilot repository-wide instructions.
- `.github/instructions/*.instructions.md` for GitHub Copilot path-specific instructions.
- domain-local `AGENTS.md` files for local context.

## 7. Demo

Run:

```bash
npm run agents:generate
npm run agents:check
```

Then show:

- `.agents/domains/billing/ownership.md`
- `.github/CODEOWNERS`
- `CLAUDE.md`
- `AGENTS.md`
- `.cursor/rules/agentic-engineering.mdc`
- `.github/copilot-instructions.md`
- `.github/instructions/billing.instructions.md`
- `apps/billing/AGENTS.md`

## 8. Functional Project Generation

The generated application does not need to live in this repository. A project
run should use the same external brief and the same generated instruction
adapter for each tool.

The success criterion is functional consistency: the same behavior, boundaries,
acceptance criteria, and verification discipline. The code does not need to be
identical.

## 9. Team Decision

The platform team owns the instruction build system. Domain teams own their
canonical domain instruction subtrees. CI verifies that generated adapters have
no manual drift.