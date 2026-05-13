# Security Rules

Agents must treat security-sensitive changes as high-friction work.

- Do not expose secrets, tokens, credentials, or customer data.
- Do not broaden permissions without explicit justification.
- Treat authentication, authorization, billing, PII, and audit logging as high-risk.
- Prefer least privilege for tools, services, and agent actions.
- Add or update tests when changing permission logic.
- Ask for a human security review when touching critical flows.

## Agent Tooling Boundaries

- Tools that execute commands must run in a controlled workspace.
- Destructive operations require explicit human approval.
- Network access should be limited to the task need.
- Generated code must not introduce hidden telemetry or data exfiltration.

