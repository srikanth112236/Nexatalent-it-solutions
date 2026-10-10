# NexaTalent IT Solutions --- Enterprise Recruitment Platform Specification

**Document type:** Product Requirements & Functional Specification\
**Version:** 1.0\
**Status:** Working baseline for product, UX/UI, backend, QA, and
implementation planning\
**Product:** NexaTalent IT Solutions\
**Website:** https://www.nexatalentitsolutions.com/\
**Brand tagline:** Building Teams. Powering Growth.

------------------------------------------------------------------------

## 1. Purpose of This Document

This document defines the proposed product structure, user roles, pages,
data fields, workflows, permissions, integrations, business rules, and
acceptance criteria for the NexaTalent recruitment platform.

It is intended to be used as a shared implementation reference by
product owners, designers, frontend developers, backend developers, QA
engineers, and operations teams.

This is a **target-state specification**, not a claim that every
capability already exists in the current codebase. Before
implementation, map each requirement against the existing repository and
mark it as:

-   Implemented
-   Partially implemented
-   Missing
-   Implemented but requires correction
-   Deferred / out of scope

Do not rebuild working features without first auditing the existing
implementation.

## 2. Product Vision

NexaTalent is a recruitment and staffing platform that connects
employers, candidates, internal recruitment teams, sales teams, and
recruitment agencies through one coordinated system.

The platform should support the lifecycle from lead acquisition and
company onboarding through job requisition, candidate discovery,
applications, interviews, offers, placements, subscriptions, invoices,
and commission reconciliation.

### 2.1 Primary business objectives

1.  Help employers create and manage hiring requirements.
2.  Help candidates maintain professional profiles and discover suitable
    jobs.
3.  Help internal recruiters coordinate sourcing, screening, interviews,
    and placements.
4.  Help recruitment agencies work on explicitly assigned jobs and
    submit candidates under defined commercial terms.
5.  Allow companies to access candidate-search and outreach features
    according to their subscription entitlements.
6.  Allow Super Admin to govern platform records, users, companies,
    jobs, subscriptions, billing, commissions, and operations.
7.  Give BDA and sales teams a measurable lead and opportunity pipeline.
8.  Ensure business events synchronize reliably across modules.
9.  Protect candidate privacy, tenant boundaries, and financial
    integrity.
10. Support an enterprise-grade experience that remains understandable,
    accessible, and responsive.

### 2.2 Product principles

-   One authoritative record per core business entity.
-   Server-enforced authorization; never rely only on frontend hiding.
-   Explicit state transitions rather than arbitrary status updates.
-   Configurable subscription entitlements rather than hard-coded plan
    names.
-   Auditable financial records and repeat-safe processing.
-   Candidate privacy and consent-aware disclosure.
-   Organization-level data isolation.
-   Consistent, responsive, accessible user experience.
-   Clear operational ownership and recoverable workflows.

## 3. Scope and Portals

The platform contains the following experiences.

### 3.1 Public website

-   Home
-   About
-   Services
-   Employers / Hire Talent
-   Candidates / Find Jobs
-   Recruitment Partnerships / Vendor Empanelment
-   Contact
-   Legal, privacy, and terms pages
-   Login and registration entry points

### 3.2 Super Admin portal

Global administration of platform users, candidates, companies,
agencies, jobs, subscriptions, invoices, payments, commissions, leads,
sales performance, reports, configuration, and audit logs.

### 3.3 Candidate portal

Registration, onboarding, professional profile, resume, preferences, job
discovery, saved jobs, applications, interview schedules,
interview-related messaging, notifications, privacy settings, and
account settings.

### 3.4 Employer / company portal

Company profile, branches, team members, job requisitions, job postings,
candidate search, candidate profile access, talent pools, outreach,
ATS/application pipeline, interviews, offers, subscription usage,
billing, and invoices.

### 3.5 Internal team portal

Recruiter workspace, BDA/sales workspace, team manager views, tasks,
assignments, targets, follow-ups, and performance reports.

### 3.6 Recruitment agency portal

Agency onboarding, verification, team management, assigned job
marketplace, candidate submissions, submission status,
duplicate/ownership conflict handling, placements, commissions, and
payout visibility.

------------------------------------------------------------------------

## 4. User Roles and Authorization

Role names are not sufficient by themselves. Access decisions must
consider role, organization, branch, resource assignment, record
ownership, action permission, account status, and subscription
entitlement where applicable.

### 4.1 Proposed roles

  -----------------------------------------------------------------------
  Role                    Primary                 Default data scope
                          responsibilities        
  ----------------------- ----------------------- -----------------------
  Platform Owner          Highest-risk            Platform-wide
                          configuration and       
                          emergency access        

  Super Admin             Global platform         Platform-wide,
                          operations              authorized

  Operations Admin        Candidates, companies,  Platform operations
                          jobs, recruitment       scope
                          workflows               

  Finance Admin           Subscriptions,          Financial records
                          invoices, payments,     
                          commissions             

  Sales Admin             Leads, sales teams,     Sales scope
                          targets, sales reports  

  Support Admin           Account support and     Minimum necessary
                          limited troubleshooting access

  Company Admin           Company profile,        Own organization and
                          members, jobs,          authorized branches
                          subscription and        
                          billing                 

  Hiring Manager          Requisitions, candidate Assigned company jobs
                          pipeline, interviews    

  Company Recruiter       Candidate search and    Company-authorized
                          recruitment pipeline    records

  Internal Recruiter      Sourcing, screening,    Assigned jobs and
                          interviews and          candidates
                          placement coordination  

  BDA / Salesperson       Leads, outreach,        Assigned
                          meetings and follow-ups leads/opportunities

  Sales Manager           Team pipeline, targets  Team/branch scope
                          and performance         

  Candidate               Profile and own         Own records plus
                          applications            public/eligible jobs

  Agency Admin            Agency profile, users   Own agency and assigned
                          and assigned            jobs
                          recruitment work        

  Agency Recruiter        Candidate sourcing and  Authorized agency work
                          submissions             

  Finance / Billing Staff Billing operations      Finance-only
                          within granted scope    permissions
  -----------------------------------------------------------------------

### 4.2 Permission actions

Support granular permissions such as:

-   `view`
-   `create`
-   `edit`
-   `archive`
-   `delete`
-   `approve`
-   `reject`
-   `suspend`
-   `restore`
-   `assign`
-   `export`
-   `manage_billing`
-   `manage_permissions`
-   `view_sensitive_fields`
-   `reconcile`
-   `refund`
-   `adjust_commission`

Use permission templates, but allow controlled exceptions. Sensitive
permissions should be granted explicitly.

### 4.3 Authorization rules

