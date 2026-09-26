# Authentication Specification

## Authentication flow

```text
Login
↓
Validate credentials
↓
Create secure session/token
↓
Resolve user
↓
Resolve roles
↓
Resolve permissions
↓
Resolve organization scope
↓
Redirect to authorized portal
```

## Requirements

- secure password handling
- session expiry
- logout
- password reset
- account verification
- account deactivation
- rate limiting
- brute-force protection
- secure cookies/token handling
- server-side authorization

## Redirect rules

Super Admin → `/superadmin`
Employee → `/employee`
Recruiter → `/recruiter`
Employer → `/employer`
Candidate → `/candidate`

If a user has multiple roles, resolve the active role through a controlled account/role-selection flow rather than guessing.

## Security principle

Authentication proves identity.

Authorization proves what that identity may do.

Do not confuse the two.
