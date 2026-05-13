# Git Workflow

Agents must preserve developer work.

- Never revert user changes unless explicitly asked.
- Do not amend commits or rewrite history unless requested.
- Keep generated files in sync with their canonical sources.
- Generated files must include a "DO NOT EDIT" banner.
- Handoffs should list changed files and checks run.

## Generated Files

Generated files are build artifacts. If a generated file needs to change,
edit the source under `.agents/` and run:

```bash
npm run agents:generate
```

