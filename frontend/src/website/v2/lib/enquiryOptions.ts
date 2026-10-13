/** Shared enquiry options — single source of truth for every website lead form.
 * Values flow through submitLead() → POST /api/v1/enquiries → leads table →
 * Superadmin "Website Leads" panel (topic / office / budget / timeline columns).
 */

export const ENQUIRY_TOPICS: string[] = [
  'Hiring mandate — permanent roles',
  'Hiring mandate — contract staffing',
  'Executive & leadership search',
  'Bulk / volume hiring',
  'RPO & embedded hiring support',
  'GCC / offshore pod setup',
  'Candidate support',
  'Partner / vendor empanelment',
  'Something else',
] as const;

export const ENQUIRY_OFFICES: string[] = [
  'No preference',
  'Mumbai (HQ)',
  'Bengaluru',
  'Hyderabad',
  'Chennai',
  'Pune',
  'Delhi NCR',
  'Dubai (UAE)',
  'Remote / virtual',
] as const;

export const ENQUIRY_BUDGETS: string[] = [
  'Not sure yet',
  'Under ₹10 LPA per role',
  '₹10–25 LPA per role',
  '₹25–50 LPA per role',
  '₹50 LPA+ / executive mandate',
  'Monthly contract billing',
] as const;

export const ENQUIRY_TIMELINES: string[] = [
  'Just exploring',
  'ASAP — within 2 weeks',
  'Within 1 month',
  '1–3 months',
  '3+ months',
] as const;
