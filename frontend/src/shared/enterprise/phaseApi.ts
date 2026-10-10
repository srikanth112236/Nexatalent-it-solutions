import { apiClient } from '../api-client';

/**
 * Enterprise Phase API — typed surface for all 5 spec phases.
 * Every portal imports from here so server ↔ frontend stay in sync.
 * All calls return the backend ApiResponse shape { success, data, ... }.
 */

// Phase 1 — core
export const requisitionsApi = {
  list: (params = '') => apiClient.get<unknown[]>(`/api/v1/requisitions${params}`),
  create: (body: unknown) => apiClient.post('/api/v1/requisitions', body),
  update: (id: string, body: unknown) => apiClient.put(`/api/v1/requisitions/${id}`, body),
  remove: (id: string) => apiClient.delete(`/api/v1/requisitions/${id}`),
  setStatus: (id: string, status: string) => apiClient.patch(`/api/v1/requisitions/${id}/status`, { status }),
};
export const jobsApi = {
  list: (params = '') => apiClient.get<unknown[]>(`/api/v1/jobs${params}`),
  public: (params = '') => apiClient.get<unknown[]>(`/api/v1/jobs-public${params}`),
  detail: (id: string) => apiClient.get(`/api/v1/jobs/${id}`),
  create: (body: unknown) => apiClient.post('/api/v1/jobs', body),
  update: (id: string, body: unknown) => apiClient.put(`/api/v1/jobs/${id}`, body),
  setStatus: (id: string, status: string) => apiClient.patch(`/api/v1/jobs/${id}/status`, { status }),
};
export const directoryApi = {
  tenants: () => apiClient.get('/api/v1/tenants'),
  updateTenant: (id: string, body: unknown) => apiClient.patch(`/api/v1/tenants/${id}`, body),
  deleteTenant: (id: string, reason?: string) => apiClient.delete(`/api/v1/tenants/${id}${reason ? `?reason=${encodeURIComponent(reason)}` : ''}`, { reason } as unknown as undefined),
  verifyTenant: (id: string, decision: 'approve' | 'reject') => apiClient.patch(`/api/v1/tenants/${id}/verify`, { decision }),
  suspendTenant: (id: string, reason: string, action = 'suspend') => apiClient.patch(`/api/v1/tenants/${id}/suspend`, { reason, action }),
  users: (params = '') => apiClient.get(`/api/v1/users${params}`),
  createUser: (body: unknown) => apiClient.post('/api/v1/users', body),
  editUser: (id: string, body: unknown) => apiClient.put(`/api/v1/users/${id}`, body),
  setUserStatus: (id: string, status: string, reason: string, reassignTo?: string) => apiClient.patch(`/api/v1/users/${id}/status`, { status, reason, reassignTo }),
  deleteUser: (id: string, reason?: string) => apiClient.delete(`/api/v1/users/${id}`, { reason } as unknown as undefined),
  branches: () => apiClient.get('/api/v1/branches'),
  createBranch: (body: unknown) => apiClient.post('/api/v1/branches', body),
  candidatesDirectory: (params = '') => apiClient.get(`/api/v1/directory/candidates${params}`),
  updateCandidate: (id: string, body: unknown) => apiClient.put(`/api/v1/directory/candidates/${id}`, body),
  setCandidateStatus: (id: string, status: string, reason: string) => apiClient.patch(`/api/v1/directory/candidates/${id}/status`, { status, reason }),
  auditLogs: (params = '') => apiClient.get(`/api/v1/audit-logs${params}`),
};

