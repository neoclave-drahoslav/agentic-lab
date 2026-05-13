---
applyTo: "{{applyTo}}"
---
{{banner}}
# {{domainName}} Copilot Instructions

These path-specific instructions are generated from `.agents/` canonical sources
and apply when GitHub Copilot works on `{{applyTo}}`.

## Domain Ownership

Owner team: {{ownerTeam}}

Runtime paths:
{{runtimePaths}}

Instruction source paths:
{{ownerPaths}}

Required reviewers:
{{reviewers}}

## Required Global Policies

{{globalSummary}}

## Domain Context

{{domainSection}}

## Relevant Roles

{{roleSections}}

## Required Verification

{{testCommands}}

## Handoff Format

- What changed in this path scope.
- Which commands were run.
- Whether cross-domain review is needed.