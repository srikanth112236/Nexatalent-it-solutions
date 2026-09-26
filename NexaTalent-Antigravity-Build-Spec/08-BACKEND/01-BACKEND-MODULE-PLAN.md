# Backend Module Plan

## Core modules

```text
auth
users
roles
permissions
organizations
employees
employers
companies
contacts
leads
opportunities
requirements
jobs
candidates
applications
ats
talent-pool
interviews
tasks
targets
documents
notifications
reports
audit-logs
settings
commercial
```

## Module responsibility

Each module owns its validation, service logic, persistence and authorization integration.

## API grouping

```text
/api/v1/auth
/api/v1/users
/api/v1/employees
/api/v1/employers
/api/v1/candidates
/api/v1/jobs
/api/v1/applications
/api/v1/ats
/api/v1/talent-pool
/api/v1/interviews
/api/v1/crm
/api/v1/tasks
/api/v1/targets
/api/v1/documents
/api/v1/notifications
/api/v1/reports
/api/v1/admin
```

## List endpoint contract

Every list endpoint should support, where relevant:

- pagination
- search
- filtering
- sorting
- field selection
- authorization scope

## Mutation contract

Validate → Authorize → Execute → Audit → Return sanitized response.

## Sensitive operations

Audit at minimum:

- role changes
- permission changes
- user creation/deactivation
- candidate data access where required
- document operations
- exports
- bulk actions
- employer access changes
- administrative configuration
