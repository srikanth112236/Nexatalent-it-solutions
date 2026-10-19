# NexaTalent — Roles, Responsibilities & Permissions

> Source of truth: `backend/src/middleware/rbac.ts` (role → permission template) and
> `backend/src/db/store.ts` (`seedRoles`). This document mirrors that code and explains
> what each role actually does in the product.

## How authorization works

- **Permissions** (17): `view`, `create`, `edit`, `archive`, `delete`, `approve`, `reject`,
  `suspend`, `restore`, `assign`, `export`, `manage_billing`, `manage_permissions`,
  `view_sensitive_fields`, `reconcile`, `refund`, `adjust_commission`.
- Every role gets a **permission template**. A stored role row (`roles` collection) can
  override the template, and per-user grants/revokes (`userRoles`) can add/remove single
  permissions. The effective set is what the server enforces.
- **Tenant isolation**: platform roles may pass `X-Tenant-ID`; everyone else is locked to
  their own tenant (the server is authoritative — a client claim is ignored).
- **Finance deny-by-default**: roles in `FINANCE_BLOCKED_ROLES` cannot read financial
  ledgers (`commissions`, `invoices`, `payouts`, `payments`, agreements, fee slabs,
  payroll) unless they hold an explicit finance grant (`manage_billing`, `reconcile`,
  `adjust_commission`, `refund`).

---

## 1. Platform roles

### `platform_owner`
- **Permissions**: all 17.
- **Does**: full ownership — every tenant, every module, platform configuration,
  billing, users, roles, and platform-wide analytics. Created once via `/auth/bootstrap`.
- **Portal**: `/superadmin` (and every portal via role override).

### `superadmin`
- **Permissions**: all 17.
- **Does**: day-to-day administration of the whole platform — verifies companies and
  agencies, manages users/roles, moderates jobs, handles finance, support, and exports.
- **Portal**: `/superadmin`.

### `operations_admin`
- **Permissions**: view, create, edit, archive, approve, reject, suspend, restore, assign, export.
- **Does**: recruitment operations — requisitions, jobs, candidate pipelines, interviews,
  placements, tenant verification. Reads finance records (read-only) to keep delivery
  and billing in sync; cannot mutate them.
- **Portal**: `/employee`.

### `finance_admin`
- **Permissions**: view, create, edit, manage_billing, reconcile, refund, export,
  view_sensitive_fields.
- **Does**: billing, invoices, payments, refunds, commissions, payouts, payroll runs,
  and reconciliation. Can see sensitive fields (candidate phone / current CTC).
- **Portal**: `/employee` (finance sections).

### `sales_admin`
- **Permissions**: view, create, edit, assign, export.
- **Does**: leads, opportunities, submissions and the sales pipeline. Finance access is
  denied by default.
- **Portal**: `/employee` (sales sections).

### `support_admin`
- **Permissions**: view, assign.
- **Does**: support tickets and account assistance. Least-privileged platform role;
  cannot create/edit records or read finance.
- **Portal**: `/employee` (support sections).

### `employee`
- **Permissions**: view, create, edit, archive, approve, reject, suspend, restore, assign, export.
- **Does**: **legacy alias** of operations/delivery staff. Kept for backward compatibility
  with older accounts; new provisioning should use the specific platform roles.
- **Portal**: `/employee`.

### `internal_recruiter`
- **Permissions**: view, create, edit, assign, export.
- **Does**: platform-side recruiter who works **assigned** mandates only. Can create and
  advance applications on jobs assigned to them, schedule interviews, and export their
  pipeline. Finance ledgers are denied by default (must not see commissions/invoices).
- **Portal**: `/employee` (assigned-mandate view).

---

## 2. Company (employer) roles

### `company_admin`
- **Permissions**: view, create, edit, archive, assign, manage_billing, export.
- **Does**: owns the company workspace — invites team members, manages the company
  profile/KYC, posts requirements and jobs, runs the pipeline, and manages billing.
