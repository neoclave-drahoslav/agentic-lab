# Functional Project Generation Rules

This instruction system can be used to generate a small functional software
project from a shared project brief. The goal is a coherent working product,
not a code-similarity exercise and not identical source code across tools.

## Shared Inputs

Every supported tool must receive the same inputs:

- Generated tool adapter from `.agents/` canonical sources.
- The same project brief.
- The same domain boundaries.
- The same role roster.
- The same acceptance criteria.
- The same verification expectations.

## Expected Output

A generated project should include:

- A clear README with setup, run, test, and demo instructions.
- A small but functional implementation of the requested product behavior.
- Source structure that reflects the domain boundaries in the brief.
- Tests for the core user flows and risk-sensitive behavior.
- Minimal seed data or fixtures when useful for local demonstration.
- A final handoff that states assumptions, files changed, and checks run.

## Functional Consistency

Different tools may produce different implementations. They should still
converge on the same externally visible behavior:

- Same user-facing capabilities.
- Same public API or command contract, when specified.
- Same authorization and validation behavior.
- Same domain ownership rules.
- Same testable acceptance criteria.

## Project Brief Requirements

A project brief should define:

- Product goal.
- In-scope features.
- Out-of-scope features.
- Target users.
- Required domains.
- Acceptance criteria.
- Required commands for run, build, and test.
- Any non-negotiable technical constraints.

## Tool Independence

Do not add rules that depend on one model's private behavior. If a tool needs a
specific file location or format, express that through an adapter template while
keeping the underlying rule canonical and tool-agnostic.
