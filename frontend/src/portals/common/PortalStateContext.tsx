import { createContext, useContext, type ReactNode } from 'react';

// Phase F: the legacy mock store is retired. Portals read live server data
// through phaseApi + guards; this provider remains only as a mount point so
// existing shells/tests keep working. No collections are fetched or cached here,
// so no stale PII sits in browser memory and focus refetches are gone.

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
  stage: string;
  jobId: string;
  jobTitle: string;
  submittedBy: string;
  sourceType: string;
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
  status: string;
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
  status: string;
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
  // P3: explicit status so consumers can tell loading vs empty vs error.
  // This provider is a mount-point only (no fetch); portals own their
  // loading/error via phaseApi. Empty arrays + isLoading:false means
  // "no cached data", not "loaded empty".
  status: 'empty-no-fetch' | 'loading' | 'ready' | 'error';
}

const PortalStateContext = createContext<PortalState | undefined>(undefined);

export function PortalStateProvider({ children }: { children: ReactNode }) {
  return (
    <PortalStateContext.Provider
      value={{ candidates: [], requisitions: [], contractors: [], auditLogs: [], isLoading: false, error: null, status: 'empty-no-fetch' }}
    >
      {children}
    </PortalStateContext.Provider>
  );
}

const defaultState: PortalState = {
  candidates: [],
  requisitions: [],
  contractors: [],
  auditLogs: [],
  isLoading: false,
  error: null,
  status: 'empty-no-fetch',
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