-   All protected APIs must authorize requests server-side.
-   Company users can only access records belonging to their
    organization and authorized branches.
-   Agency users can only access their agency records and jobs
    explicitly assigned or published to them.
-   Candidates can access only their own profile, applications,
    interviews, and eligible conversations.
-   Internal users must be limited by role and assignment.
-   Subscription limits must be checked server-side.
-   Exports, contact unlocking, sensitive profile viewing, financial
    changes, and administrative status changes require explicit
    permissions.
-   Unauthorized record IDs must not reveal whether another tenant's
    record exists.
-   Suspended users must not continue using existing sessions or tokens
    where revocation is required.

------------------------------------------------------------------------

## 5. Global UX and Design System

### 5.1 Visual direction

Use a clean, modern, enterprise B2B interface.

Suggested brand palette:

  -----------------------------------------------------------------------
  Token                   Value                   Use
  ----------------------- ----------------------- -----------------------
  Navy                    `#071B3A`               Primary brand, admin
                                                  navigation,
                                                  high-contrast sections

  Midnight Blue           `#0B2548`               Secondary surfaces

  Electric Blue           `#087BFF`               Primary actions, active
                                                  states, key emphasis

  Azure                   `#35A7FF`               Secondary accent

  White                   `#FFFFFF`               Main content surfaces

  Pale Blue Grey          `#F4F7FB`               Alternate surfaces

  Charcoal                `#172338`               Primary text

  Slate                   `#627086`               Secondary text

  Border                  `#DCE5F0`               Dividers and card
                                                  borders
  -----------------------------------------------------------------------

Use Manrope where available, otherwise Inter or a comparable accessible
sans-serif.

### 5.2 Standard desktop layout

-   Left sidebar: collapsible navigation.
-   Top bar: organization context, search where relevant, notifications,
    help, and profile menu.
-   Breadcrumb and page title.
-   Primary action in a consistent location.
-   Optional KPI strip for relevant operational metrics.
-   Search/filter row.
-   Table, Kanban board, or domain-specific content.
-   Pagination and authorized export.
-   Detail drawer or dedicated detail route.
-   Audit/activity section for sensitive records.

### 5.3 Responsive behavior

-   Tables may become record cards on small screens.
-   Filters move into a drawer or expandable panel.
-   Important actions remain accessible.
-   Avoid horizontal scrolling where possible.
-   Do not remove security, validation, or workflow functionality on
    mobile.

### 5.4 Required UI states

Every page must support:

-   Loading
-   Empty state
-   Validation error
-   API error
-   Permission denied
-   Not found
-   Partial results where applicable
-   Success confirmation
-   Destructive-action confirmation
-   Network retry where safe

### 5.5 Interaction standards

-   Use server pagination for large datasets.
-   Keep filters and sorting in URL state when practical.
-   Preserve filters when opening and closing detail drawers.
-   Use debounced search where appropriate.
-   Use optimistic UI only when rollback and conflict behavior are
    well-defined.
-   Require confirmation and reason for high-risk actions.
-   Ensure keyboard accessibility, visible focus, labels, contrast, and
    understandable errors.

------------------------------------------------------------------------

## 6. Super Admin Portal

### 6.1 Navigation

Recommended navigation groups:

**Overview** - Dashboard

**Directory** - Candidates - Companies - Agencies - Internal Users -
Branches

**Recruitment** - Job Requisitions - Jobs - Applications - Interviews -
Placements

**Commercial** - Subscription Plans - Subscriptions - Payments -
Invoices - Commissions - Agency Payouts

**Sales** - Leads - Sales Pipeline - Sales Team - Targets - Performance

**Platform** - Reports - Notifications / Delivery Logs - Audit Logs -
Configuration - Support / Account Issues

Show navigation items according to permission.

### 6.2 Dashboard

**Route:** `/admin/dashboard`

#### KPI cards

-   Total candidates
-   Active candidates
-   Suspended/blocked candidates
-   Total companies
-   Active companies
-   Companies pending verification
-   Active jobs
-   Jobs pending approval
-   Applications by stage
-   Active subscriptions
-   Renewals due
-   Overdue invoices
-   Outstanding receivables
-   Commissions due
-   New leads
-   Overdue follow-ups
-   Recruiter workload
-   Placements in selected period

#### Filters

-   Date range
-   Company
-   Branch
-   Job category
-   Recruiter
-   Sales owner
-   Subscription plan
-   Record status

#### Behavior

-   Each KPI links to the exact filtered records.
-   Metrics must use documented definitions.
-   Do not show fabricated sample counts in production.
-   Display "no data" when no records exist.
-   Respect permissions for financial and sensitive widgets.

### 6.3 Candidate directory

**Route:** `/admin/candidates`

#### Table fields

-   Candidate ID
-   Full name
-   Email
-   Phone (masked if permission does not allow full view)
-   Current designation
-   Skills
-   Experience
-   Preferred location
-   Profile completeness
-   Account status
-   Application count
-   Assigned recruiter, if applicable
-   Last activity
-   Registration date

#### Filters

-   Active / suspended / blocked / deleted
-   Skills
-   Experience range
-   Location
-   Profile completeness
-   Application stage
-   Registration date
-   Source
-   Recruiter assignment

#### Candidate detail tabs

1.  Overview
2.  Personal information
3.  Professional profile
4.  Education
5.  Experience
6.  Skills and certifications
7.  Resume and documents
8.  Applications
9.  Interviews
10. Consent and privacy
11. Activity timeline
12. Administrative history

#### Actions

-   View
-   Edit with audit record
-   Suspend
-   Block
-   Restore
-   Request additional information
-   Initiate privacy/deletion request
-   Export only when authorized

Suspension and blocking must have a reason, actor, timestamp, and
applicable expiry or review date. Revoke sessions when required. Prefer
soft deletion and a controlled permanent-deletion workflow. Preserve
legally required financial and audit records where lawful.

### 6.4 Company directory

**Route:** `/admin/companies`

#### Company fields

-   Company ID
-   Legal entity name
-   Display/brand name
-   Entity type
-   Industry and sub-industry
-   Company size
-   Website
-   Company description
-   Country of incorporation
-   Registration number where applicable
-   GSTIN where applicable
-   Tax identifiers where necessary
-   Registered address
-   Headquarters
-   Operating and hiring locations
-   Logo
-   Primary contact name/designation
-   Business email and phone
-   Billing contact and finance email
-   Verification status
-   Account status
-   Assigned sales owner
-   Account manager
-   Active job count
-   Subscription
-   Outstanding balance
-   Registration date

#### Company tabs

Overview, Profile, Verification, Users, Branches, Requisitions, Jobs,
Applications, Interviews, Subscription, Invoices, Payments, Commissions,
Activity, Audit Log.

