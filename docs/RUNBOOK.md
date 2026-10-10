# NexaTalent Operations Runbook

Target reader: whoever runs the deployment. Commands assume repo root unless stated.

## 1. Services & ports

- Backend: `backend/` — Express + Zod + JWT. Default `http://localhost:5000` (`PORT`).
- Frontend: `frontend/` — Vite + React. Dev default `http://localhost:4200` (`VITE_API_BASE_URL` points at the backend).

## 2. Environment

| Variable | Where | Purpose |
|---|---|---|
| `PORT` | backend | API listen port (default 5000) |
| `DEMO_SEED` | backend | `off` = boot with an **empty** directory (production). Anything else = seed demo orgs/users (local dev only) |
| `BOOTSTRAP_KEY` | backend | One-time secret for `POST /api/v1/auth/bootstrap` (first platform owner on empty directory) |
| `JWT_SECRET`, `REFRESH_TOKEN_SECRET` | backend | Token signing. Rotate by replacing + restarting (all sessions invalidate) |
| `JWT_ACCESS_TTL` / `JWT_REFRESH_TTL` | backend | Defaults `15m` / `7d` |
| `PAYMENT_WEBHOOK_SECRET` | backend | HMAC secret for `POST /api/v1/payments/webhook`. Webhook receiver returns **503** until set |
| `CORS_ORIGINS`, `CLIENT_URL` | backend | Allowed frontend origins (see `backend/.env.example`) |
| `VITE_API_BASE_URL` | frontend | Backend base URL |

Secrets live in `.env` files, which are **gitignored** — never commit them. Only `.env.example` is tracked.

## 3. First boot (production)

1. `DEMO_SEED=off` in the backend environment.
2. Start the API, confirm `GET /api/health` → `healthy`.
3. `POST /api/v1/auth/bootstrap` with `{ key: BOOTSTRAP_KEY, name, email, password (12+ chars) }`. It refuses when users already exist (403).
4. Sign in as platform owner, provision tenants, invite users.
5. Set `PAYMENT_WEBHOOK_SECRET` before accepting provider webhooks.

Verified 2026-10-10: empty boot returns 401 on login and 403 on bootstrap with a wrong key.

## 4. Daily operations (all audited with actor + timestamp)

- **Suspend/reactivate user or org** — needs a reason; sessions are revoked immediately. Suspended orgs also lock member access.
- **Leaver** — suspend with `reassignTo`; the API reassigns owned leads, tasks, targets, opportunities, meetings and reports counts. Delete is soft (`Deleted`); platform admins cannot be deleted.
- **Close org with history** — `DELETE /tenants/:id` closes (recoverable) instead of deleting when jobs, applications, invoices or placements exist.
- **Invoice correction** — never edit an Issued invoice: `void` (with reason; Paid/Credited blocked) or issue a `credit-note`. Drafts are editable and issuable.
- **Refund** — idempotent per payment+amount+reason; adjusts payment status and invoice balance.
- **Commission** — approve only from Pending; payout only when Approved and Unpaid; adjustments recompute gross/tax/total. `GET /commissions/check` answers duplicate placement+trigger questions.
- **Lead duplicates** — `POST /leads/:id/merge` moves activities/meetings/proposals/opportunities and trails history. Won leads are protected.
- **MFA lockout** — `POST /api/v1/auth/mfa/reset` (superadmin/platform_owner + `manage_permissions`) clears a user's second factor; they re-enroll on next sign-in.
- **Permission exceptions** — grant/revoke single permissions per user over the role template; clearing restores template behavior.

## 5. Backups & retention

- The dev file store (`backend/data/`, gitignored) is **not a backup strategy**. Copy the directory for a snapshot; production needs a managed database (the API layer is already collection-oriented for migration).
- In-store caps: audit logs 5000, outbox 2000, notifications 2000, idempotency keys 5000. Eviction is newest-kept; treat the JSON store as ephemeral and export audit data before it rolls.

## 6. Troubleshooting

| Symptom | Meaning |
|---|---|
| 401 `Invalid or expired token` | Sign in again; refresh rotation may have been reused (reuse = forced re-login) |
| 403 workspace message | Account exists under a different role — use its own workspace |
| 404 for a record you expect | Cross-tenant IDs are masked as 404 by design; check tenant scope |
| 409 `Already…` / `Exists` | Idempotency or duplicate guard fired — safe to treat as success |
| 422 transition errors | State machine rejected the jump; the message lists allowed targets |
| 429 quota / 402 subscription / 403 entitlement | Subscription gate — check plan version, usage ledger, renewal |
| Webhook 401 stale/bad signature | Clock skew > 5 min or wrong `PAYMENT_WEBHOOK_SECRET` |
| Login returns `mfaRequired` | Password passed — complete `POST /api/v1/auth/mfa/challenge` with ticket + code |

## 7. Verification

- Backend: `npm run typecheck`, `npm test` (46 tests; workers serialized via `--pool=forks --maxWorkers=1` because suites share the file store).
- Frontend: `npm run typecheck`, `npm test` (11 tests).
- Spec traceability: `docs/SPEC-MATRIX.md`.