// Phase 2 — experience
export const applicationsApi = {
  list: (params = '') => apiClient.get(`/api/v1/applications${params}`),
  apply: (jobId: string, candidateEmail: string) => apiClient.post('/api/v1/applications', { jobId, candidateEmail }),
  setStage: (id: string, stage: string, reason?: string) => apiClient.patch(`/api/v1/applications/${id}/stage`, { stage, reason }),
  withdraw: (id: string, reason?: string) => apiClient.post(`/api/v1/applications/${id}/withdraw`, { reason }),
};
export const interviewsApi = {
  list: () => apiClient.get('/api/v1/interviews'),
  schedule: (body: unknown) => apiClient.post('/api/v1/interviews', body),
  reschedule: (id: string, body: unknown) => apiClient.patch(`/api/v1/interviews/${id}`, body),
  feedback: (id: string, body: unknown) => apiClient.post(`/api/v1/interviews/${id}/feedback`, body),
};
export const chatApi = {
  conversations: (applicationId?: string) => apiClient.get(`/api/v1/conversations${applicationId ? `?applicationId=${applicationId}` : ''}`),
  thread: (id: string) => apiClient.get(`/api/v1/conversations/${id}/messages`),
  send: (conversationId: string, body: string) => apiClient.post('/api/v1/messages', { conversationId, body }),
  close: (id: string, reason?: string) => apiClient.patch(`/api/v1/conversations/${id}/close`, { reason }),
};
export const talentApi = {
  search: (tier = 'preview', q = '') => apiClient.get(`/api/v1/candidates/search?tier=${tier}&q=${encodeURIComponent(q)}`),
  pools: () => apiClient.get('/api/v1/talent-pools'),
  createPool: (body: unknown) => apiClient.post('/api/v1/talent-pools', body),
  editPool: (id: string, body: unknown) => apiClient.patch(`/api/v1/talent-pools/${id}`, body),
  addMember: (poolId: string, candidateId: string) => apiClient.post(`/api/v1/talent-pools/${poolId}/members`, { candidateId }),
  poolMembers: (poolId: string) => apiClient.get(`/api/v1/talent-pools/${poolId}/members`),
  removeMember: (poolId: string, memberId: string) => apiClient.delete(`/api/v1/talent-pools/${poolId}/members/${memberId}`),
  saved: () => apiClient.get('/api/v1/saved-jobs'),
  save: (jobId: string) => apiClient.post('/api/v1/saved-jobs', { jobId }),
  unsave: (jobId: string) => apiClient.delete(`/api/v1/saved-jobs/${jobId}`),
};
export const offersPlacementsApi = {
  offer: (body: unknown) => apiClient.post('/api/v1/offers', body),
  place: (applicationId: string, joinDate?: string, feeBasis?: number) => apiClient.post('/api/v1/placements', { applicationId, joinDate, feeBasis }),
  placements: () => apiClient.get('/api/v1/placements'),
};

// Phase 3 — monetization
export const billingApi = {
  plans: () => apiClient.get('/api/v1/plans'),
  createPlan: (body: unknown) => apiClient.post('/api/v1/plans', body),
  subscriptions: () => apiClient.get('/api/v1/subscriptions'),
  subscribe: (orgId: string, planId: string) => apiClient.post('/api/v1/subscriptions', { orgId, planId }),
  setSubscription: (id: string, status: string, reason?: string) => apiClient.patch(`/api/v1/subscriptions/${id}/status`, { status, reason }),
  usage: () => apiClient.get('/api/v1/usage'),
  outreach: (body: unknown) => apiClient.post('/api/v1/outreach', body),
  campaigns: () => apiClient.get('/api/v1/outreach'),
  invoices: () => apiClient.get('/api/v1/invoices'),
  createInvoice: (body: unknown) => apiClient.post('/api/v1/invoices', body),
  voidInvoice: (id: string, reason: string) => apiClient.patch(`/api/v1/invoices/${id}/void`, { reason }),
  creditNote: (invoiceId: string, amount: number, reason: string) => apiClient.post('/api/v1/credit-notes', { invoiceId, amount, reason }),
  payments: () => apiClient.get('/api/v1/payments'),
  pay: (invoiceId: string, amount: number, idempotencyKey: string) => apiClient.post('/api/v1/payments', { invoiceId, amount, idempotencyKey }),
  refunds: () => apiClient.get('/api/v1/refunds'),
  refund: (paymentId: string, amount: number, reason: string) => apiClient.post('/api/v1/refunds', { paymentId, amount, reason }),
  agreements: () => apiClient.get('/api/v1/commission-agreements'),
  createAgreement: (body: unknown) => apiClient.post('/api/v1/commission-agreements', body),
  commissions: () => apiClient.get('/api/v1/commissions'),
  approveCommission: (id: string) => apiClient.patch(`/api/v1/commissions/${id}/approve`, {}),
  payout: (commissionId: string) => apiClient.post('/api/v1/payouts', { commissionId }),
  payouts: () => apiClient.get('/api/v1/payouts'),
  reconciliation: () => apiClient.get('/api/v1/reconciliation'),
};

