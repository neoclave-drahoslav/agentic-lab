# Global Engineering Rules

These rules apply to every agent, tool, and domain.

- All agent tools must work from generated adapters derived from the same `.agents/` canonical sources.
- Treat tool-specific files as adapters, not as independent sources of truth.
- Use the canonical role roster consistently: Architect, Implementer, Tester, Reviewer, and Integrator.
- Read the relevant domain context before editing files.
- Keep changes scoped to the requested behavior.
- Prefer existing repo patterns over new abstractions.
- Do not rewrite unrelated code while implementing a task.
- State assumptions when the request is ambiguous.
- Report changed files and verification steps in the handoff.

## Default Workflow

1. Understand the project brief and identify the owning domains.
2. Use the Architect role to define the implementation shape and acceptance criteria.
3. Use the Implementer role to make the smallest coherent change.
4. Use the Tester role to add or run verification for required behavior.
5. Use the Reviewer role to inspect risk, boundaries, and missing coverage.
6. Use the Integrator role to confirm the project works as one functional whole.
7. Summarize what changed, what was verified, and any residual risk.
