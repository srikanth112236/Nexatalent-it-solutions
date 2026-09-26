# Git & Commit Conventions

## Branching Strategy

- `main`: Production-ready release branch.
- `develop`: Integration branch for active phases.
- `feature/<phase-number>-<feature-name>`: Scoped feature branch (e.g. `feature/phase-02-design-system`).
- `fix/<issue-name>`: Bug fixes and security patches.

## Commit Message Format

Follow Conventional Commits specification:

```text
<type>(<scope>): <subject>

[optional body]

[optional footer(s)]
```

### Types
- `feat`: A new feature or component
- `fix`: A bug fix
- `docs`: Documentation updates or specs
- `style`: Formatting, missing semi-colons, no code change
- `refactor`: Refactoring production code without changing behavior
- `test`: Adding or updating tests
- `chore`: Maintenance, dependencies, build scripts

### Scopes
- `website`: Public website application
- `auth`: Identity & auth gateway
- `portals/superadmin`: Super Admin console
- `portals/employee`: Employee portal
- `portals/recruiter`: Recruiter workspace
- `portals/employer`: Employer portal
- `portals/candidate`: Candidate portal
- `shared`: Design system, primitives, utilities, contracts
- `backend`: Backend API, modules, database
- `root`: Root configuration, workspaces