#### Actions

Create, edit, invite administrator, verify, reject, suspend, reactivate,
assign account manager, manage branches/users, and review associated
commercial records.

Do not hard-delete a company that has applications, invoices, payments,
placements, or other dependent records. Use a controlled
closure/deactivation process.

### 6.5 Agency directory

**Route:** `/admin/agencies`

Fields:

-   Agency ID
-   Legal/display name
-   Registration and tax details where applicable
-   Website and address
-   Primary contact
-   Recruitment specialties
-   Locations served
-   Recruiter count
-   Verification status
-   Agreement status
-   Commercial model
-   Account status
-   Assigned account manager
-   Active job assignments
-   Submissions
-   Placements
-   Outstanding payout balance

Actions: create, invite, verify, reject, suspend, reactivate, assign
jobs, review submissions, view commission agreements, and inspect audit
history.

### 6.6 Internal users and roles

**Route:** `/admin/users`

Fields:

-   User ID
-   Full name
-   Work email
-   Work phone where necessary
-   Employee ID
-   Department
-   Designation
-   Role and permission template
-   Branch
-   Reporting manager
-   Assigned companies/jobs/leads
-   Account status
-   Invitation status
-   Last login
-   MFA status if available
-   Start/end dates

Actions: invite, edit, assign permissions, reassign records, suspend,
reactivate, and review access history.

When a user leaves, revoke access and reassign open leads, jobs,
candidates, tasks, interviews, and accounts.

### 6.7 Job requisitions and jobs

**Routes:** - `/admin/job-requisitions` - `/admin/jobs` -
`/admin/jobs/:jobId`

#### List columns

-   Job ID
-   Requisition ID
-   Job title
-   Company
-   Branch/location
-   Hiring manager
-   Assigned recruiter
-   Employment type
-   Experience range
-   Number of openings
-   Requisition status
-   Publication status
-   Application count
-   Interview count
-   Positions filled
-   Created date
-   Expiry date

#### Actions

View, approve, reject, request changes, publish, unpublish, pause,
close, reopen with authorization, assign recruiter/agency, view
pipeline, archive.

A job must not accept applications after expiry/closure unless reopened
through an authorized transition.

### 6.8 Subscription plan configuration

**Routes:** - `/admin/subscription-plans` - `/admin/subscriptions`

#### Plan fields

-   Plan ID/name/description
-   Target customer type
-   Billing interval
-   Price and currency
-   Tax configuration
-   User limit
-   Active job limit
-   Candidate search allowance
-   Full profile access allowance
-   Contact unlock allowance
-   Outreach allowance
-   Talent pool capacity
-   Advanced ATS features
-   Analytics features
-   Integrations/API entitlements if offered
-   Trial duration
-   Grace period
-   Renewal behavior
-   Overage rules
-   Visibility/status
-   Effective date
-   Version

Maintain immutable plan versions or equivalent snapshots. Existing
subscriptions should not silently change their commercial terms when a
plan is edited.

#### Subscription fields

-   Subscription ID
-   Organization ID
-   Plan ID and plan version
-   Start date
-   Trial end
-   Billing period start/end
-   Renewal date
-   Price/currency
-   Discount
-   Tax
-   Status
-   Auto-renew setting
-   Payment status
-   Grace period end
-   Cancellation date/reason
-   Upgrade/downgrade history

#### Subscription states

Trial, Active, Renewal Due, Past Due, Grace Period, Suspended,
Cancelled, Expired. Refund status should be tracked separately from the
subscription's lifecycle.

### 6.9 Payments

**Route:** `/admin/payments`

Fields:

-   Payment ID
-   Organization
-   Subscription
-   Invoice
-   Provider
-   Provider transaction reference
-   Amount/currency
-   Payment method
-   Transaction date
-   Status
-   Refund amount
-   Reconciliation status

Statuses may include pending, succeeded, failed, partially refunded,
refunded, and disputed where supported.

Verify payment webhooks server-side. A client redirect to a success page
is not proof of payment.

### 6.10 Invoices

**Route:** `/admin/invoices`

Fields:

-   Invoice ID/number
-   Billing entity
-   Billing address
-   Applicable tax identifiers
-   Subscription/service
-   Billing period
-   Issue date
-   Due date
-   Subtotal
-   Discount
-   Tax breakdown
-   Total
-   Amount paid
-   Outstanding balance
-   Currency
-   Status
-   Document reference
-   Credit note/refund references

Statuses: Draft, Issued, Partially Paid, Paid, Overdue, Void, Credited
where applicable.

Calculate overdue from due date and outstanding balance using configured
accounting rules. Issued invoices should not be silently overwritten;
use amendment/credit-note processes.

### 6.11 Commission management

**Route:** `/admin/commissions`

#### Commission agreement

-   Agreement ID
-   Company
-   Job/requisition
-   Candidate placement
-   Agency or payee where applicable
-   Fee model
-   Fee basis
-   Percentage or fixed fee
-   Currency
-   Tax treatment
-   Replacement/refund terms
-   Effective date
-   Approval/signature status

#### Commission record

-   Commission ID
-   Agreement snapshot
-   Company/job/candidate placement
-   Recruiter/agency attribution
-   Trigger type and date
-   Trigger evidence
-   Fee basis amount
-   Agreed rate
-   Gross fee
-   Adjustments
-   Tax amount
-   Net receivable/payable
-   Invoice reference
-   Payment reference
-   Balance
-   Approval status
-   Payment status

#### Commission lifecycle

Agreement Approved → Candidate Submitted → Interviewed → Selected →
Offer Accepted → Joined (if this is the contractual trigger) → Trigger
Confirmed → Commission Approved → Invoice Issued → Payment Reconciled.

The trigger must be configurable per agreement. Prevent duplicate
commission generation for the same placement and trigger. Snapshot
approved terms. Keep company receivables separate from agency/recruiter
payables.

### 6.12 Leads and sales pipeline

**Routes:** - `/admin/leads` - `/admin/sales/pipeline` -
`/admin/sales/performance`

#### Lead fields

-   Lead ID
-   Contact name/designation
-   Business email/phone
-   Company name/website
-   Industry/company size
-   Location
-   Lead source
-   Interested service
-   Hiring need
-   Estimated openings
-   Budget/deal value if known
-   Expected close date
-   Priority
-   Owner/team/branch
-   Next follow-up date
-   Notes
-   Communication consent/lawful basis where required
-   Created/updated timestamps

#### Suggested stages

New → Contacted → Qualified → Discovery Scheduled → Proposal Sent →
Negotiation → Won / Lost / Nurture.

#### Actions

