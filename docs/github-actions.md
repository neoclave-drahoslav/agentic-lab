# GitHub Actions Setup

This repository includes a workflow that validates generated agent instruction
files in pull requests, pushes to `main` or `master`, and manual runs.

Workflow file:

```text
.github/workflows/agent-instructions.yml
```

## What The Workflow Checks

1. Installs dependencies with `npm ci`.
2. Runs `npm run agents:check` to verify generated adapters match canonical sources.
3. Runs `npm run agents:generate`.
4. Runs `git diff --exit-code` to fail if generation changed tracked files.

If the workflow fails, the fix is usually:

```bash
npm run agents:generate
npm run agents:check
git add .
git commit -m "Regenerate agent instructions"
```

## How To Test In A Private GitHub Repository

1. Create a private GitHub repository.
2. Push this project to it.
3. Open the Actions tab and run `Agent Instructions` manually with
   `workflow_dispatch`, or open a pull request that changes `.agents/**`.
4. Confirm that the workflow passes.
5. To test failure behavior, edit a generated file such as `AGENTS.md` directly
   and open a PR. The workflow should fail and ask you to regenerate adapters.

## Recommended PR Process

1. Edit canonical sources under `.agents/**`.
2. Run `npm run agents:generate` locally.
3. Run `npm run agents:check` locally.
4. Commit both canonical source changes and generated adapter changes.
5. Open a PR.

Generated adapters stay tracked in git so agent tools can read instructions
immediately after checkout.