// Phase 4 — sales + agency
export const salesApi = {
  leads: (params = '') => apiClient.get(`/api/v1/leads${params}`),
  createLead: (body: unknown) => apiClient.post('/api/v1/leads', body),
  updateLead: (id: string, body: unknown) => apiClient.put(`/api/v1/leads/${id}`, body),
  deleteLead: (id: string) => apiClient.delete(`/api/v1/leads/${id}`),
  setLeadStage: (id: string, stage: string, reason?: string) => apiClient.patch(`/api/v1/leads/${id}/stage`, { stage, reason }),
  logActivity: (id: string, body: unknown) => apiClient.post(`/api/v1/leads/${id}/activities`, body),
  activities: (id: string) => apiClient.get(`/api/v1/leads/${id}/activities`),
  convert: (id: string) => apiClient.post(`/api/v1/leads/${id}/convert`, {}),
  targets: () => apiClient.get('/api/v1/targets'),
  createTarget: (body: unknown) => apiClient.post('/api/v1/targets', body),
  updateTarget: (id: string, body: unknown) => apiClient.put(`/api/v1/targets/${id}`, body),
  deleteTarget: (id: string) => apiClient.delete(`/api/v1/targets/${id}`),
  performance: () => apiClient.get('/api/v1/performance'),
  submissions: (params = '') => apiClient.get(`/api/v1/submissions${params}`),
  submit: (body: unknown) => apiClient.post('/api/v1/submissions', body),
  setSubmission: (id: string, status: string) => apiClient.patch(`/api/v1/submissions/${id}/status`, { status }),
  opportunities: (params = '') => apiClient.get(`/api/v1/opportunities${params}`),
  createOpportunity: (body: unknown) => apiClient.post('/api/v1/opportunities', body),
  setOpportunityStage: (id: string, stage: string) => apiClient.patch(`/api/v1/opportunities/${id}/stage`, { stage }),
  proposals: (leadId?: string) => apiClient.get(`/api/v1/proposals${leadId ? `?leadId=${leadId}` : ''}`),
  createProposal: (body: unknown) => apiClient.post('/api/v1/proposals', body),
  setProposalStatus: (id: string, status: string) => apiClient.patch(`/api/v1/proposals/${id}/status`, { status }),
  meetings: (leadId?: string) => apiClient.get(`/api/v1/meetings${leadId ? `?leadId=${leadId}` : ''}`),
  createMeeting: (body: unknown) => apiClient.post('/api/v1/meetings', body),
  updateMeeting: (id: string, body: unknown) => apiClient.patch(`/api/v1/meetings/${id}`, body),
};

export const documentsApi = {
  skills: (q = '') => apiClient.get(`/api/v1/skills${q ? `?q=${encodeURIComponent(q)}` : ''}`),
  createSkill: (body: unknown) => apiClient.post('/api/v1/skills', body),
  upload: (body: unknown) => apiClient.post('/api/v1/documents', body),
  list: () => apiClient.get('/api/v1/documents'),
  downloadUrl: (id: string) => `/api/v1/documents/${id}/download`,
  consents: () => apiClient.get('/api/v1/consents'),
  saveConsents: (body: unknown) => apiClient.put('/api/v1/consents', body),
  withdrawConsents: (email?: string) => apiClient.post('/api/v1/consents/withdraw', { email }),
  exportData: (email?: string) => apiClient.get(`/api/v1/consents/export${email ? `?email=${encodeURIComponent(email)}` : ''}`),
};

export const workforceApi = {
  timesheets: (params = '') => apiClient.get(`/api/v1/timesheets${params}`),
  submitTimesheet: (body: unknown) => apiClient.post('/api/v1/timesheets', body),
  reviewTimesheet: (id: string, decision: 'approve' | 'reject', note?: string) => apiClient.patch(`/api/v1/timesheets/${id}/approve`, { decision, note }),
  agencies: () => apiClient.get('/api/v1/agency-profiles'),
  createAgency: (body: unknown) => apiClient.post('/api/v1/agency-profiles', body),
  updateAgency: (id: string, body: unknown) => apiClient.patch(`/api/v1/agency-profiles/${id}`, body),
  adjustments: (commissionId: string) => apiClient.get(`/api/v1/commissions/${commissionId}/adjustments`),
  adjustCommission: (commissionId: string, amount: number, reason: string) => apiClient.post(`/api/v1/commissions/${commissionId}/adjustments`, { amount, reason }),
};

// Phase 5 — platform
export const platformApi = {
  notifications: () => apiClient.get('/api/v1/notifications'),
  markRead: (id: string) => apiClient.patch(`/api/v1/notifications/${id}/read`, {}),
  prefs: () => apiClient.get('/api/v1/notifications/prefs'),
  savePrefs: (body: unknown) => apiClient.put('/api/v1/notifications/prefs', body),
  report: (name: string) => apiClient.get(`/api/v1/reports/${name}`),
  settings: () => apiClient.get('/api/v1/settings'),
  saveSettings: (body: unknown) => apiClient.post('/api/v1/settings', body),
  tasks: () => apiClient.get('/api/v1/tasks'),
  setTask: (id: string, status: string) => apiClient.patch(`/api/v1/tasks/${id}`, { status }),
};