Create, edit, assign, add activities, schedule follow-ups, create
proposal, convert to company onboarding, mark lost with reason, merge
duplicates, and inspect history.

When converted, preserve lead history and link it to the
company/opportunity. Avoid duplicate organization records.

### 6.13 Sales performance

Metrics:

-   Leads assigned
-   Leads contacted
-   Qualified leads
-   Meetings booked
-   Proposals sent
-   Won/lost opportunities
-   Conversion rates
-   Pipeline value
-   Revenue booked
-   Response time
-   Overdue follow-ups

Filters: date range, salesperson, team, branch, lead source, service,
stage.

Every metric must drill into source records. Compare conversion and
workload context, not only raw counts.

### 6.14 Reports and audit logs

Reports:

-   Requisition ageing
-   Candidate pipeline
-   Interview-to-offer conversion
-   Offer-to-joining conversion
-   Recruiter workload
-   Company hiring activity
-   Subscription revenue
-   Outstanding receivables
-   Commission liabilities
-   Agency performance
-   Sales pipeline
-   Data quality/duplicates

Audit logs should capture actor, action, resource, record ID, timestamp,
reason, and appropriate before/after metadata. Do not log passwords,
secrets, access tokens, or unnecessary sensitive personal data.

------------------------------------------------------------------------

## 7. Candidate Portal

### 7.1 Registration and onboarding

**Routes:** `/candidate/register`, `/candidate/onboarding`

Registration fields:

-   Full name
-   Email
-   Phone if required
-   Authentication method
-   Country
-   Terms/privacy acknowledgement
-   Separate optional marketing preference

Onboarding sections:

1.  Personal details
2.  Professional headline and summary
3.  Experience
4.  Education
5.  Skills and certifications
6.  Projects and portfolio
7.  Job preferences
8.  Resume
9.  Profile visibility and privacy

Save progress and allow users to return later.

### 7.2 Candidate dashboard

**Route:** `/candidate/dashboard`

Widgets:

-   Profile completeness
-   Recommended jobs
-   Recently viewed jobs
-   Saved jobs
-   Active applications
-   Upcoming interviews
-   Application updates
-   Notifications
-   Profile visibility

Each widget links to the underlying page.

### 7.3 Candidate profile

**Route:** `/candidate/profile`

  -----------------------------------------------------------------------
  Section                             Fields
  ----------------------------------- -----------------------------------
  Personal                            Name, headline, location, country,
                                      contact preferences

  Summary                             Professional summary and career
                                      objectives

  Experience                          Employer, designation, employment
                                      type, dates, responsibilities,
                                      achievements

  Education                           Institution, qualification,
                                      specialization, dates

  Skills                              Skill, level/experience where
                                      meaningful

  Certifications                      Name, issuer, dates, expiry if
                                      applicable

  Projects                            Name, description, role, stack,
                                      dates

  Preferences                         Roles, location, employment type,
                                      work arrangement, availability

  Compensation                        Expected compensation, currency,
                                      pay period; current compensation
                                      optional/restricted

  Resume                              File reference, version, upload
                                      date

  Links                               Portfolio, professional profile,
                                      code/work samples

  Privacy                             Visibility, consent, communication
                                      preferences
  -----------------------------------------------------------------------

Validate date ranges, contact details, duplicate entries, and uploads.
Protect current salary, contact details, and documents from unauthorized
disclosure.

Candidate profile is the current source of truth. Applications may
retain submission snapshots for historical integrity.

### 7.4 Job search

**Route:** `/candidate/jobs`

Filters:

-   Keyword/title
-   Skills
-   Company
-   Industry
-   Location
-   Experience
-   Employment type
-   Work arrangement
-   Salary range when disclosed
-   Date posted
-   Qualifications

Job card fields:

-   Job title
-   Company
-   Location
-   Experience range
-   Employment type
-   Salary range if disclosed
-   Posted date
-   Deadline
-   Saved status
-   Application status

**Route:** `/candidate/jobs/:jobId`

Job detail includes description, responsibilities, required/preferred
skills, qualifications, location, compensation disclosure, employment
type, work arrangement, selection process, and deadline.

Only eligible published, active, non-expired jobs appear in search.

### 7.5 Saved and liked jobs

**Routes:** `/candidate/saved-jobs`, `/candidate/liked-jobs`

Saved jobs are a private shortlist. Liked jobs should exist separately
only if they power a distinct feature such as recommendations. Otherwise
use one Save action.

Enforce unique candidate/job relationships. Retain closed jobs in
history with a closed status and disable new applications.

### 7.6 Candidate applications

**Routes:** `/candidate/applications`,
`/candidate/applications/:applicationId`

Fields:

-   Application ID
-   Job/company
-   Applied date
-   Current candidate-visible stage
-   Last updated
-   Next interview
-   Status explanation
-   Available actions

Suggested stages:

Applied → Under Review → Shortlisted → Interview Scheduled → Interview
Completed → Selected/Offer → Hired.

Terminal/alternate states: Rejected, Withdrawn, Job Closed.

Show a clear timeline, interview information, permitted document
updates, withdrawal option where allowed, and eligible job-related chat.

### 7.7 Candidate interviews

**Route:** `/candidate/interviews`

Fields:

-   Interview ID
-   Application/job
-   Company
-   Round
-   Date/time/time zone
-   Mode
-   Meeting link/venue
-   Visible interviewer/panel
-   Instructions
-   Confirmation status
-   Reschedule request
-   Cancellation reason
-   Outcome visibility

### 7.8 Candidate-company chat

**Route:** `/candidate/applications/:applicationId/chat`

Enable candidate-company chat only when an eligible interview is
confirmed as scheduled for that application.

Conversation fields:

-   Conversation ID
-   Application ID
-   Job ID
-   Company ID
-   Candidate ID
-   Status
-   Created/last message timestamps
-   Retention policy reference

Message fields:

-   Message ID
-   Conversation ID
-   Sender user ID
-   Type
-   Body
-   Attachment reference
-   Created/edited/deleted timestamps if applicable
-   Delivery status

Authorize every operation by application, company, candidate, and
participant. Keep internal recruiter notes and confidential feedback
separate. Define behavior for rescheduled/cancelled/completed interviews
and preserve history according to policy.

### 7.9 Notifications and settings

**Routes:** `/candidate/notifications`, `/candidate/settings`

Notifications may cover application confirmation, stage changes,
interviews, rescheduling, cancellations, information requests, offer
updates, and account security.

Support in-app/email and optional configured channels. Provide
notification preferences and privacy/account controls.

------------------------------------------------------------------------

## 8. Employer / Company Portal

### 8.1 Company onboarding

**Routes:** `/company/register`, `/company/onboarding`

