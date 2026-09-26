# Frontend Architecture

## Website application

The website is an independent application surface with:

- public routes
- SEO metadata
- marketing content
- jobs
- resources
- forms
- public API consumption

It must not know portal internals.

## Auth application

Authentication is separated conceptually and structurally from marketing pages.

Responsibilities:

- login
- registration
- password recovery
- account verification
- session handling
- redirect to correct portal

## Portal architecture

Each portal has its own shell and route namespace but shares the same design-system foundation.

```text
portals/
├── superadmin/
├── employee/
├── recruiter/
├── employer/
└── candidate/
```

## Shared layer

Contains:

- tokens
- buttons
- inputs
- dialogs
- tables
- badges
- typography primitives
- form primitives
- loading states
- error states
- responsive utilities
- permission helpers

It must not contain role-specific business logic.

## State strategy

Separate:

1. server state
2. session/auth state
3. UI state
4. form state

Avoid one global store containing every API response.

## Data fetching

Use typed service functions.

Pages should not manually construct fetch requests everywhere.

Example:

```text
api/
  jobs.api.ts
  candidates.api.ts
  interviews.api.ts
```

## Error handling

Every API-driven page must support:

- loading
- empty
- success
- partial data
- validation error
- unauthorized
- forbidden
- not found
- server error
- retry

## Component rule

A component should have one clear responsibility and should remain easy to test and reuse.
