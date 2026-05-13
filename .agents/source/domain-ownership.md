# Domain Ownership Rules

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