Primary supported flow: Super Admin creates company, enters
legal/business data, adds company admin, sends invitation, company admin
activates account and completes missing details, verification is
reviewed, and subscription/entitlements are assigned.

Company states: Invited, Registration In Progress, Verification Pending,
Approved, Active, Rejected, Suspended, Closed.

Verification status and account status must be separate.

### 8.2 Employer dashboard

**Route:** `/company/dashboard`

Widgets:

-   Active requisitions
-   Published jobs
-   Draft jobs
-   Applications received
-   Candidates under review
-   Interviews scheduled
-   Offers in progress
-   Positions filled
-   Search usage
-   Contact unlock usage
-   Outreach usage
-   Renewal date
-   Outstanding invoices
-   Recent activity

All data must be scoped to the company and authorized branches.

### 8.3 Job requirements / requisitions

**Route:** `/company/job-requirements`

Fields:

**Basic:** title, department, category, reference, hiring manager,
recruiter, business unit/branch.

**Role:** description, responsibilities, required/preferred skills,
qualifications, experience, seniority, employment type, openings.

**Location:** country, region, city, work location,
remote/hybrid/onsite, travel if applicable.

**Compensation:** range, currency, pay period, benefits, disclosure
setting.

**Hiring plan:** priority, target hire date, deadline, interview rounds,
assessments, joining target, budget approval.

**Assignment:** company recruiter, internal recruiter, approved agency
partners, submission rules, hiring manager/panel.

States: Draft → Pending Approval → Approved → Sourcing → Filled / On
Hold / Cancelled.

A requisition can be approved before public publication.

### 8.4 Job posting

**Route:** `/company/jobs`

Create postings from approved requisitions where possible.

Fields:

-   Linked requisition
-   Public title and description
-   Responsibilities
-   Required/preferred skills
-   Qualifications and experience
-   Location and employment type
-   Work arrangement
-   Salary disclosure
-   Start/expiry dates
-   Application questions
-   Required documents
-   Visibility
-   Application settings

States: Draft → Pending Review → Approved → Published → Paused → Closed
→ Archived.

Apply configured approval rules when editing a published job.

### 8.5 Candidate search

**Route:** `/company/candidates`

Filters: keyword, designation, skills, experience, locations, industry,
education, certifications, availability, employment preference,
compensation expectations where provided, profile freshness, resume
availability, and role-fit criteria.

Search cards show only allowed fields: name/anonymized label,
designation, experience, skills, location, summary, freshness, and
relevant fit indicators.

#### Profile access tiers

1.  Search preview
2.  Full professional profile
3.  Contact access/unlock

Each tier requires both subscription entitlement and candidate
disclosure authorization. The API must omit restricted fields entirely.

#### Upgrade behavior

When a feature is locked:

-   Explain the restriction.
-   Show current plan and usage.
-   Show remaining allowance.
-   Link to available upgrade options.
-   Preserve filters and search context.
-   Never return hidden data to the browser.

### 8.6 Talent pool

**Route:** `/company/talent-pool`

Fields:

-   Pool ID
-   Company ID
-   Name/description
-   Owner
-   Related job/requisition
-   Candidate references
-   Tags
-   Internal notes
-   Created/updated timestamps

Actions: create, edit, add/remove authorized candidates, search, connect
to a job where permitted, track source, archive.

Apply consent, disclosure, purpose limitation, and retention rules.

### 8.7 Email outreach

**Route:** `/company/outreach`

Fields:

-   Campaign name
-   Related job/requisition
-   Authorized recipients
-   Subject
-   Template
-   Personalization fields
-   Sender identity
-   Schedule
-   Recipient preview
-   Approval status

Plan limits may include monthly/daily allowance, batch size, templates,
personalization, and usage reset date.

Workflow: Draft → Recipient Validation → Quota Check → Approval if
required → Queued → Sent / Partially Sent / Failed.

Track sent, delivered where supported, bounced, and opted-out states.
Deduct quota according to a documented event policy. Make retries
idempotent.

### 8.8 ATS / interview pipeline

**Route:** `/company/applications`

Suggested stages:

New → Screening → Shortlisted → Interview Scheduled → Interview
Completed → Offer → Hired.

Other outcomes: Rejected, Withdrawn, On Hold, Job Closed.

Application fields:

-   Application ID
-   Candidate ID
-   Job ID
-   Company ID
-   Requisition ID
-   Applied date
-   Stage
-   Assigned recruiter
-   Interview history
-   Stage history
-   Documents
-   Offer status
-   Joining status
-   Rejection/withdrawal reason
-   Source

Actions: move stage, schedule interview, assign panel, invite candidate,
record feedback, reschedule, advance/reject, create offer, mark hired
after required confirmation.

Every transition must produce the necessary timeline, notification,
analytics, and commission-evaluation events.

### 8.9 Employer subscription and billing

**Routes:** `/company/subscription`, `/company/billing`,
`/company/invoices`, `/company/payments`

Show plan, entitlements, usage, remaining quotas, renewal,
upgrade/downgrade options, payment history, invoices, and outstanding
balance.

Companies may see only their own records. Payment failure and suspension
must follow configured retry and grace-period policies.

------------------------------------------------------------------------

## 9. Recruitment Agency Portal

### 9.1 Agency onboarding

**Routes:** `/agency/register`, `/agency/onboarding`

Fields:

-   Agency ID
-   Legal/display name
-   Entity type and registration
-   Country
-   Tax identifiers where applicable
-   Website/address
-   Primary contact
-   Business email/phone
-   Specialties and skill categories
-   Locations served
-   Recruiter count
-   Verification documents if required
-   Agreement status
-   Commission terms
-   Account status

Collect banking/payout details only when necessary. Encrypt and mask
sensitive financial data.

### 9.2 Agency dashboard

**Route:** `/agency/dashboard`

Widgets: assigned jobs, open submissions, candidates under review,
interviews, selected candidates, placements, commissions pending,
approved payouts, rejected submissions, deadlines, and team activity.

All records must be scoped to the agency.

### 9.3 Assigned job marketplace

**Route:** `/agency/jobs`

Show only jobs explicitly assigned or made available to the agency.

Job fields: title, authorized company disclosure, location, skills,
experience, openings, description, deadline, submission rules,
commercial terms where permitted, assignment status.

Actions: accept/decline assignment, view requirements, submit candidate,
track status, request clarification.

### 9.4 Candidate submissions

**Route:** `/agency/submissions`

Fields:

-   Submission ID
-   Agency ID
-   Candidate reference
-   Job ID
-   Company ID
-   Submitted by
-   Submission date
-   Candidate authorization/consent evidence where required
-   Resume reference
-   Skills and screening notes
-   Availability
-   Compensation expectations if necessary
-   Status
-   Duplicate-check result

