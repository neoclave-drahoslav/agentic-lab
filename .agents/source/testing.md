# Testing Rules

Every agent handoff must describe verification.

- Run the narrowest relevant tests first.
- Add or update tests for changed behavior.
- Prefer deterministic tests over snapshot-only validation.
- If tests cannot be run, explain why and state the remaining risk.
- For cross-domain changes, run checks for each affected domain.

## Test Selection

- Local behavior change: run domain unit tests.
- Public API change: run contract or integration tests.
- Shared package change: run all direct consumer tests when feasible.
- Security-sensitive change: run security checks and request human review.

