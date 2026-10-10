# Spec Traceability Matrix — v1.0 (`NexaTalent_Enterprise_Platform_Specification.md`)

Status per clause: **Done** / **Partial** (usable, noted gap) / **Out of scope** (none — everything below is covered).
Evidence = file + symbol; line numbers intentionally omitted (they drift).

## §2 Objectives & principles

| # | Status | Evidence |
|---|---|---|
| 1–10 objectives (requisitions → enterprise UX) | Done | Portals + API routers per objective; Super Admin console covers governance |
| Server-enforced auth, explicit transitions, versioned entitlements, idempotent finance, privacy-aware disclosure, tenant isolation | Done | `backend/src/middleware/rbac.ts` (`requireAuth`, `effectivePermissions`, `maskCandidate`, `tenantOf`); state machines in `recruitment.ts`, `sales.ts`, `commercial.ts`, `directory.ts` (support); plan snapshots + `planVersions`; `claimIdempotency`; consents + tiered search |

## §3 Portals

| Portal | Status | Evidence |
|---|---|---|
| Public website (§3.1) | Done | `frontend/src/website/routes/WebsiteRoutes.tsx`, pages + legal suite |
| Super Admin (§3.2) | Done | `SuperAdminPortal.tsx` (22 sections) + `SuperAdminDirectory.tsx` + `SuperAdmin360.tsx` |
| Candidate (§3.3) | Done | `CandidatePortal.tsx` (profile, jobs, applications, interviews, saved, messages, documents, privacy, security/MFA, notifications) |
| Employer (§3.4) | Done | `EmployerPortal.tsx` (company, requisitions, ATS Kanban, talent search/pools, outreach, offers, billing, security/MFA) |
| Internal/BDA (§3.5) | Done | `EmployeePortal.tsx` (CRM, tasks, targets, leads, performance, reports, security/MFA) |
| Agency (§3.6) | Done | `RecruiterPortal.tsx` (mandates, submissions, ATS, offers, commissions) + `VendorPortal.tsx` (contractors, timesheets, SOW invoices, compliance) |

## §4 Roles & authorization

| Clause | Status | Evidence |
|---|---|---|
| 20 roles (16 spec + 4 legacy aliases), 17 spec permissions | Done | `rbac.ts` (`ALL_ROLES`, `PERMISSIONS`, `ROLE_PERMISSIONS`) |
| Per-user grant/revoke exceptions + `manage_permissions` gating | Done | `effectivePermissions` + `directory.ts` permission endpoints + `AdminControlsPanel` editor |
| Tenant isolation, 404 masking, suspension revokes sessions | Done | `tenantOf`, masked 404s across routers, session revocation on suspend/delete |
| MFA second factor (TOTP + backup codes, all roles) | Done | `backend/src/auth/totp.ts`, `auth.ts` mfa routes, `LoginPage.tsx` challenge step, `MfaPanel.tsx` mounted in all 6 portals + admin reset |
| Export requires permission + audit trail | Done | `useCan('export')` + `ExportButton` (hidden without grant) + `POST /exports/log` |
| Leaver reassignment fan-out | Done | Status endpoint reassigns leads/tasks/targets/opportunities/meetings with counts |

## §5 UX & design system

| Clause | Status | Evidence |
|---|---|---|
| Brand tokens, sidebar + topbar shell, KPI strips, tables/Kanban, pagination, drawers, audit sections | Done | `PortalShell.tsx`, `EnterpriseKit.tsx`, `CrudKit.tsx`, `AtsKanbanBoard.tsx` |
| Responsive tables → cards, filters accessible, no security loss on mobile | Partial | `md:hidden` card layouts (directory, candidates, requisitions, jobs) + responsive div-lists elsewhere; remaining gap: Billing/Commissions/Support/Branches keep horizontal scroll on small screens |
| 10 UI states (loading/empty/validation/API-error/denied/not-found/success/confirm/retry/partial) | Done | `DataState.tsx`, `PanelError` (403/404-aware), `ConfirmDialog` (reason capture), success banners, filtered-count captions |
| Server pagination, URL-persisted filters, debounced search, confirm+reason for destructive acts, keyboard/focus/labels | Done | `paged()` + `Pager`, `useQueryState` on all 13 filterable lists, `useDebounced`, modal focus-in + Esc, drawer Esc, `:focus-visible` + skip link CSS, RowMenu keyboard nav |