States: Draft → Submitted → Under Review → Shortlisted → Interview →
Selected → Offer → Joined; alternatives include Rejected, Withdrawn,
Duplicate, Closed.

Duplicate handling must consider candidate, job, source, ownership
window, and existing application state. Do not reject all repeated
candidate identities automatically. Route conflicting claims to a
documented review process.

### 9.5 Agency commissions/payouts

**Route:** `/agency/commissions`

Show agreement, job, placement, candidate reference, trigger, rate,
calculation, adjustments, invoice/payout reference, approval, payment
status, and settlement date.

Lifecycle: Placement Trigger Confirmed → Calculated → Reviewed →
Approved → Payable → Payment Processed → Reconciled.

Company receivables and agency payables must be separate ledgers, even
when linked to the same placement.

------------------------------------------------------------------------

## 10. Internal Recruiter and Sales Workspaces

### 10.1 Recruiter workspace

**Routes:** - `/team/recruiter/dashboard` - `/team/recruiter/jobs` -
`/team/recruiter/candidates` - `/team/recruiter/applications` -
`/team/recruiter/interviews` - `/team/recruiter/tasks`

Dashboard: assigned requisitions, sourcing targets, screening queue,
applications requiring action, interviews, feedback pending, offers,
joining follow-ups, overdue tasks.

A job may have a lead recruiter and supporting recruiters. Record
assignment owner, assignment date/status, and reassignment history.

Candidate ownership should be explicit but should not prevent authorized
colleagues from performing legitimate recruitment tasks.

### 10.2 Sales / BDA workspace

**Routes:** - `/team/sales/dashboard` - `/team/sales/leads` -
`/team/sales/activities` - `/team/sales/tasks` - `/team/sales/targets`

Dashboard: assigned leads, new leads, follow-ups due, overdue
follow-ups, meetings, proposals, wins, pipeline value, target progress.

Activity fields: lead/company, type, date/time, outcome, notes, next
action, follow-up date, related proposal, owner.

Sales managers can assign leads, view team activity, set targets, review
conversion, and reassign neglected opportunities under defined rules.

------------------------------------------------------------------------

## 11. Cross-Module Synchronization

Use shared records and explicit domain events. Do not create separate
disconnected copies of the same business object in each portal.

### 11.1 Core lifecycle

Sales Lead → Company Onboarding → Company Verification →
Subscription/Entitlements → Job Requisition → Job Publication →
Candidate Search/Application or Agency Submission → Screening →
Interview → Offer → Placement → Commission Trigger → Invoice →
Payment/Reconciliation.

### 11.2 Event matrix

  -----------------------------------------------------------------------
  Event                   Modules affected        Expected result
  ----------------------- ----------------------- -----------------------
  Company approved        Company, access,        Access follows approval
                          dashboard               policy

  Subscription activated  Entitlements, search,   Correct features become
                          jobs, billing           available

  Payment confirmed       Payment, invoice,       Update ledger and
                          subscription            applicable entitlements

  Job published           Search, employer,       Eligible candidates can
                          candidate portal        discover job

  Candidate applies       Application, job,       One application and
                          candidate dashboard     visible status

  Candidate shortlisted   Application, company    Stage updates and
                          pipeline, candidate     configured notification
                          timeline                

  Interview scheduled     Interview, application, Interview created;
                          notification, chat      eligible chat enabled
                          eligibility             

  Interview rescheduled   Interview,              Active schedule
                          notifications, chat     updated; history
                                                  preserved

  Candidate selected      Application, placement  Selection and required
                          workflow                offer steps recorded

  Candidate joins         Placement, commission   Evaluate contractual
                          engine, reports         commission trigger

  Commission approved     Commission,             Financial obligation
                          receivable/payable,     created
                          invoice                 

  Invoice paid            Payment, invoice,       Paid amount and balance
                          reconciliation          updated

  Employee deactivated    Authentication,         Access revoked and work
                          assignments, audit      reassigned

  Company suspended       Authentication, job     Configured suspension
                          visibility, workflow    policy enforced
  -----------------------------------------------------------------------

### 11.3 Reliability requirements

-   Use transactional updates for related database changes where
    appropriate.
-   Use an outbox or equivalent pattern for reliable event publishing.
-   Use idempotency keys for payment callbacks, commission creation,
    quota deductions, and notifications.
-   Retry transient failures safely.
-   Record failed event processing and provide recovery tooling.
-   Do not report success until the authoritative operation has
    succeeded.
-   Ensure event consumers can safely process the same event more than
    once.

------------------------------------------------------------------------

## 12. Subscription Entitlements and Usage

### 12.1 Entitlement keys

Examples:

-   `jobs.create`
-   `jobs.active_limit`
-   `candidates.search`
-   `candidates.profile_view`
-   `candidates.contact_unlock`
-   `candidates.export`
-   `outreach.send`
-   `outreach.monthly_limit`
-   `talent_pool.create`
-   `analytics.advanced`

### 12.2 Access evaluation

For each restricted operation:

1.  Authenticate user.
2.  Validate organization membership.
3.  Confirm organization/account status.
4.  Resolve subscription and effective plan version.
5.  Check entitlement and quota.
6.  Apply candidate visibility and disclosure rules.
7.  Return only authorized data.
8.  Record usage according to the documented policy.

### 12.3 Quota ledger

Fields:

-   Ledger ID
-   Organization/user
-   Entitlement
-   Resource reference
-   Quantity
-   Event/idempotency key
-   Billing period
-   Timestamp
-   Reversal/reference
-   Metadata without unnecessary personal data

Use concurrency-safe quota reservations so simultaneous requests cannot
exceed limits unexpectedly.

------------------------------------------------------------------------

## 13. Interview-Only Chat Rules

Chat is not a general social or unrestricted messaging feature.

### Eligibility

-   Valid application exists.
-   Application belongs to the candidate and company.
-   An eligible interview is confirmed as scheduled.
-   User is an authorized participant.
-   Company can access the application.
-   Conversation is scoped to the application/job.

### Edge cases

Define behavior for rescheduled/cancelled/completed interviews, multiple
rounds, candidate withdrawal, job closure, and account suspension. Do
not destroy history automatically when an interview changes state.

### Security

-   Authorize every conversation and message request.
-   Restrict attachments and scan uploads.
-   Rate-limit messaging.
-   Keep internal notes separate.
-   Audit administrative access.
-   Apply retention/deletion policy.
-   Prevent cross-company or cross-candidate access.

------------------------------------------------------------------------

## 14. Data Model

This is the logical entity baseline. Final schema design must be mapped
to the current codebase before implementation.

