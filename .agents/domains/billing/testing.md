# Billing Testing

Required commands:

- `npm run test -- --scope=billing`
- `npm run lint -- --scope=billing`

## Required Coverage

- Free, paid, cancelled, expired, and retrying subscription states.
- Idempotent payment provider callbacks.
- Refund and reconciliation edge cases.
- Revenue event schema compatibility.