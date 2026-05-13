# Frontend Platform Domain

The frontend platform domain owns shared UI components, design tokens,
accessibility patterns, and cross-product interaction conventions.

## Responsibilities

- Shared UI components and composition patterns.
- Design tokens and visual consistency.
- Accessibility behavior.
- Cross-product frontend developer experience.

## Boundaries

- Shared components must remain backward compatible by default.
- Accessibility is part of done, not a follow-up.
- Visual changes should avoid layout shift and text overflow.
- Domain product logic should not move into generic UI primitives.