### 14.1 Identity and organizations

-   `User`
-   `Role`
-   `Permission`
-   `UserRole`
-   `Organization`
-   `CompanyProfile`
-   `AgencyProfile`
-   `Branch`
-   `OrganizationMembership`
-   `CompanyVerification`
-   `AuditLog`

### 14.2 Recruitment

-   `CandidateProfile`
-   `CandidateExperience`
-   `CandidateEducation`
-   `CandidateSkill`
-   `Skill`
-   `CandidateCertification`
-   `CandidateDocument`
-   `CandidateConsent`
-   `JobRequisition`
-   `Job`
-   `JobSkill`
-   `JobAssignment`
-   `Application`
-   `ApplicationStageHistory`
-   `Interview`
-   `InterviewFeedback`
-   `Conversation`
-   `Message`
-   `TalentPool`
-   `TalentPoolMember`
-   `Offer`
-   `Placement`

### 14.3 Subscription and finance

-   `SubscriptionPlan`
-   `PlanVersion`
-   `PlanEntitlement`
-   `Subscription`
-   `SubscriptionChange`
-   `UsageLedger`
-   `Invoice`
-   `InvoiceLine`
-   `PaymentTransaction`
-   `PaymentAllocation`
-   `Refund`
-   `CreditNote`
-   `CommissionAgreement`
-   `Commission`
-   `CommissionAdjustment`
-   `Payout`
-   `ReconciliationRecord`

### 14.4 Sales and operations

-   `Lead`
-   `LeadActivity`
-   `SalesOpportunity`
-   `SalesTarget`
-   `Task`
-   `Proposal`
-   `Notification`
-   `NotificationPreference`
-   `EmailCampaign`
-   `EmailRecipient`
-   `EmailEvent`
-   `RecruitmentAssignment`

### 14.5 Data design principles

-   Use stable IDs and explicit foreign-key/reference relationships.
-   Add organization scope to tenant-owned records.
-   Index common filter and join fields.
-   Use uniqueness constraints for business-critical relationships.
-   Use decimal-safe money types, explicit currency, and documented
    rounding.
-   Store timestamps consistently and render them in the user's relevant
    time zone.
-   Keep status history for important workflows.
-   Store document references rather than exposing unrestricted file
    paths.
-   Use snapshots for historical commercial terms and application
    submissions where needed.
-   Define deletion, archival, and retention rules for each entity.

------------------------------------------------------------------------

## 15. Security, Privacy and Enterprise Controls

### 15.1 Access security

-   Server-side authorization for every protected endpoint.
-   Organization/branch scope enforcement.
-   Protection against insecure direct object reference attacks.
-   Least-privilege access.
-   Session/token revocation when required.
-   Stronger authentication for high-risk operations where appropriate.
-   Rate limits and abuse prevention.
-   Secure secret management.

### 15.2 Candidate privacy

-   Collect only necessary information.
-   Explain profile visibility and data use.
-   Record relevant consent and disclosure decisions.
-   Provide appropriate access/correction/deletion workflows.
-   Define retention periods.
-   Restrict downloads and exports.
-   Do not expose sensitive fields through APIs, logs, or frontend
    state.
-   Follow applicable privacy and employment-related obligations.

### 15.3 Financial integrity

-   Verify payment-provider webhooks.
-   Idempotent payment and commission processing.
-   Immutable transaction/event history.
-   Separate invoice issuance from payment confirmation.
-   Separate receivables from payables.
-   Approval controls for refunds and adjustments.
-   Reconciliation against provider records.
-   Documented financial rounding and tax rules.

### 15.4 Reliability and monitoring

-   Structured logs with correlation IDs.
-   Monitoring for background jobs and notifications.
-   Safe retry strategy.
-   Failed-event recovery/dead-letter process.
-   Payment webhook monitoring.
-   Email delivery monitoring.
-   Subscription renewal monitoring.
-   Backups and recovery testing.
-   Performance and error dashboards.

------------------------------------------------------------------------

## 16. Reporting Definitions

Define every KPI centrally so different dashboards do not calculate the
same metric differently.

Examples:

-   **Active job:** a job whose status and dates permit applications.
-   **Application count:** count of unique application records under the
    selected filters.
-   **Placement:** a confirmed placement record, not merely a selected
    candidate.
-   **Paid invoice:** invoice balance is zero according to the financial
    ledger.
-   **Overdue invoice:** outstanding balance exists and the due date has
    passed according to configured rules.
-   **Commission due:** approved commission amount not yet settled,
    adjusted for recorded credits and payments.
-   **Lead conversion rate:** converted leads divided by a defined
    eligible lead cohort for a specified period.
-   **Offer-to-joining rate:** joined candidates divided by the agreed
    cohort of offers; specify cohort and time window.

Reports should show their date range, filter context, definition, and
data freshness. Avoid misleading comparisons between cohorts with
different maturity.

------------------------------------------------------------------------

## 17. Notifications and Background Jobs

### 17.1 Notification events

-   Company invitation and verification outcome
-   Subscription activation, renewal, failure and expiry
-   Invoice issued and payment confirmed/failed
-   Job approval/publication/closure
-   Candidate application received
-   Application stage changed
-   Interview scheduled/rescheduled/cancelled
-   Feedback pending
-   Offer/placement status changes
-   Commission approval and payment
-   Lead follow-up due
-   Account suspension/security events

### 17.2 Delivery channels

Use in-app and email initially, with SMS or other channels only when
configured and justified.

### 17.3 Delivery records

Track notification ID, recipient, channel, event, provider reference,
queued/sent/delivered/failed status where supported, retry count,
timestamps, and error category. Avoid storing unnecessary message
secrets or sensitive candidate content.

------------------------------------------------------------------------

## 18. API and Service Design Guidance

Exact endpoint names should follow the existing project's conventions,
but group APIs by domain:

-   Authentication and identity
-   Users and permissions
-   Organizations, companies, agencies, branches
-   Candidate profiles and documents
-   Job requisitions and jobs
-   Search and talent pools
-   Applications, interviews, offers and placements
-   Conversations and messages
-   Subscription plans and entitlements
-   Usage ledger
-   Invoices, payments and refunds
-   Commission agreements, commissions and payouts
-   Leads, activities, opportunities and targets
-   Notifications and email delivery
-   Reports and audit logs

### API standards

-   Validate input at the server boundary.
-   Return consistent error structures.
-   Enforce authorization before returning sensitive data.
-   Use pagination and bounded query sizes.
-   Support idempotency for financial and retryable operations.
-   Version breaking API changes.
-   Use transactions for related critical writes.
-   Apply rate limits to search, contact unlocking, messaging, and
    authentication.
