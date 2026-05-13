# Adoption Guide

Use this guide to move the instruction build system into a real repository.

## 1. Copy The Infrastructure

Copy these files and directories into the target repository:

```text
.agents/
scripts/agents.mjs
package.json scripts or equivalent package-manager commands
.github/workflows/agent-instructions.yml
```

If the target repository already has a `package.json`, merge only the scripts:

```json
{
  "scripts": {
    "agents:generate": "node scripts/agents.mjs",
    "agents:check": "node scripts/agents.mjs --check",
    "agents:validate": "node scripts/agents.mjs --validate"
  }
}
```

## 2. Replace Demo Domains

Edit `.agents/config.json` and replace the demo domains with real domains from
your monorepo.

For each domain, define:

- `id` and `name`.
- `ownerTeam`.
- `ownerPaths` for canonical instruction ownership.
- `runtimePaths` for code owned by the domain.
- `reviewers` for required PR review.
- `testCommands` for verification.
- Generated targets for local `AGENTS.md`, Copilot instructions, and Cursor rules.

## 3. Create Domain Instruction Sources

Each domain should have this structure:

```text
.agents/domains/<domain>/
  domain.md
  ownership.md
  testing.md
  agent-overrides.md
```

Keep these files short and owned by the domain team. Global policy belongs in
`.agents/source/**`; domain-specific risk and boundaries belong in the domain
subtree.

## 4. Update Team Ownership

Edit `.github/CODEOWNERS` and replace demo handles such as
`@platform-architecture`, `@team-revenue`, and `@team-platform` with real GitHub
teams.

Recommended ownership model:

```text
.agents/source/**      platform or architecture team
.agents/roles/**       platform or architecture team
.agents/templates/**   platform or architecture team
.agents/domains/*/**   owning domain team
runtime domain paths   owning domain team
```

## 5. Generate And Commit Adapters

Run:

```bash
npm run agents:validate
npm run agents:generate
npm run agents:check
```

Commit both canonical sources and generated outputs. Generated outputs stay
tracked so tools can read instructions immediately after checkout.

## 6. Enable CI

Push the workflow and open a pull request. The workflow runs:

```bash
npm ci
npm run agents:validate
npm run agents:check
npm run agents:generate
git diff --exit-code
```

The PR should fail if:

- `.agents/config.json` is invalid.
- A generated file is missing or stale.
- An old generated file remains after a domain, role, or adapter is removed.
- Running the generator changes tracked files.

## 7. Add A New Domain Later

1. Add `.agents/domains/<domain>/*.md`.
2. Add the domain entry to `.agents/config.json`.
3. Add Copilot and Cursor domain target entries if needed.
4. Update `.github/CODEOWNERS`.
5. Run `npm run agents:generate` and `npm run agents:check`.
6. Commit canonical and generated changes in the same PR.

## 8. Remove A Domain Safely

1. Remove the domain from `.agents/config.json`.
2. Remove its `.agents/domains/<domain>` source folder.
3. Run `npm run agents:generate`.
4. Run `npm run agents:check`.
5. Delete any stale generated files reported by the check.
6. Commit the cleanup.

## 9. Junior-Friendly Sanity Check

Before asking for review, run:

```bash
npm run agents:validate
npm run agents:generate
npm run agents:check
```

Then inspect:

- `AGENTS.md`.
- `CLAUDE.md` and `.claude/agents/*.md`.
- `.cursor/rules/*.mdc`.
- `.github/copilot-instructions.md` and `.github/instructions/*.instructions.md`.
- One domain-local `AGENTS.md`.