# Motion & Animation System

## Philosophy

Motion exists to communicate:

- hierarchy
- progression
- relationships
- workflow
- transformation

Never animate simply because an animation library is available.

## Stack

### Framer Motion

Use for:

- component entrance
- hover states
- layout transitions
- modals
- drawers
- tabs
- accordions
- small interaction choreography

### GSAP + ScrollTrigger

Use for:

- scroll storytelling
- pinned sections
- advanced timelines
- horizontal storytelling
- progressive recruitment journey diagrams

### Lenis

Use only where smooth scrolling improves the experience. It must never interfere with native scrolling, accessibility or input behavior.

### CSS

Use CSS for:

- hover
- focus
- transforms
- simple transitions
- skeleton shimmer

## Motion tokens

Define:

- duration-fast
- duration-standard
- duration-slow
- ease-standard
- ease-emphasis
- stagger-small
- stagger-medium

## Reduced motion

When `prefers-reduced-motion: reduce` is enabled:

- disable nonessential parallax
- disable large scroll transforms
- reduce stagger
- remove decorative looping motion
- preserve state changes and information

## Performance

Do not animate layout-heavy properties when transform/opacity can achieve the same result.

Avoid dozens of simultaneous scroll triggers.

Clean up GSAP/ScrollTrigger instances on unmount.