- **Portal**: `/employer`.

### `hiring_manager`
- **Permissions**: view, create, edit, approve, reject, assign.
- **Does**: owns requisitions — approves/rejects requirements, interviews and offers.
  Can reopen closed jobs (needs `approve`).
- **Portal**: `/employer`.

### `company_recruiter`
- **Permissions**: view, create, edit, assign, export.
- **Does**: runs sourcing, shortlists, scheduling and submissions for the company's
  mandates. Cannot approve offers or manage billing.
- **Portal**: `/employer`.

### `employer`
- **Permissions**: view, create, edit, archive, assign, manage_billing, export.
- **Does**: **legacy alias** of the company hiring user. New accounts should use
  `company_admin` / `hiring_manager` / `company_recruiter`.
- **Portal**: `/employer`.

---

## 3. Agency & vendor roles

### `agency_admin`
- **Permissions**: view, create, edit, assign, export.
- **Does**: owns an agency partner — receives mandates, manages submissions, tracks
  placements and commission statements. May self-edit its own agency profile (limited
  fields; verification/account status is read-only).
- **Portal**: `/recruiter`.

### `agency_recruiter`
- **Permissions**: view, create, edit.
- **Does**: agency recruiter who submits candidates and works the pipeline for the
  agency. No export, no finance.
- **Portal**: `/recruiter`.

### `recruiter`
- **Permissions**: view, create, edit, assign, export.
- **Does**: **legacy alias** of the agency recruiter. Finance ledgers denied by default.
- **Portal**: `/recruiter`.

### `vendor`
- **Permissions**: view, create, edit, assign, export.
- **Does**: contingent staffing vendor — manages contractors, rate cards, SOWs,
  timesheets and compliance. Finance ledgers denied by default (a finance grant is
  required to read commission/payout records).
- **Portal**: `/vendor`.

### `finance_staff`
- **Permissions**: view, create, edit, reconcile.
- **Does**: read-mostly finance support. Can reconcile but cannot refund or process
  payouts.
- **Portal**: `/employee` (finance sections).

---

## 4. Candidate

### `candidate`
- **Permissions**: view, create, edit.
- **Does**: job seeker — builds a profile/CV, completes onboarding, browses curated jobs,
  applies, tracks applications and interviews, manages documents, privacy consents,
  timesheets and saved jobs. Finance ledgers are denied by default.
- **Portal**: `/candidate`.

---

## Quick reference

| Role | Scope | Portal | Can read finance? |
|---|---|---|---|
| `platform_owner` | Platform | `/superadmin` | ✅ |
| `superadmin` | Platform | `/superadmin` | ✅ |
| `operations_admin` | Platform | `/employee` | read-only |
| `finance_admin` | Platform | `/employee` | ✅ |
| `finance_staff` | Platform | `/employee` | read-only (reconcile) |
| `sales_admin` | Platform | `/employee` | ❌ |
| `support_admin` | Platform | `/employee` | ❌ |
| `internal_recruiter` | Platform | `/employee` | ❌ |
| `employee` | Platform (legacy) | `/employee` | read-only |
| `company_admin` | Company | `/employer` | via `manage_billing` |
| `hiring_manager` | Company | `/employer` | ❌ |
| `company_recruiter` | Company | `/employer` | ❌ |
| `employer` | Company (legacy) | `/employer` | via `manage_billing` |
| `agency_admin` | Agency | `/recruiter` | ❌ |
| `agency_recruiter` | Agency | `/recruiter` | ❌ |
| `recruiter` | Agency (legacy) | `/recruiter` | ❌ |
| `vendor` | Agency | `/vendor` | ❌ |
| `candidate` | Candidate | `/candidate` | ❌ |

> The four legacy aliases (`employee`, `employer`, `recruiter`, `vendor`) exist so older
> accounts and integrations keep working. Prefer the specific roles for new provisioning.
