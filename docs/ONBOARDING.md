# Onboarding — First-Time Only, Persisted, Editable

## Problem this solves

Before the fix, onboarding was **not consistent** and **re-appeared after completion**:

- The candidate wizard had no completion flag — it always restarted at step 1 on the next
  visit, so a candidate was asked the same questions again and again.
- The candidate nav item and dashboard banner were driven by "does a profile row exist",
  not "was onboarding finished".
- Companies and agencies had no onboarding state at all — the "complete your profile"
  prompt could show indefinitely.

## The principle

> **Onboarding is a first-time flow. Once completed, the details live in the Profile and
> can be edited there forever. The onboarding prompt, nav item and wizard must never
> reappear for a completed actor.**

This is now enforced in one place for all three actors: a server-persisted
`onboarding.completed` flag that the UI gates on.

---

## Data model

Every actor profile carries an `onboarding` object:

```jsonc
{
  "onboarding": {
    "step": 9,                     // last reached step (1..9 for candidates)
    "completed": true,             // the gate the UI reads
    "completedAt": "2026-10-18T…", // when it was finished
    "updatedAt": "2026-10-18T…"    // last progress save
  }
}
```

- `completed` is the single source of truth. The UI never asks "is the profile empty?" —
  it asks `onboarding.completed === true`.
- `completedAt` is immutable once set (the UI keeps the original timestamp).
- Partial progress saves `step` with `completed: false`.

## Per-actor flow

| Actor | First-time | Once completed |
|---|---|---|
| **Candidate** | Registration seeds `onboarding: { step: 1 }`. The portal shows the "Complete onboarding" banner and the **Onboarding** nav item; the wizard collects the 9 sections. | The **Onboarding** nav item disappears; visiting `/candidate/onboarding` shows a "Onboarding complete" state; all details are edited under **My Profile & CV**. |
| **Company** | The company profile tab shows a "Complete setup" banner and the status banner reads "Complete your profile below…". | The banner disappears; the status banner reads "Setup complete — verification review follows automatically."; the profile stays editable under **Company Profile**. |
| **Agency** | The agency profile tab shows a "Complete setup" banner. | The banner disappears; the profile stays editable under **Agency Profile**. |

In every case, saving the profile marks `onboarding.completed = true`. Editing the profile
afterwards never clears it.

## API contract

| Actor | Endpoint | Field |
|---|---|---|
| Candidate | `GET/PUT /api/v1/candidate/profile` | `onboarding` |
| Company | `GET/PUT /api/v1/company` | `onboarding` |
| Agency | `GET/PATCH /api/v1/agency-profiles/:id` | `onboarding` |

The frontend normalises these with `frontend/src/shared/onboarding.ts`
(`readOnboarding`, `onboardingCompleted`, `withOnboardingComplete`).

Regression tests live in `backend/tests/onboarding.test.ts`:
registration seeds an **incomplete** onboarding, completion persists across reads and
later profile edits, and the same holds for companies and agencies.

---

## Recommended architecture (the clean way)

The current fix is deliberately small and consistent across the three actors. The clean
end-state is a single **Onboarding Service** so the rule is never re-implemented:

1. **One domain object** — `OnboardingState { actorType, actorId, step, completed,
   completedAt }` stored per actor, not embedded ad hoc in each profile.
2. **One API** — `GET /api/v1/onboarding/:actorType/:actorId` and
   `POST /api/v1/onboarding/:actorType/:actorId/complete`.
3. **One client hook** — `useOnboarding(actor)` returns `{ completed, step, complete() }`
   and drives every portal's banner/nav/wizard from the same flag.
4. **Idempotent completion** — `complete()` is safe to call repeatedly; the first call
   wins (`completedAt` is set once).
5. **Profile is the source of truth for data** — onboarding only tracks *completion*;
   the actual details always live in the profile and are edited there after onboarding.

Until that service exists, the shared `onboarding.ts` helper plus the `completed` flag is
the contract every portal must honour.

## What changed (this fix)

- **Backend**: `onboarding` added to the company and agency profile write paths; finance
  deny-by-default aligned with the spec (`internal_recruiter`, `candidate`); password
  reset validates the token before the password rules; job edit-lock distinguishes
  `VISIBILITY_LOCKED` / `EDIT_LOCKED` and allows operational `expiryDate` edits; job
  reopen restores the auto-closed parent requisition.
- **Frontend**: candidate/company/agency portals gate on `onboarding.completed`; the
  candidate wizard persists completion; a completion state replaces the wizard for
  already-onboarded candidates.
- **Tests**: `backend/tests/onboarding.test.ts` (new) and the full suite (112 tests)
  pass with file parallelism disabled (the suites share one JSON DB file).
