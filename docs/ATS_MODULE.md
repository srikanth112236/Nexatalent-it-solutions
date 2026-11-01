# NexaTalent ATS Module — Architecture, Endpoints & Operations Manual

## 1. Overview
The **NexaTalent Applicant Tracking System (ATS)** is a native recruitment module built directly into the NexaTalent application stack. It provides an enterprise recruitment workflow without external subscription dependencies, duplicate databases, or isolated authentication silos.

---

## 2. Architecture & Data Storage
- **Unified Store**: Operates on `data/nexatalent.db.json` with Azure VM disk persistence and automatic write-flushing (`persist()`).
- **File & Resume Storage**: Local directory (`data/uploads/`) with support for Azure Blob Storage fallback container (`resumes-private`). Resumes are referenced by opaque `fileRef` tokens and served exclusively through authenticated RBAC streaming endpoints (`GET /api/v1/candidates/:id/resume`).
- **Native $0-Cost Resume Engine**: Asynchronous text extraction running inside Node.js with:
  - Magic byte format validation for PDF (`%PDF`), DOCX (`PK\x03\x04`), DOC (`\xD0\xCF\x11\xE0`), and plain text.
  - Native DOCX decompression via `zlib.inflateRawSync` extracting `word/document.xml`.
  - Skills taxonomy categorization across 6 domains (Backend, Frontend, Cloud & DevOps, Database, Architecture, QA & Testing).
  - Search token indexing (`searchTokens`) for instantaneous in-memory substring filtering.

---

## 3. RBAC & Access Matrix
ATS routes are guarded by `requireAuth(ATS_ROLES)`:
- `superadmin`: Unrestricted access across all branches, organizations, mandates, candidate pipelines, and financial reports.
- `employer`, `company_admin`: Access restricted to own tenant's requisitions and candidate applications.
- `internal_recruiter`, `recruiter`: Full candidate management, stage transitions, interview scheduling, and resume imports for assigned mandates.
- `hiring_manager`, `employee`: View pipeline and submit evaluation scorecards.
- `candidate`: Completely blocked with HTTP 403 from accessing ATS candidate databases, pipeline Kanban boards, recruiter notes, and internal reporting.

---

## 4. API Endpoints Reference

### Mandates & Requisitions
- `GET /api/v1/ats/jobs`: Paginated job listings with active applicants count and search.
- `GET /api/v1/ats/jobs/:id`: Requisition details, recruiter assignments, and custom pipeline stages.
- `POST /api/v1/ats/jobs`: Create new ATS job mandate.
- `PUT /api/v1/ats/jobs/:id`: Update mandate details, description, and status.
- `GET /api/v1/ats/jobs/:id/pipeline`: Full Kanban board dataset grouped by configured stages.
- `GET /api/v1/ats/jobs/:id/stages`: Retrieve configurable recruitment milestones.
- `PUT /api/v1/ats/jobs/:id/stages`: Persist customized recruitment stages.
- `PATCH /api/v1/ats/jobs/:id/recruiters`: Assign recruiters to mandate delivery.

### Candidate Master CRM & Applications
- `GET /api/v1/ats/candidates`: Master candidate directory with pagination, skills filter, and search tokens.
- `GET /api/v1/ats/candidates/:id`: Candidate 360 profile, resume streaming link, and application history.
- `POST /api/v1/ats/candidates`: Create candidate profile.
- `PUT /api/v1/ats/candidates/:id`: Edit candidate details.
- `POST /api/v1/ats/candidates/check-duplicate`: Pre-check duplicate candidate by email or phone.
- `POST /api/v1/ats/applications`: Link candidate to job mandate with stage assignment.
- `PATCH /api/v1/ats/applications/:id/stage`: Advance stage, record transition history, and emit candidate notifications.
- `GET /api/v1/ats/applications/:id/history`: Audit trail of all stage transitions.
- `GET /api/v1/ats/applications/:id/notes`: Recruiter evaluation notes and screening comments.
- `POST /api/v1/ats/applications/:id/notes`: Add evaluation note.
- `GET /api/v1/candidates/:id/resume`: Secure streaming of resume document.

### Resume Processing & Extraction Queue
- `POST /api/v1/ats/resumes/parse`: Multi-format text extraction (PDF, DOCX, DOC) with magic byte validation.
- `GET /api/v1/ats/resumes/queue`: Ingestion queue with statuses (`completed`, `reviewed`, `failed`).
- `POST /api/v1/ats/resumes/queue/:id/retry`: Re-reads binary file and retries text extraction.
- `PUT /api/v1/ats/resumes/parses/:id`: Saves recruiter corrections in `reviewOverrides`.
- `POST /api/v1/ats/resumes/parses/:id/confirm`: Commits reviewed candidate to CRM with search tokens.
- `POST /api/v1/ats/candidates/bulk-create`: Batch creation of parsed candidates into pipeline.
- `GET /api/v1/ats/duplicates`: List flagged duplicate candidate pairs.
- `POST /api/v1/ats/duplicates/merge`: Merge duplicate candidates preserving activity logs.

### Automation, Reminders & Advanced Analytics
- `POST /api/v1/ats/interviews/:id/remind`: Dispatches interview reminders to candidate and interviewer.
- `POST /api/v1/ats/automation/sweep`: Background automated check for stale candidates and 24h interview alerts.
- `GET /api/v1/ats/reminders/recruiter`: Recruiter action center (stale candidates, upcoming interviews, pending scorecards).
- `POST /api/v1/ats/reminders/resolve`: Dismiss or snooze recruiter reminders.
- `GET /api/v1/ats/reports/funnel`: Step-by-step conversion and drop-off rate funnel.
- `GET /api/v1/ats/reports/time-to-hire`: Average hire duration, stage dwell times, and job breakdown.
- `GET /api/v1/ats/reports/sources`: Sourcing channel effectiveness matrix (Website, LinkedIn, Import, Agency).
- `GET /api/v1/ats/reports/recruiter-workload`: Recruiter workload, candidate volume, and placement leaderboard.
- `GET /api/v1/ats/dashboard`: Real-time recruiter command center metrics.

---

## 5. Recruiter UI Views
Located in `frontend/src/portals/recruiter/ats/`:
- **`AtsDashboardView.tsx`**: Recruitment KPIs, pipeline stage distribution, and recent activity.
- **`AtsJobsView.tsx`**: Job requisition manager, recruiter assignment, and stage configurator.
- **`AtsJobPipelineView.tsx`**: Drag-and-drop Kanban pipeline board per requisition.
- **`AtsApplicantsView.tsx`**: Tabular applicant database with stage advance triggers.
- **`AtsCandidateCrmView.tsx`**: Candidate Master CRM with advanced multi-criteria filters.
- **`AtsInterviewCalendarView.tsx`**: Interview scheduler, calendar agenda, and scorecard ratings.
- **`AtsBulkImportView.tsx`**: Batch resume drag-and-drop staging, parse queue, and recruiter override modal.
- **`AtsReportsView.tsx`**: Interactive funnel step-downs, time-to-hire velocity, source yield, and follow-up alerts.
