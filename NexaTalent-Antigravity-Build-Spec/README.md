# NexaTalent — Antigravity Master Build Specification

## Mission

Build NexaTalent as a production-grade recruitment technology platform with a premium public website and separate authenticated experiences for Super Admin, Employees, Recruiters, Employers and Candidates.

**Implementation priority: Website first.** Portals and backend are architected now, but website delivery must be completed and validated before portal implementation begins.

## Non-negotiable architecture

```text
nexatalent-platform/
├── frontend/
│   ├── website/                 # PUBLIC ONLY — SEO + marketing + jobs + resources
│   ├── auth/                    # LOGIN/REGISTER/RESET/VERIFY ONLY
│   ├── portals/                 # PROTECTED ONLY
│   │   ├── superadmin/
│   │   ├── employee/
│   │   ├── recruiter/
│   │   ├── employer/
│   │   └── candidate/
│   └── shared/                  # Tokens, primitives, utilities, shared contracts
│
├── backend/                     # Separate Node/TypeScript application
│   ├── src/
│   │   ├── config/
│   │   ├── database/
│   │   ├── auth/
│   │   ├── rbac/
│   │   ├── middleware/
│   │   ├── modules/
│   │   ├── services/
│   │   ├── storage/
│   │   ├── jobs/
│   │   └── app/
│   └── tests/
│
└── docs/
```

## Technology baseline

Frontend: React + Vite + TypeScript.
Backend: Node.js + TypeScript + Express-style modular API architecture.
Database: MongoDB + Mongoose.
Styling: SCSS/CSS variables or a tokenized styling layer.
Motion: Framer Motion, GSAP/ScrollTrigger, Lenis where justified.

## Build law

`Tokens → Primitives → Components → Patterns → Sections → Templates → Pages → Portals`

Never reverse this dependency direction.

## Current scope

Included: public responsive website, SEO pages, job discovery, authentication foundation, responsive protected portals, ATS/CRM/recruitment workflows, RBAC, reporting, documents, notifications and admin governance.

Future: agency partner ecosystem, AI matching/copilot, advanced enterprise integrations and native mobile applications.
