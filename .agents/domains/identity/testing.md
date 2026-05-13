# Identity Testing

Required commands:

- `npm run test -- --scope=identity`
- `npm run security:check -- --scope=identity`

## Required Coverage

- Positive and negative authorization paths.
- Tenant isolation behavior.
- Session compatibility and token lifecycle behavior.
- Audit event emission for privilege and access changes.