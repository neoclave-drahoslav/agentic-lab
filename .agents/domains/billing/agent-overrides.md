# Billing Agent Overrides

- Treat every payment-state mutation as high risk.
- Do not introduce floating-point currency calculations.
- Do not change invoice or revenue event schemas without calling out the
  compatibility impact.
- If a task touches identity, entitlements, or audit semantics, request
  cross-domain review in the handoff.