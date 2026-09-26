# Route Map

## Public website

```text
/
/about
/why-nexatalent
/solutions
/solutions/permanent-hiring
/solutions/contract-staffing
/solutions/recruitment-process-support
/solutions/executive-search
/solutions/volume-hiring
/solutions/gcc-hiring
/solutions/talent-advisory
/industries
/industries/technology
/industries/bfsi
/industries/healthcare
/industries/manufacturing
/industries/retail
/industries/professional-services
/industries/gcc
/jobs
/jobs/:jobSlug
/career-services
/candidate-resources
/employers
/hire-talent
/request-talent
/employer-resources
/case-studies
/case-studies/:caseStudySlug
/insights
/insights/:articleSlug
/guides
/reports
/locations
/locations/:locationSlug
/contact
```

## Legal

`/privacy-policy` `/terms` `/cookie-policy` `/accessibility` `/data-protection` `/disclaimer`

## Authentication

`/login` `/forgot-password` `/reset-password` `/verify-account`

`/candidate/login` `/candidate/register`

`/employer/login` `/employer/register`

`/recruiter/login` `/employee/login`

## Candidate

`/candidate` `/candidate/profile` `/candidate/profile/edit` `/candidate/resume` `/candidate/jobs` `/candidate/jobs/:jobId` `/candidate/applications` `/candidate/applications/:applicationId` `/candidate/interviews` `/candidate/interviews/:interviewId` `/candidate/documents` `/candidate/documents/:documentId` `/candidate/notifications` `/candidate/settings` `/candidate/security`

## Employer

`/employer` `/employer/company` `/employer/company/edit` `/employer/requirements` `/employer/requirements/create` `/employer/requirements/:id/edit` `/employer/jobs` `/employer/jobs/:id` `/employer/candidates` `/employer/candidates/:id` `/employer/interviews` `/employer/interviews/:id` `/employer/documents` `/employer/documents/:id` `/employer/reports` `/employer/notifications` `/employer/profile` `/employer/settings`

## Recruiter

`/recruiter` `/recruiter/jobs` `/recruiter/jobs/create` `/recruiter/jobs/:id/edit` `/recruiter/candidates` `/recruiter/candidates/create` `/recruiter/candidates/:id` `/recruiter/talent-pool` `/recruiter/talent-pool/search` `/recruiter/ats` `/recruiter/ats/:jobId` `/recruiter/interviews` `/recruiter/interviews/:id` `/recruiter/tasks` `/recruiter/tasks/:id` `/recruiter/targets` `/recruiter/reports` `/recruiter/notifications` `/recruiter/profile`

## Employee

`/employee` `/employee/jobs` `/employee/candidates` `/employee/talent-pool` `/employee/ats` `/employee/crm` `/employee/leads` `/employee/companies` `/employee/contacts` `/employee/opportunities` `/employee/tasks` `/employee/targets` `/employee/reports` `/employee/documents` `/employee/notifications` `/employee/profile`

## Super Admin

`/superadmin` plus employee/user/employer/candidate/job/talent-pool/ATS/interview, CRM, tasks/targets/documents/notifications, reports/analytics, organizations, roles, permissions, audit-logs, commercial and settings routes.

## Route metadata contract

```ts
type RouteDefinition = {
  path: string;
  access: "public" | "authenticated";
  roles?: string[];
  permission?: string;
  layout: "website" | "auth" | "portal";
};
```

## Security

A protected route requires authentication, allowed role, required permission, organization scope and resource ownership where applicable.

Never fetch all records and filter them in React.
