# Antigravity Phase-by-Phase Build Plan

## PHASE 0 — Understand before coding

### Goal

Prevent Antigravity from starting with random pages.

### Read first

- Company Context
- Product Vision
- Information Architecture
- Route Map
- Content Strategy

### Output

A confirmed architecture and implementation checklist.

### Gate

Do not create page UI until the repository boundaries are understood.

---

## PHASE 1 — Repository and technical foundation

Create:

```text
frontend/website
frontend/auth
frontend/portals/{superadmin,employee,recruiter,employer,candidate}
frontend/shared
backend
```

Configure:

- TypeScript
- linting
- formatting
- environment variables
- aliases
- error boundaries
- route foundation
- API client foundation
- Git conventions

### Gate

All applications compile independently.

---

## PHASE 2 — Global design system

Build before pages:

- Manrope
- typography tokens
- color tokens
- spacing
- radii
- shadows
- breakpoints
- container system
- motion tokens
- accessibility tokens

### Gate

No page is allowed to introduce arbitrary design tokens.

---

## PHASE 3 — Foundation component library

Build and test:

- buttons
- links
- typography
- inputs
- forms
- cards
- badges
- dialogs
- drawers
- tables
- tabs
- accordion
- navigation
- footer
- loading/error/empty states

### Gate

Component playground/examples must demonstrate all variants.

---

## PHASE 4 — Advanced reusable website components

Build the 40 website components from the component specification.

Prioritize:

1. Hero
2. Solution cards
3. Industry cards
4. workflow
5. job cards
6. search/filter
7. case studies
8. proof
9. CTA
10. footer

Then build advanced storytelling components.

### Gate

Components must work with mock content before page integration.

---

## PHASE 5 — Motion system

Implement:

- Framer Motion presets
- GSAP helpers
- ScrollTrigger lifecycle
- Lenis integration if beneficial
- reduced-motion behavior
- hover/focus micro-interactions

### Gate

Motion must never break keyboard navigation or mobile scrolling.

---

## PHASE 6 — Five homepage concepts

Build all five directions using the same component library:

1. Premium Recruitment Platform
2. Human + Technology
3. Enterprise Recruitment
4. Editorial Premium
5. Conversion First

Do not duplicate foundational components.

Only composition, content hierarchy, visual treatment and motion storytelling should differ.

### Gate

Compare all five against:

- brand fit
- clarity
- employer conversion
- candidate usability
- accessibility
- performance
- responsiveness

Do not rewrite the design system to make one concept work.

---

## PHASE 7 — Public website pages

Implement in this order:

1. Header/navigation
2. Footer
3. Home
4. Solutions
5. Industries
6. Jobs index
7. Job detail
8. Employers
9. Candidates
10. Case studies
11. Insights
12. Resources
13. Locations
14. About
15. Contact
16. Legal

### Gate

All public routes functional, responsive and SEO-ready.

---

## PHASE 8 — Website QA and SEO

Complete:

- metadata
- sitemap
- robots
- schema
- internal linking
- image optimization
- accessibility audit
- responsive audit
- broken-link audit
- performance audit

### Gate

Public website is production-ready before portal UI begins.

---

## PHASE 9 — Authentication foundation

Build:

- login
- registration
- password reset
- verification
- session handling
- logout
- protected-route foundation
- role resolution
- permission resolution

### Gate

Unauthorized users cannot reach protected portal content.

---

## PHASE 10 — Portal shells

Build five independent shells:

- Super Admin
- Employee
- Recruiter
- Employer
- Candidate

Create:

- sidebar
- topbar
- breadcrumbs
- page header
- command/search pattern
- notification area
- profile menu
- responsive navigation

### Gate

No portal shell exposes another role's navigation.

---

## PHASE 11 — Core recruitment backend

Implement:

- users
- roles
- permissions
- organizations
- employers
- candidates
- employees
- jobs
- applications
- ATS
- interviews
- documents

Then connect the portal UI.

---

## PHASE 12 — CRM and operations

Implement:

- leads
- companies
- contacts
- opportunities
- activities
- pipeline
- tasks
- targets
- notifications
- reports

---

## PHASE 13 — Super Admin governance

Implement:

- role management
- permission management
- organization management
- audit logs
- system settings
- commercial foundation
- user lifecycle controls

---

## PHASE 14 — Security and integration QA

Test direct URL access, API manipulation, organization isolation, permission changes, documents, search, exports and bulk operations.

---

## PHASE 15 — Production readiness

Complete:

- environment configuration
- database indexes
- backups
- logging
- monitoring
- error tracking
- security headers
- rate limiting
- production build
- deployment
- UAT
- handover documentation

## Antigravity operating rule

At the end of every phase, Antigravity must report:

```text
Completed
Files created/changed
Routes added
Components added
APIs added
Tests completed
Known issues
Next phase
```

Never silently jump multiple phases.
