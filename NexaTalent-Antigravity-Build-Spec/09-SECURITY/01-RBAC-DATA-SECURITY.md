# RBAC, Permission and Data Security

## Permission format

Use granular permissions:

```text
users.view
users.create
users.edit
users.deactivate
employees.view
employees.create
employers.view
employers.create
candidates.view
candidates.create
jobs.view
jobs.create
jobs.publish
ats.view
ats.move
interviews.view
interviews.create
crm.view
crm.create
reports.view
documents.view
documents.download
settings.manage
```

## Authorization layers

```text
Frontend route guard
↓
Frontend feature guard
↓
API authentication
↓
API permission check
↓
Organization scope
↓
Resource ownership/scope
↓
Field/data sanitization
```

## Critical rule

Frontend authorization is a UX layer. Backend authorization is the security boundary.

## Never

- fetch all candidates and hide some in React
- trust IDs from the URL
- expose another employer's candidates
- return private candidate fields unnecessarily
- allow a user to modify data because a button was hidden
- expose protected documents through public URLs

## Documents

Protected documents should use authenticated authorization and temporary/signed access where appropriate.

## Audit event

```ts
{
  actorId,
  actorRole,
  action,
  resourceType,
  resourceId,
  organizationId,
  timestamp,
  metadata
}
```

## Organization isolation

Employer users must be scoped to their organization.

Cross-organization access must be rejected even when a valid resource ID is supplied.
