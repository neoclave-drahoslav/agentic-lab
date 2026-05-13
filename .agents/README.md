# Agent Instruction Sources

This directory is the canonical source of truth for agent instructions.

Edit these files:

- `source/*.md` for global policies and functional project generation rules.
- `domains/<domain>/*.md` for team-owned domain-specific context.
- `roles/*.json` for the canonical tool-independent agent roster.
- `templates/*.tpl` for tool-specific adapter formats.
- `config.json` for adapter targets, role registration, domain metadata, and ownership mapping.

## Ownership Model

The platform or architecture group owns global instruction infrastructure:

- `.agents/source/**`
- `.agents/roles/**`
- `.agents/templates/**`
- `scripts/agents.mjs`

Domain teams own their own subtrees:

- `.agents/domains/billing/**` -> Team Revenue.
- `.agents/domains/identity/**` -> Team Platform.
- `.agents/domains/frontend/**` -> Team Experience.

Each domain subtree must contain:

- `domain.md` for responsibilities and boundaries.
- `ownership.md` for owner team, runtime paths, source paths, and reviewers.
- `testing.md` for required commands and coverage expectations.
- `agent-overrides.md` for domain-specific agent constraints.

The demo `.github/CODEOWNERS` file shows how these ownership boundaries can be
mapped to review requirements.

## Canonical Role Roster

- Project Architect Agent.
- Implementation Agent.
- Test Agent.
- Review Agent.
- Integration Agent.

Generated targets include:

- `CLAUDE.md`.
- `AGENTS.md`.
- `.cursor/rules/agentic-engineering.mdc`.
- `.github/copilot-instructions.md`.
- `.github/instructions/*.instructions.md`.
- domain-local `AGENTS.md` files.

Do not edit generated adapter files directly. Regenerate them with:

```bash
npm run agents:generate
```

All supported tools should receive the same generated rules through their native
instruction location.