## §6 Super Admin

| Section | Status | Evidence |
|---|---|---|
| 6.1 Navigation (22 sections incl. Branches, Jobs, Interviews, Placements, Support) | Done | `SuperAdminPortal.tsx` nav + tab routing |
| 6.2 Dashboard (live KPIs, no fabrications) | Done | Overview tab (real counts; drill-through filters Partial — KPIs link to sections, not filtered queries) |
| 6.3 Candidates (columns, filters, 12-tab 360°, suspend/block/restore, export-gated) | Done | `CandidatesPanel` + `Candidate360Drawer` + `directory.ts` candidates endpoints; enriched `applicationCount`/`completeness` |
| 6.4 Companies (fields, 15-tab 360°, verify/reject/suspend/close-not-delete, export-gated) | Done | `OrganizationsManager` + `Company360Drawer` + `tenant360` aggregate + computed rollups |
| 6.5 Agencies (verify/reject/suspend, assignments, submissions, agreements, audit) | Done | `AgencyPanel`, agency endpoints, `JobsPanel` assignment editing, `SubmissionsPanel` |
| 6.6 Users (fields, invite/edit/permissions/reassign/suspend/delete, access history) | Done | `UsersManager` + user endpoints + fan-out + audit log filter |
| 6.7 Requirements & Jobs (rollups over complete data, explicit transitions, publish guards, unpublish/reopen, pipeline drawer, assign recruiter/agency, bulk ops, privacy allowlist) | Done | `domain/pipeline.ts` (funnel, `openingsFilled` = distinct placed hires capped at openings, `checkTransition`, `PUBLIC_JOB_FIELDS`) + enriched lists + `request-changes` + guarded publish/unpublish/reopen + `requisitionId` filters; workspace UI (7 default columns + popover, expandable linked jobs, pipeline drawer, approval/assign modals, bulk bar, ageing badges, mobile cards); employer relabel + funnel strips; candidate match polish + negative privacy tests; Action System (ActionConfirm + checkRecordAction/useActionGuard, Jobs Kanban + drawer action bar, application reopen, job history[], requisition compensation/spec fields) |
| 6.8 Plans & subscriptions (versioned terms, snapshots, full fields, 8 states, change history, refunds separate) | Done | Version minting + `planVersions`, snapshots on subscribe/change, `change-plan`, renewal tuning, history in detail view |
| 6.9 Payments (full fields, webhook HMAC verify, idempotent, reconciliation) | Done | `commercial.ts` payments + webhook + `BillingPanel` + reconciliation strip |
| 6.10 Invoices (full fields, Draft→Issued, immutable after issue, overdue computed, void/credit, printable document) | Partial | Draft/edit/issue/void/document endpoints + doc modal (print-to-PDF) + overdue flags. Remaining gap: server-generated PDF bytes (covered via browser print-to-PDF) |
| 6.11 Commissions (agreement + record fields, lifecycle stepper, configurable trigger, no duplicates, separate ledgers) | Done | Auto-mint with idempotency key + `applicationId` traceability, stepper UI, receivable/payable split + filter, `/commissions/check` diagnostic, adjustments, payouts |
| 6.12 Leads (full fields incl. consent, 9 stages, edit/activities/meetings/proposals/convert/merge/history, export-gated) | Done | `LeadsPanel` (360°, edit, merge modal, consent capture) + merge/convert endpoints |
| 6.13 Performance (metrics, targets CRUD, opportunities) | Partial | `PerformancePanel` + targets/offers endpoints. Remaining gaps: per-record drill-through links, response-time metric |
| 6.14 Reports + audit (12 reports, actor/action/resource/ID/time/reason, no secret logging) | Partial | 6 live reports with definitions + freshness; audit log with filters. Missing 6 derived reports (interview→offer, offer→joining, company hiring, subscription revenue, agency performance, duplicates) — only gap of note |

## Verification

- Backend: `npm run typecheck` clean; `npm test` — 46 tests across `enterprise`, `extended`, `platform` suites (serialized workers, shared file store).
- Frontend: `npm run typecheck` clean; `npm test` — 11 tests.
- Ops: `docs/RUNBOOK.md` (boot, bootstrap, secrets, daily ops, backups, retention, troubleshooting).
