import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react';
import { apiClient } from '../../shared/api-client';
import { getAccessToken, getTenantId, getUserEmail } from '../../shared/auth/session';

export interface Candidate {
  id: string;
  name: string;
  email: string;
  phone: string;
  roleTitle: string;
  experienceYears: number;
  location: string;
  currentCtc: string;
  expectedCtc: string;
  noticePeriod: string;
  skills: { name: string; score: number }[];
  matchScore: number;
  stage: 'Applied' | 'Ops Vetted' | 'Tech Round' | 'Executive Round' | 'Offer Issued' | 'Hired';
  jobId: string;
  jobTitle: string;
  submittedBy: string;
  sourceType: 'Direct' | 'Agency' | 'Vendor';
  resumeSummary: string;
  workHistory: { company: string; role: string; period: string; details: string }[];
  ratings?: { category: string; score: number }[];
  evaluatorNotes?: string;
}

export interface Requisition {
  id: string;
  title: string;
  department: string;
  companyName: string;
  location: string;
  budgetRange: string;
  experienceRequired: string;
  assignedAgencies: string[];
  assignedVendors: string[];
  status: 'Active' | 'Paused' | 'Closed';
  applicantsCount: number;
  createdAt: string;
}

export interface VendorContractor {
  id: string;
  name: string;
  skillset: string;
  vendorName: string;
  clientName: string;
  hourlyRate: string;
  status: 'Active Deployed' | 'Timesheet Pending' | 'Bench';
  hoursLoggedThisCycle: number;
}

export interface AuditEvent {
  id: string;
  timestamp: string;
  actor: string;
  action: string;
  tenantId: string;
  ipAddress: string;
}

interface PortalState {
  candidates: Candidate[];
  requisitions: Requisition[];
  contractors: VendorContractor[];
  auditLogs: AuditEvent[];
  isLoading: boolean;
  error: string | null;
  selectedCandidate: Candidate | null;
  inspectDrawerOpen: boolean;
  openInspectDrawer: (candidate: Candidate) => void;
  closeInspectDrawer: () => void;
  refreshAll: () => Promise<void>;
  moveCandidateStage: (candidateId: string, newStage: Candidate['stage'], notes?: string, ratings?: Candidate['ratings']) => Promise<void>;
  submitCandidate: (candidateData: Partial<Candidate>) => Promise<void>;
  addRequisition: (reqData: Partial<Requisition>) => Promise<void>;
}

function unwrapList<T>(res: unknown): T[] {
  const r = res as { data?: T[]; success?: boolean };
  if (r && typeof r === 'object' && 'data' in r && Array.isArray(r.data)) return r.data;
  if (Array.isArray(res)) return res as T[];
  return [];
}

/** API candidates carry skills as string | string[] | {name,score}[] | missing.
 *  Normalize so every consumer can safely .map over the result. */
export function normalizeSkills(skills: unknown): { name: string; score: number }[] {
  if (Array.isArray(skills)) {
    return skills
      .map((s) => {
        if (typeof s === 'string') return { name: s, score: 80 };
        if (s && typeof s === 'object') return { name: String((s as { name?: unknown }).name || 'Skill'), score: Number((s as { score?: unknown }).score) || 80 };
        return null;
      })
      .filter((x): x is { name: string; score: number } => x !== null)
      .slice(0, 12);
  }
  if (typeof skills === 'string' && skills.trim()) {
    return skills.split(',').map((s) => s.trim()).filter(Boolean).slice(0, 12).map((name) => ({ name, score: 80 }));
  }
  return [];
}

/** Safe lowercase for search filters over sparse API objects. */
export function safeLower(v: unknown): string {
  return String(v || '').toLowerCase();
}

const PortalStateContext = createContext<PortalState | undefined>(undefined);