-   Never trust company IDs, role names, prices, commission amounts, or
    subscription entitlements supplied by the browser without
    server-side validation.

------------------------------------------------------------------------

## 19. Testing Strategy

### 19.1 Unit tests

-   Validators
-   Permission policy functions
-   State-transition rules
-   Entitlement evaluation
-   Commission calculations
-   Invoice balance calculations
-   Quota consumption
-   Candidate/job eligibility

### 19.2 Integration tests

-   Company onboarding and invitation
-   Candidate application submission
-   Interview scheduling and notifications
-   Chat eligibility
-   Subscription payment and entitlement activation
-   Invoice allocation and reconciliation
-   Placement-triggered commission creation
-   Agency submission and duplicate resolution
-   Lead conversion to company onboarding

### 19.3 Authorization tests

For every sensitive endpoint, test:

-   Correct authorized role
-   Wrong role
-   Wrong organization
-   Wrong branch
-   Unassigned resource
-   Suspended account
-   Expired subscription
-   Missing entitlement
-   Hidden candidate fields
-   Attempted unauthorized export

### 19.4 Reliability tests

-   Duplicate payment webhook
-   Duplicate placement event
-   Concurrent quota requests
-   Notification provider outage
-   Failed event consumer
-   Retried request after timeout
-   Partial payment
-   Refund/credit-note workflow
-   User deactivation with open assignments

### 19.5 UI and accessibility tests

-   Keyboard navigation
-   Visible focus
-   Labels and validation
-   Contrast
-   Responsive layouts
-   Empty/error/loading states
-   Table pagination and filter behavior
-   Confirmation dialogs
-   Screen-reader-friendly status changes

------------------------------------------------------------------------

## 20. Implementation Phases

### Phase 1 --- Core platform

Authentication, organizations, permissions, candidate profiles, company
onboarding, requisitions, jobs, applications, audit logging.

**Exit criteria:** the core recruitment workflow works with correct
tenant isolation.

### Phase 2 --- Candidate and employer experience

Job search, saved jobs, employer candidate search, profile access
controls, ATS, interviews, application timelines, interview-only chat.

**Exit criteria:** candidates and employers can complete the core hiring
journey.

### Phase 3 --- Monetization and finance

Plans, entitlements, usage ledger, payments, invoices, reconciliation,
commission agreements, placement triggers, payouts.

**Exit criteria:** financial events are traceable and duplicate-safe.

### Phase 4 --- Sales and agency operations

Lead pipeline, salesperson targets, performance, agency portal,
submissions, conflict resolution, agency commissions, advanced
reporting.

**Exit criteria:** sales and recruitment partnerships operate through
controlled workflows.

### Phase 5 --- Production hardening

Load testing, authorization audit, accessibility, monitoring, backups,
recovery, security testing, performance optimization.

**Exit criteria:** defined operational and security requirements are
met.

Durations should be estimated only after auditing the existing
repository and confirming integrations and scope.

------------------------------------------------------------------------

## 21. Acceptance Checklist

A module is not complete merely because its UI renders or a CRUD
endpoint returns success.

### Core functionality

-   Create/view/edit/archive work according to policy.
-   Search, filtering, sorting, and pagination work.
-   Validation and error messages are clear.
-   Loading, empty, failure, and permission-denied states exist.

### Permissions and privacy

-   Unauthorized roles cannot access restricted records.
-   Tenant and branch boundaries are enforced server-side.
-   Sensitive fields/documents are protected.
-   High-risk actions are confirmed and audited.

### Workflow and synchronization

-   Valid state transitions are enforced.
-   Related modules update after successful changes.
-   Duplicate events do not create duplicate records/charges.
-   Notifications and background jobs recover from failures.

### Enterprise readiness

-   Audit history exists for sensitive operations.
-   Responsive behavior works.
-   Accessibility and keyboard navigation are tested.
-   Automated tests cover permissions and edge cases.

------------------------------------------------------------------------

## 22. Repository Audit Before Development

Before building from this specification:

1.  Inspect the current frontend routes, components, state management,
    and permission guards.
2.  Inspect backend models, controllers, services, routes, middleware,
    and validation.
3.  Map existing entities to the logical data model in this document.
4.  Identify duplicated or conflicting fields and statuses.
5.  Review authentication, tenant isolation, and role enforcement.
6.  Review existing candidate/job/application workflows.
7.  Review payment, subscription, and commission code before changing
    it.
8.  Identify existing notifications, activity logs, and event handling.
9.  Mark every requirement as Implemented, Partial, Missing, Correction
    Required, or Deferred.
10. Create a dependency-ordered backlog with tests and acceptance
    criteria.

Do not recreate an existing service merely because the file name or UI
is unfamiliar. Verify actual behavior through code and tests.

------------------------------------------------------------------------

## 23. Decisions Required Before Final Implementation

The following items need explicit business decisions; this document does
not invent final answers.

1.  Final subscription plan names, prices, quotas, tax rules, and grace
    periods.
2.  Candidate access and disclosure policy for each subscription tier.
3.  Candidate data retention and deletion policy.
4.  Exact job approval and publishing policy.
5.  Which roles may access salary and sensitive candidate information.
6.  Commission trigger per commercial agreement.
7.  Agency candidate ownership/conflict resolution rules.
8.  Replacement, refund, and commission reversal terms.
9.  Supported payment provider and reconciliation process.
10. Whether candidate chat remains open after an interview is completed.
11. Company and agency verification requirements.
12. Email/SMS providers and communication consent rules.
13. Applicable legal, privacy, tax, and employment requirements.
14. Production hosting, monitoring, backup, and recovery targets.
15. Final report definitions and performance targets.

Record decisions in version-controlled configuration or product
documentation. Do not bury business rules in frontend conditionals.

------------------------------------------------------------------------

## 24. Final Product Direction

NexaTalent should operate as one integrated recruitment platform with
distinct, secure experiences for candidates, employers, internal teams,
recruitment agencies, and Super Admin.

The highest-priority engineering principles are:

1.  One authoritative candidate profile with controlled disclosure.
2.  One organization record connected to users, branches, jobs,
    subscriptions, and invoices.
3.  Separate requisitions, jobs, applications, interviews, offers, and
    placements.
4.  Backend-enforced entitlements for every subscription-restricted
    operation.
5.  Commission agreements linked to explicit placement triggers and
    auditable financial records.
6.  Lead conversion that preserves company and sales history.
7.  Interview-related chat restricted to authorized application
    participants.
8.  Recoverable state transitions and reliable event processing.
9.  Auditability, privacy, and tenant isolation from the beginning.
10. A repository audit before implementation to avoid rebuilding
    existing features.

**End of specification.**
