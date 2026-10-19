/**
 * Shared onboarding state — one source of truth for every actor
 * (candidate, company, agency).
 *
 * Onboarding is a FIRST-TIME flow. Once `completed` is true the actor's
 * details live in their normal Profile and can be edited there forever.
 * The UI gates the onboarding prompt/nav on this flag so a completed
 * actor is never asked to onboard again.
 */

export interface OnboardingProgress {
  completed: boolean;
  step: number;
  startedAt: string | null;
  updatedAt: string | null;
  completedAt: string | null;
}

/** Normalise whatever shape the API returns into a single progress object. */
export function readOnboarding(profile: any): OnboardingProgress {
  const ob = profile && typeof profile === 'object' ? profile.onboarding : null;
  const completed =
    ob?.completed === true ||
    ob?.status === 'completed' ||
    ob?.state === 'completed';
  const step = Number(ob?.step || 1);
  return {
    completed,
    step: Number.isFinite(step) && step > 0 ? step : 1,
    startedAt: ob?.startedAt || ob?.updatedAt || null,
    updatedAt: ob?.updatedAt || null,
    completedAt: ob?.completedAt || null,
  };
}

export function onboardingCompleted(profile: any): boolean {
  return readOnboarding(profile).completed;
}

/** Return a copy of `profile` with onboarding marked complete. */
export function withOnboardingComplete(profile: any, step = 9): any {
  const base =
    profile && typeof profile === 'object' ? profile : {};
  const ob =
    base.onboarding && typeof base.onboarding === 'object'
      ? base.onboarding
      : {};
  const now = new Date().toISOString();
  return {
    ...base,
    onboarding: {
      ...ob,
      step,
      completed: true,
      completedAt: ob.completedAt || now,
      updatedAt: now,
    },
  };
}