export function PortalStateProvider({ children }: { children: ReactNode }) {
  // No seed/demo data: every collection starts empty and hydrates from the API.
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [requisitions, setRequisitions] = useState<Requisition[]>([]);
  const [contractors, setContractors] = useState<VendorContractor[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [inspectDrawerOpen, setInspectDrawerOpen] = useState(false);

  const refreshAll = useCallback(async () => {
    // Logged out (e.g. sitting on /login): never fire authenticated fetches.
    // Firing them token-less causes 401 storms that look like endless loading.
    if (!getAccessToken()) {
      setCandidates([]);
      setRequisitions([]);
      setContractors([]);
      setAuditLogs([]);
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const [jobsRes, candsRes, contractorsRes, auditRes] = await Promise.all([
        apiClient.get<Requisition[]>('/api/v1/jobs').catch(() => ({ data: [] as Requisition[] })),
        apiClient.get<Candidate[]>('/api/v1/candidates').catch(() => ({ data: [] as Candidate[] })),
        apiClient.get<VendorContractor[]>('/api/v1/contractors').catch(() => ({ data: [] as VendorContractor[] })),
        apiClient.get<AuditEvent[]>('/api/v1/audit-logs').catch(() => ({ data: [] as AuditEvent[] })),
      ]);
      setRequisitions(unwrapList<Requisition>(jobsRes));
      setCandidates(unwrapList<Candidate>(candsRes));
      setContractors(unwrapList<VendorContractor>(contractorsRes));
      setAuditLogs(unwrapList<AuditEvent>(auditRes));
    } catch (e: unknown) {
      setError((e as Error)?.message || 'Failed to load portal data.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshAll();
    // Role-to-role sync: refetch shared collections when any portal mutates
    // (throttled) and when the window regains focus.
    let last = 0;
    const onSync = () => {
      const now = Date.now();
      if (now - last < 5000) return;
      last = now;
      refreshAll();
    };
    window.addEventListener('nexa:sync', onSync);
    window.addEventListener('focus', onSync);
    return () => {
      window.removeEventListener('nexa:sync', onSync);
      window.removeEventListener('focus', onSync);
    };
  }, [refreshAll]);

  const openInspectDrawer = (candidate: Candidate) => {
    setSelectedCandidate(candidate);
    setInspectDrawerOpen(true);
  };

  const closeInspectDrawer = () => {
    setInspectDrawerOpen(false);
  };

  const refreshAudit = async () => {
    try {
      const res = await apiClient.get<AuditEvent[]>('/api/v1/audit-logs');
      setAuditLogs(unwrapList<AuditEvent>(res));
    } catch {
      // audit refresh is best-effort; section keeps last known entries
    }
  };

  const moveCandidateStage = async (
    candidateId: string,
    newStage: Candidate['stage'],
    notes?: string,
    ratings?: Candidate['ratings'],
  ) => {
    const prev = candidates;
    setCandidates((list) =>
      list.map((c) =>
        c.id === candidateId ? { ...c, stage: newStage, evaluatorNotes: notes ?? c.evaluatorNotes, ratings: ratings ?? c.ratings } : c,
      ),
    );
    try {
      await apiClient.patch(`/api/v1/candidates/${candidateId}/stage`, { stage: newStage, notes, ratings });
      await refreshAudit();
      try { window.dispatchEvent(new Event('nexa:sync')); } catch { /* noop */ }
    } catch (e) {
      // Roll back optimistic update so UI never diverges from the server
      setCandidates(prev);
      throw e;
    }
  };

  const submitCandidate = async (candidateData: Partial<Candidate>) => {
    if (!candidateData.name?.trim() || !candidateData.email?.trim()) {
      throw new Error('Candidate name and email are required.');
    }
    const res = await apiClient.post<Candidate>('/api/v1/candidates', {
      ...candidateData,
      stage: candidateData.stage || 'Applied',
      submittedBy: candidateData.submittedBy || getUserEmail() || 'Portal submission',
    });
    const created = (res as { data?: Candidate })?.data;
    await refreshAll();
    if (!created) await refreshAudit();
  };

  const addRequisition = async (reqData: Partial<Requisition>) => {
    if (!reqData.title?.trim()) {
      throw new Error('Requisition title is required.');
    }
    await apiClient.post<Requisition>('/api/v1/jobs', {
      ...reqData,
      status: 'Active',
      tenantId: getTenantId() || undefined,
    });
    // Re-fetch so employer-created jobs propagate to recruiter/candidate views (cross-role sync)
    await refreshAll();
  };

  return (
    <PortalStateContext.Provider
      value={{
        candidates,
        requisitions,
        contractors,
        auditLogs,
        isLoading,
        error,
        selectedCandidate,
        inspectDrawerOpen,
        openInspectDrawer,
        closeInspectDrawer,
        refreshAll,
        moveCandidateStage,
        submitCandidate,
        addRequisition,
      }}
    >
      {children}
    </PortalStateContext.Provider>
  );
}

const noopAsync = async () => {};

const defaultState: PortalState = {
  candidates: [],
  requisitions: [],
  contractors: [],
  auditLogs: [],
  isLoading: false,
  error: null,
  selectedCandidate: null,
  inspectDrawerOpen: false,
  openInspectDrawer: () => {},
  closeInspectDrawer: () => {},
  refreshAll: noopAsync,
  moveCandidateStage: noopAsync,
  submitCandidate: noopAsync,
  addRequisition: noopAsync,
};

export function usePortalState() {
  const context = useContext(PortalStateContext);
  if (!context) {
    throw new Error('usePortalState must be used within <PortalStateProvider>');
  }
  return context;
}

export function useOptionalPortalState(): PortalState {
  return useContext(PortalStateContext) || defaultState;
}
