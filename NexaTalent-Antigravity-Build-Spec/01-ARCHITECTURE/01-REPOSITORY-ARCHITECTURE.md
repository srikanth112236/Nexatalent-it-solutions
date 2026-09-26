# Repository Architecture

## Target tree

```text
nexatalent-platform/
├── frontend/
│   ├── website/
│   │   ├── src/
│   │   │   ├── app/
│   │   │   ├── routes/
│   │   │   ├── pages/
│   │   │   ├── sections/
│   │   │   ├── components/
│   │   │   ├── content/
│   │   │   ├── seo/
│   │   │   └── styles/
│   │   └── public/
│   ├── auth/
│   │   └── src/
│   ├── portals/
│   │   ├── superadmin/
│   │   ├── employee/
│   │   ├── recruiter/
│   │   ├── employer/
│   │   └── candidate/
│   └── shared/
│       ├── design-system/
│       ├── primitives/
│       ├── hooks/
│       ├── utils/
│       ├── types/
│       └── constants/
│
├── backend/
│   ├── src/
│   │   ├── app/
│   │   ├── config/
│   │   ├── database/
│   │   ├── auth/
│   │   ├── rbac/
│   │   ├── middleware/
│   │   ├── modules/
│   │   │   ├── users/
│   │   │   ├── employees/
│   │   │   ├── employers/
│   │   │   ├── candidates/
│   │   │   ├── jobs/
│   │   │   ├── applications/
│   │   │   ├── ats/
│   │   │   ├── talent-pool/
│   │   │   ├── interviews/
│   │   │   ├── crm/
│   │   │   ├── tasks/
│   │   │   ├── targets/
│   │   │   ├── documents/
│   │   │   ├── notifications/
│   │   │   └── reports/
│   │   ├── services/
│   │   ├── storage/
│   │   └── jobs/
│   └── tests/
│
└── docs/
```

## Boundary rule

Website code must not import portal implementation files.

Portal code must not import website page components.

Shared code must contain only genuinely reusable primitives, types, tokens and utilities — never business-specific page sections.

Backend is a separate deployable application.

## Environment separation

Use independent environment variables for:

- frontend API URL
- authentication configuration
- storage
- database
- email
- secrets
- analytics

Never commit secrets.
