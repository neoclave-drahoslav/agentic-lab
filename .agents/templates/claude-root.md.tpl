{{banner}}
# {{title}}

{{notes}}

## Operating Model

This file is generated from the canonical instruction source in `.agents/`.
If a rule is wrong, edit the source file and regenerate adapters.

Claude Code project subagents are generated separately under `.claude/agents/`.
Use those subagents for role-specific work instead of treating this file as one
large role definition.

## Available Claude Code Subagents

{{claudeAgentSummary}}

## Global Policies

{{globalSections}}

## Domain Index

{{domainIndex}}

## Handoff Format

Every agent should finish with:

- Summary of the change.
- Files changed.
- Verification run.
- Risks, skipped checks, or handoff needs.