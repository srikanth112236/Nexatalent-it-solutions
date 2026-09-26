# NexaTalent Global Design System

## Goal

Create one premium visual language that works across the public website and authenticated portals without making them look identical.

## Typography

Primary font: **Manrope**.

Suggested hierarchy:

- Display: 64–88px desktop, fluid down to 42–52px mobile
- H1: 48–64px
- H2: 36–48px
- H3: 24–32px
- Body: 16–18px
- Small: 13–14px

Use `clamp()` for fluid marketing typography.

## Color tokens

Create semantic tokens rather than hard-coded colors:

```text
--color-bg
--color-surface
--color-surface-raised
--color-text
--color-text-muted
--color-border
--color-primary
--color-primary-hover
--color-accent
--color-success
--color-warning
--color-danger
--color-info
```

The final palette must be centralized in one token file.

## Spacing

Use a predictable spacing scale rather than arbitrary margins.

Example base scale: 4 / 8 / 12 / 16 / 24 / 32 / 48 / 64 / 80 / 96 / 120.

## Radius

Use a restrained radius system:

- small controls
- medium cards
- large feature surfaces
- pill only where semantically appropriate

Avoid making every element a pill.

## Layout

Use:

- max-width containers
- CSS grid
- flexbox
- fluid spacing
- intentional whitespace

## Responsive breakpoints

Use semantic breakpoints rather than designing for one device model.

Minimum targets:

- mobile
- tablet
- desktop
- wide desktop

## Accessibility

Target WCAG 2.2 AA.

Required:

- keyboard navigation
- visible focus states
- semantic headings
- label/input relationships
- accessible dialogs
- accessible forms
- contrast compliance
- reduced-motion support
- minimum touch target sizing
- screen-reader-friendly status messages

## Visual principle

Premium does not mean decorative. Hierarchy, typography, spacing and information clarity create the premium feel.
