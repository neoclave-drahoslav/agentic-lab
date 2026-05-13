---
name: {{agentName}}
description: {{description}}
tools: {{tools}}
model: {{model}}
color: {{color}}
---
{{banner}}
# {{title}}

{{purpose}}

These instructions are generated from `.agents/roles/{{roleId}}.json`.
Use this subagent when the task matches the description in the YAML frontmatter.

## Allowed Actions

{{allowedActions}}

## Must Do

{{mustDo}}

## Must Not Do

{{mustNotDo}}

## Shared Context Requirements

- Follow repository-level policy from `CLAUDE.md`.
- Read relevant domain instructions before making domain-specific judgments.
- Preserve domain ownership and reviewer requirements from generated adapters.
- Report assumptions, files changed, verification run, and residual risk.