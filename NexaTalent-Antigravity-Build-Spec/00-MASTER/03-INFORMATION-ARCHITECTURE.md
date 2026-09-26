# Information Architecture

## Product surfaces

```text
NexaTalent
├── Public Website
├── Authentication
└── Protected Platform
    ├── Super Admin
    ├── Employee
    ├── Recruiter
    ├── Employer
    └── Candidate
```

## Website primary navigation

For Employers | For Candidates | Solutions | Industries | Jobs | Insights | About | Contact

Header CTAs: Hire Talent | Find Jobs | Login

## Employer journey

Website → Solution → Hiring Need → Submit Requirement → CRM Lead → Requirement → Job → Candidate Review → Shortlist → Interview → Feedback → Offer → Joining

## Candidate journey

Website → Jobs → Job Detail → Register/Login → Profile → Resume → Apply → Screening → ATS → Interview → Offer → Joining

## Recruiter journey

Dashboard → Jobs → Talent Pool → Candidate → Screening → ATS → Interview → Employer Submission → Feedback → Offer → Joined

## CRM journey

Lead → Company → Contact → Opportunity → Client → Requirement → Job → Candidates → Interviews → Placement

## Shared domain entities

User, Role, Permission, Organization, Employee, Employer, Candidate, Company, Contact, Lead, Opportunity, Requirement, Job, Application, ATS Stage, Interview, Document, Task, Target, Notification, Report, Audit Event.

## Security visibility

| Role | Data boundary |
|---|---|
| Super Admin | Platform-wide according to permission |
| Employee | Internal authorized scope |
| Recruiter | Authorized recruitment scope |
| Employer | Own organization |
| Candidate | Own records |

## Navigation rule

Navigation must be generated from route metadata and permissions. Do not duplicate authorization logic across sidebars.

## Component hierarchy

`Design Tokens → Primitives → Components → Patterns → Sections → Templates → Pages`

## Mobile rule

Complex tables become cards/expandable rows; filters become drawers; secondary actions move into menus; primary tasks remain immediately accessible.
