import { jobsApi } from '../../shared/enterprise/phaseApi';

export interface PublishResult {
  id: string;
  ok: boolean;
  message: string;
}

const FUTURE_EXPIRY = () => {
  const d = new Date();
  d.setDate(d.getDate() + 30);
  return d.toISOString().slice(0, 10);
};

/** Walk a job to Published through the legal status chain (Draft→Review→Approved→Published). */
export async function publishJob(id: string, fromStatus: string): Promise<PublishResult> {
  const chain: Record<string, string[]> = {
    Draft: ['Pending Review', 'Approved', 'Published'],
    'Pending Review': ['Approved', 'Published'],
    Approved: ['Published'],
    Paused: ['Published'],
    Closed: ['Published'],
  };
  const steps = chain[fromStatus];
  if (!steps) return { id, ok: false, message: `Cannot add from status ${fromStatus}.` };
  try {
    for (const next of steps) {
      const isPublish = next === 'Published';
      const isReopen = fromStatus === 'Closed' && isPublish;
      await jobsApi.setStatus(
        id,
        next,
        next === 'Published' && (fromStatus === 'Paused' || fromStatus === 'Closed') ? 'Reopened to open positions' : undefined,
        isPublish ? FUTURE_EXPIRY() : undefined,
      );
      void isReopen;
    }
    return { id, ok: true, message: 'Added to open positions.' };
  } catch (e: any) {
    return { id, ok: false, message: e?.message || 'Publish failed.' };
  }
}

/** Remove a job from the public board (Published → Approved). */
export async function unpublishJob(id: string): Promise<PublishResult> {
  try {
    await jobsApi.setStatus(id, 'Approved', 'Removed from open positions');
    return { id, ok: true, message: 'Removed from open positions.' };
  } catch (e: any) {
    return { id, ok: false, message: e?.message || 'Unpublish failed.' };
  }
}

export async function bulkPublish(jobs: { id: string; status: string }[]): Promise<PublishResult[]> {
  const results: PublishResult[] = [];
  for (const j of jobs) {
    if (j.status === 'Published') {
      results.push({ id: j.id, ok: true, message: 'Already open.' });
      continue;
    }
    results.push(await publishJob(j.id, j.status));
  }
  return results;
}
