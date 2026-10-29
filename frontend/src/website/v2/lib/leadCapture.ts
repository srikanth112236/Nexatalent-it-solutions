export interface LeadCapturePayload {
  contactName: string;
  companyName?: string;
  email: string;
  phone?: string;
  /** Short scope line (roles, headcount, tech stack…) */
  roleOrScope?: string;
  /** Contact-form structured fields (Home Contact) */
  topic?: string;
  preferredOffice?: string;
  budget?: string;
  timeline?: string;
  message: string;
  formName: string;
  service?: string;
  industry?: string;
  sourcePage: string;
  enquiryType?: 'employer' | 'candidate' | 'partner';
  consent?: boolean;
  /** Optional resume upload (Careers / candidate applications) — base64 file content */
  resumeName?: string;
  resumeBase64?: string;
}

export interface LeadCaptureResult {
  ok: boolean;
  id?: string;
  duplicate?: boolean;
  error?: string;
}

const API_BASE = typeof window !== 'undefined' && window.location.protocol === 'https:' ? '' : ((typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_API_BASE_URL) || '');

/** POST a website lead to /api/v1/enquiries (public, rate-limited, 24h dedupe). */
export async function submitLead(p: LeadCapturePayload): Promise<LeadCaptureResult> {
  const email = (p.email || '').trim();
  const structured = [
    p.topic?.trim() ? `Topic: ${p.topic.trim()}` : '',
    p.preferredOffice?.trim() ? `Preferred office: ${p.preferredOffice.trim()}` : '',
    p.budget?.trim() ? `Budget: ${p.budget.trim()}` : '',
    p.timeline?.trim() ? `Timeline: ${p.timeline.trim()}` : '',
    p.resumeName?.trim() ? `Resume: ${p.resumeName.trim()}` : '',
  ].filter(Boolean);
  const message = [...structured, p.roleOrScope?.trim(), p.message?.trim()].filter(Boolean).join('\n');
  const body = {
    contactName: (p.contactName || '').trim(),
    companyName: (p.companyName || '').trim() || 'Individual',
    workEmail: email,
    phone: p.phone?.trim() || undefined,
    enquiryType: p.enquiryType || 'employer',
    message:
      message.length >= 10
        ? message
        : `${message}\n[${p.formName} enquiry via ${p.sourcePage}]`.trim(),
    consent: p.consent === true,
    service: p.service || p.topic?.trim() || undefined,
    enquiryTopic: p.topic?.trim() || undefined,
    preferredOffice: p.preferredOffice?.trim() || undefined,
    budgetRange: p.budget?.trim() || undefined,
    timeline: p.timeline?.trim() || undefined,
    formName: p.formName,
    sourcePage: p.sourcePage,
    industry: p.industry || undefined,
    resumeName: p.resumeName?.trim() || undefined,
    resumeBase64: p.resumeBase64 || undefined,
  };
  try {
    const res = await fetch(`${API_BASE}/api/v1/enquiries`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const json = (await res.json().catch(() => null)) as
      | { success?: boolean; code?: string; message?: string; data?: { id?: string } }
      | null;
    if (!res.ok) return { ok: false, error: json?.message || 'Could not submit — please try again.' };
    return { ok: true, id: json?.data?.id, duplicate: json?.code === 'ENQUIRY_DUPLICATE' };
  } catch {
    return { ok: false, error: 'Network unavailable — please retry or call +91 70196 96166.' };
  }
}
