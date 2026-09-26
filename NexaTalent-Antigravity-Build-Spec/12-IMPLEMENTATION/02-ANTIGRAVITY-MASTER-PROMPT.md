# Antigravity Master Implementation Prompt

You are implementing NexaTalent, a production-grade recruitment and talent solutions platform.

## First instruction

Do not immediately build random pages.

Read all files under:

- `00-MASTER`
- `01-ARCHITECTURE`
- `02-DESIGN-SYSTEM`
- `03-COMPONENTS`
- `04-MOTION`
- `05-WEBSITE`
- `06-AUTH`
- `07-PORTALS`
- `08-BACKEND`
- `09-SECURITY`
- `10-SEO-CONTENT`
- `11-TESTING`
- `12-IMPLEMENTATION`

Then execute phases sequentially.

## Critical folder boundary

The frontend must contain three clearly separated surfaces:

```text
frontend/website
frontend/auth
frontend/portals
```

Within portals:

```text
frontend/portals/superadmin
frontend/portals/employee
frontend/portals/recruiter
frontend/portals/employer
frontend/portals/candidate
```

The backend is completely separate:

```text
backend
```

Do not mix public website pages with protected portal pages.

## Website-first rule

The public website must be built and validated before implementing detailed portal screens.

The design system and reusable component library must be built before page implementation.

## Architecture law

`Tokens → Primitives → Components → Patterns → Sections → Templates → Pages`

Never create one-off page UI when a reusable abstraction is appropriate.

## Security law

Frontend guards are not the security boundary. Backend authorization is mandatory.

Never fetch unrestricted data and filter it in the frontend.

Every protected resource must validate:

1. authentication
2. role
3. permission
4. organization scope
5. resource ownership/scope
6. response field visibility

## Quality law

Every feature requires:

- loading state
- empty state
- error state
- validation
- responsive behavior
- accessibility
- permission handling
- API integration where applicable
- tests

## Design law

Use Manrope and centralized design tokens. Keep the experience premium, modern and restrained. Avoid generic admin-template aesthetics, excessive gradients, excessive rounded cards, decorative animation and fake metrics.

## Motion law

Use Framer Motion for component-level motion, GSAP/ScrollTrigger for advanced scroll storytelling, Lenis only where justified, and CSS for simple micro-interactions. Respect reduced motion.

## Phase reporting

After each phase, report:

- completed work
- exact folders/files changed
- routes added
- components added
- APIs added
- tests run
- unresolved issues
- next phase

Do not silently skip or combine phases.
