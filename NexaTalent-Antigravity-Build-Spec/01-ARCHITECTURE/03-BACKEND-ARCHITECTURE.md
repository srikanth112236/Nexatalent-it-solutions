# Backend Architecture

## Application layers

```text
HTTP Route
↓
Authentication Middleware
↓
Authorization / Permission Middleware
↓
Organization / Resource Scope
↓
Controller
↓
Service
↓
Repository / Model
↓
MongoDB
```

## Module structure

Each business module should follow:

```text
module/
├── module.routes.ts
├── module.controller.ts
├── module.service.ts
├── module.repository.ts
├── module.model.ts
├── module.schema.ts
├── module.types.ts
└── module.test.ts
```

## Business modules

Users, Employees, Employers, Candidates, Companies, Contacts, Leads, Opportunities, Requirements, Jobs, Applications, ATS, Talent Pool, Interviews, Documents, Tasks, Targets, Notifications and Reports.

## API principles

- Version APIs.
- Validate every input.
- Return consistent error structures.
- Paginate list endpoints.
- Never expose private fields accidentally.
- Apply authorization before database result exposure.
- Log sensitive administrative operations.
- Avoid N+1 queries.
- Use indexes for common filters.

## Resource scope

Every resource should declare ownership/scope requirements where applicable.

Example:

```text
Employer → organizationId
Candidate → candidateId / privacy scope
Job → organizationId + assigned recruiter scope
Document → owner + organization + permission
```

## Database principles

Use MongoDB/Mongoose with:

- schema validation
- timestamps
- indexes
- references where useful
- soft deletion for critical records
- normalized sensitive relationships
- explicit audit fields
