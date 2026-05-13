# Billing Domain

The billing domain owns invoices, subscriptions, payment state, and revenue
events. It is a high-risk domain because mistakes can charge customers
incorrectly or break financial reporting.

## Responsibilities

- Plan, subscription, invoice, refund, and payment state.
- Revenue event publication.
- Payment provider integration state.
- Billing-facing audit signals.

## Boundaries

- Billing code may publish revenue events but must not own identity decisions.
- Currency arithmetic must use decimal-safe helpers.
- Payment provider integrations must remain idempotent.
- Refund, retry, and reconciliation flows require tests.