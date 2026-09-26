# Protected Portal Architecture

## Portal rule

Portals are separate from the public website even when they reuse visual primitives.

## Shared portal shell

```text
PortalShell
├── Sidebar
├── Topbar
├── Breadcrumbs
├── PageHeader
├── NotificationCenter
├── UserMenu
└── MainContent
```

Each portal may customize navigation and dashboard composition.

## Super Admin

Modules:

- Dashboard
- Users
- Employees
- Recruiters
- Employers
- Candidates
- Jobs
- Talent Pool
- ATS
- Interviews
- CRM
- Tasks
- Targets
- Documents
- Notifications
- Reports
- Analytics
- Organizations
- Roles
- Permissions
- Audit Logs
- Commercial
- Settings

## Employee

Permission-driven access to recruitment, CRM, tasks, targets, documents and reports.

## Recruiter

Dashboard, Jobs, Candidates, Talent Pool, ATS, Interviews, Tasks, Targets, Reports, Notifications, Profile.

## Employer

Dashboard, Company, Requirements, Jobs, Candidates, Interviews, Documents, Reports, Notifications, Profile.

## Candidate

Dashboard, Profile, Resume, Jobs, Applications, Interviews, Documents, Notifications, Settings.

## Dashboard pattern

Context → KPIs → priority actions → operational data → recent activity → insights.

## CRUD pattern

List → Search/filter → View → Create/Edit → Validation → Save → Success → Audit.

Destructive operations require confirmation and permission.
