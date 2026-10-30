import React, { useState } from 'react';
import { 
  Award, Building2, Calendar, CheckCircle2, DollarSign, 
  FileText, MessageSquare, Sparkles, X, Check, Clock,
  ShieldCheck, Download, AlertCircle
} from 'lucide-react';

interface OfferItem {
  id: string;
  applicationId: string;
  jobId: string;
  orgId?: string;
  candidateEmail?: string;
  ctc: number;
  currency?: string;
  payPeriod?: string;
  joinDate?: string;
  expiryDate?: string;
  status: string;
  offerLetterMode?: string;
  offerLetterRef?: string | null;
  createdAt: string;
  job?: {
    id: string;
    title: string;
    companyName?: string;
    location?: string;
    employmentType?: string;
  };
  placement?: {
    id: string;
    status: string;
    joinDate?: string;
  } | null;
}

interface CandidateOffersViewProps {
  offers: OfferItem[];
  loading?: boolean;
  onNavigate: (path: string) => void;
  onRespond: (offerId: string, decision: 'accepted' | 'declined', reason?: string) => Promise<void>;
}

export const CandidateOffersView: React.FC<CandidateOffersViewProps> = ({
  offers,
  loading = false,
  onNavigate,
  onRespond,
}) => {
  const [selectedOfferLetter, setSelectedOfferLetter] = useState<OfferItem | null>(null);
  const [acceptingOffer, setAcceptingOffer] = useState<OfferItem | null>(null);
  const [decliningOffer, setDecliningOffer] = useState<OfferItem | null>(null);
  const [declineReason, setDeclineReason] = useState('');
  const [candidateSignName, setCandidateSignName] = useState('');
  const [busy, setBusy] = useState(false);
  const [eSigned, setESigned] = useState(false);

  const now = new Date();

  const fmtCurrency = (val: number, curr = 'INR') => {
    return `${curr === 'INR' ? '₹' : curr + ' '}${Number(val || 0).toLocaleString('en-IN')}`;
  };

  const fmtDate = (d?: string) => {
    if (!d) return '—';
    try {
      return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    } catch {
      return d;
    }
  };

  const fmtRelativeDate = (d?: string) => {
    if (!d) return '';
    try {
      const target = new Date(d);
      const diffMs = target.getTime() - now.getTime();
      const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));
      
      if (diffDays === 0) return 'Today';
      if (diffDays === 1) return 'Tomorrow';
      if (diffDays === -1) return 'Yesterday';
      if (diffDays > 1) return `In ${diffDays} days`;
      return `${Math.abs(diffDays)} days ago`;
    } catch {
      return '';
    }
  };

  const handleAcceptSubmit = async () => {
    if (!acceptingOffer || !eSigned) return;
    setBusy(true);
    try {
      await onRespond(acceptingOffer.id, 'accepted');
      setAcceptingOffer(null);
      setESigned(false);
      setCandidateSignName('');
    } finally {
      setBusy(false);
    }
  };

  const handleDeclineSubmit = async () => {
    if (!decliningOffer) return;
    setBusy(true);
    try {
      await onRespond(decliningOffer.id, 'declined', declineReason.trim() || undefined);
      setDecliningOffer(null);
      setDeclineReason('');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-5">
      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white p-5 sm:p-6 shadow-lg border border-indigo-900/40">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-bold tracking-wide">
              <Sparkles size={12} className="text-emerald-400" />
              Executive Placement & Contracts
            </div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white">Formal Job Offers</h1>
            <p className="text-xs text-indigo-200/80 max-w-xl font-medium leading-relaxed">
              Review official compensation offers, review appointment documentation, e-sign your acceptance, and coordinate joining dates.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 backdrop-blur-xs text-center min-w-[100px]">
              <div className="text-2xl font-black text-emerald-400">{offers.length}</div>
              <div className="text-[10px] text-indigo-200 font-bold uppercase tracking-wider">Total Offers</div>
            </div>
          </div>
        </div>
      </div>

      {/* Offers List */}
      {loading ? (
        <div className="p-10 text-center bg-white rounded-2xl border border-slate-200">
          <div className="inline-block animate-spin w-7 h-7 border-3 border-emerald-600 border-t-transparent rounded-full mb-2" />
          <p className="text-xs font-bold text-slate-600">Loading formal offers...</p>
        </div>
      ) : offers.length === 0 ? (
        <div className="p-10 text-center bg-white rounded-2xl border border-dashed border-slate-300 space-y-3">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
            <Award size={24} />
          </div>
          <div className="space-y-1">
            <h3 className="text-sm font-extrabold text-slate-900">No active offers yet</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Once an employer extends a formal employment contract after interviews, complete compensation details appear here.
            </p>
          </div>
          <div className="pt-2">
            <button
              onClick={() => onNavigate('/candidate/applications')}
              className="px-4 py-2 rounded-xl bg-[#087BFF] hover:bg-blue-600 text-white font-bold text-xs shadow-xs transition-all cursor-pointer"
            >
              View Active Applications →
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-5">
          {offers.map((offer) => {
            const isAccepted = offer.status === 'Accepted';
            const isDeclined = offer.status === 'Declined';
            // Actionable status includes 'Extended', 'Issued', 'Pending', or blank
            const isPendingDecision = !isAccepted && !isDeclined;

            const company = offer.job?.companyName || 'Fintech ScaleOps';
            const baseAmount = Math.round(offer.ctc * 0.85); // 85% base
            const varAmount = offer.ctc - baseAmount;
            const targetJoining = offer.joinDate || '2026-12-01T09:00:00.000Z';
            const responseDeadline = offer.expiryDate || '2026-11-15T23:59:59.000Z';

            return (
              <div
                key={offer.id}
                className="p-5 sm:p-6 bg-white rounded-2xl border border-slate-200/90 hover:border-emerald-300 hover:shadow-lg transition-all duration-200 space-y-4 relative overflow-hidden"
              >
                {/* Header Row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h2 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
                        {offer.job?.title || 'Principal Architect - Distributed Systems'}
                      </h2>
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-xs font-black border ${
                          isAccepted
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : isDeclined
                            ? 'bg-slate-100 text-slate-600 border-slate-200'
                            : 'bg-emerald-50 text-emerald-800 border-emerald-300 animate-pulse'
                        }`}
                      >
                        {isAccepted ? '✓ Offer Accepted' : isDeclined ? 'Offer Declined' : '⚡ Official Offer Extended'}
                      </span>
                    </div>

                    {/* Metadata & Proper Dates */}
                    <div className="text-xs text-slate-500 font-medium flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-slate-800 flex items-center gap-1">
                        <Building2 size={13} className="text-slate-400" />
                        {company}
                      </span>
                      <span>•</span>
                      <span>Ref: <strong className="font-mono text-slate-700">{offer.id}</strong></span>
                      <span>•</span>
                      <span className="flex items-center gap-1 font-semibold text-slate-700">
                        <Calendar size={12} className="text-indigo-600" />
                        Issued on {fmtDate(offer.createdAt)}
                        <span className="text-slate-400 font-normal">({fmtRelativeDate(offer.createdAt)})</span>
                      </span>
                    </div>
                  </div>

                  {/* CTC Hero Card */}
                  <div className="p-3.5 rounded-xl bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200 text-left sm:text-right shrink-0">
                    <div className="text-[10px] font-black uppercase tracking-wider text-emerald-800">
                      Total Annual Package (CTC)
                    </div>
                    <div className="text-xl sm:text-2xl font-black text-emerald-700">
                      {fmtCurrency(offer.ctc, offer.currency)}
                    </div>
                    <div className="text-[11px] text-slate-500 font-medium">
                      Pay Period: {offer.payPeriod || 'Annual (12 Months)'}
                    </div>
                  </div>
                </div>

                {/* Offer Highlights Grid with Clear Dates */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
                    <div className="text-[11px] font-bold text-slate-500 flex items-center gap-1">
                      <Calendar size={12} className="text-indigo-600" />
                      Target Joining Date
                    </div>
                    <div className="text-xs font-black text-slate-900">
                      {fmtDate(targetJoining)}
                    </div>
                    <div className="text-[10px] text-indigo-700 font-bold">
                      ● {fmtRelativeDate(targetJoining)}
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
                    <div className="text-[11px] font-bold text-slate-500 flex items-center gap-1">
                      <DollarSign size={12} className="text-emerald-600" />
                      Base Salary (Fixed)
                    </div>
                    <div className="text-xs font-black text-slate-900">
                      {fmtCurrency(baseAmount, offer.currency)} / yr
                    </div>
                    <div className="text-[10px] text-slate-500">
                      ~ {fmtCurrency(Math.round(baseAmount / 12), offer.currency)} / month
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
                    <div className="text-[11px] font-bold text-slate-500 flex items-center gap-1">
                      <Clock size={12} className="text-amber-600" />
                      Response Deadline
                    </div>
                    <div className="text-xs font-black text-amber-900">
                      {fmtDate(responseDeadline)}
                    </div>
                    <div className="text-[10px] text-amber-700 font-bold">
                      ● {fmtRelativeDate(responseDeadline)} remaining
                    </div>
                  </div>
                </div>

                {/* Benefits Pill Row */}
                <div className="flex items-center gap-2 flex-wrap text-[11px] text-slate-600 font-medium bg-slate-50 p-2.5 rounded-xl border border-slate-200/70">
                  <span className="font-bold text-slate-800 flex items-center gap-1">
                    <ShieldCheck size={12} className="text-emerald-600" /> Executive Benefits:
                  </span>
                  <span className="bg-white px-2 py-0.5 rounded border border-slate-200">₹10L Family Medical Insurance</span>
                  <span className="bg-white px-2 py-0.5 rounded border border-slate-200">{fmtCurrency(varAmount, offer.currency)} Annual Performance Bonus</span>
                  <span className="bg-white px-2 py-0.5 rounded border border-slate-200">₹1,50,000 Home Office & Tech Allowance</span>
                  <span className="bg-white px-2 py-0.5 rounded border border-slate-200">EPF + Gratuity + Paid Leave (24d)</span>
                </div>

                {/* Actions & Decision Row */}
                <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                  <button
                    onClick={() => setSelectedOfferLetter(offer)}
                    className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                  >
                    <FileText size={13} className="text-indigo-600" />
                    View Formal Appointment Letter
                  </button>

                  <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
                    {offer.applicationId && (
                      <button
                        onClick={() => onNavigate(`/candidate/applications/${offer.applicationId}/chat`)}
                        className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                      >
                        <MessageSquare size={13} />
                        Discuss with Recruiter
                      </button>
                    )}

                    {isPendingDecision && (
                      <>
                        <button
                          onClick={() => setDecliningOffer(offer)}
                          className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-rose-50 text-slate-700 hover:text-rose-700 font-bold text-xs border border-slate-200 transition-all cursor-pointer"
                        >
                          Decline
                        </button>

                        <button
                          onClick={() => {
                            setAcceptingOffer(offer);
                            setESigned(false);
                            setCandidateSignName('Siddharth Nair');
                          }}
                          className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs shadow-xs transition-all cursor-pointer flex items-center justify-center gap-1.5"
                        >
                          <Check size={14} /> Accept & Sign Offer
                        </button>
                      </>
                    )}

                    {isAccepted && (
                      <div className="px-3.5 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 font-black text-xs border border-emerald-200 flex items-center gap-1.5">
                        <CheckCircle2 size={13} className="text-emerald-600" />
                        Offer Accepted • Target Joining {fmtDate(targetJoining)}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Appointment Letter Modal */}
      {selectedOfferLetter && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-xs p-4"
          onClick={() => setSelectedOfferLetter(null)}
        >
          <div
            className="bg-white rounded-2xl max-w-2xl w-full p-6 sm:p-8 space-y-5 shadow-2xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3.5 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-blue-700 text-white flex items-center justify-center font-black text-sm">
                  FS
                </div>
                <div>
                  <h3 className="text-sm font-black text-slate-900">
                    Formal Offer of Employment
                  </h3>
                  <div className="text-xs text-slate-500 font-medium">
                    {selectedOfferLetter.job?.companyName || 'Fintech ScaleOps'} • Ref: {selectedOfferLetter.id}
                  </div>
                </div>
              </div>

              <button
                onClick={() => setSelectedOfferLetter(null)}
                className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            {/* Letter Content Preview */}
            <div className="p-6 rounded-xl bg-slate-50 border border-slate-200 font-serif text-xs text-slate-800 space-y-3.5 leading-relaxed">
              <div className="text-right text-[11px] font-sans text-slate-500">
                Date: {fmtDate(selectedOfferLetter.createdAt)}
              </div>

              <p>
                <strong>Dear Siddharth Nair,</strong>
              </p>

              <p>
                On behalf of <strong>{selectedOfferLetter.job?.companyName || 'Fintech ScaleOps'}</strong>, we are thrilled to formally extend this offer of employment for the position of{' '}
                <strong>{selectedOfferLetter.job?.title || 'Principal Architect - Distributed Systems'}</strong>.
              </p>

              <p>
                Your technical interviews and architectural discussions with our VP of Engineering demonstrated exceptional alignment with our core banking infrastructure roadmap.
              </p>

              <div className="p-4 rounded-xl bg-white border border-slate-200 font-sans text-xs space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-500">Total Annual CTC:</span>
                  <span className="font-bold text-slate-900">
                    {fmtCurrency(selectedOfferLetter.ctc, selectedOfferLetter.currency)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Fixed Base Salary:</span>
                  <span className="font-bold text-slate-900">
                    {fmtCurrency(Math.round(selectedOfferLetter.ctc * 0.85), selectedOfferLetter.currency)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Annual Performance Bonus:</span>
                  <span className="font-bold text-slate-900">
                    {fmtCurrency(Math.round(selectedOfferLetter.ctc * 0.15), selectedOfferLetter.currency)}
                  </span>
                </div>
                <div className="flex justify-between border-t border-slate-100 pt-2">
                  <span className="text-slate-500">Proposed Joining Date:</span>
                  <span className="font-bold text-indigo-700">
                    {selectedOfferLetter.joinDate ? fmtDate(selectedOfferLetter.joinDate) : 'Dec 01, 2026'}
                  </span>
                </div>
              </div>

              <p>
                This offer is contingent on background credential verification and confirmation of your joining timeline. Please complete your digital acceptance by{' '}
                <strong>{fmtDate(selectedOfferLetter.expiryDate || '2026-11-15T23:59:59.000Z')}</strong>.
              </p>

              <div className="pt-2 font-sans text-xs text-slate-600">
                <div>Sincerely,</div>
                <div className="font-bold text-slate-900">Aditi Sharma</div>
                <div className="text-[11px] text-slate-500">VP of Engineering, Fintech ScaleOps</div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-between pt-2">
              <button
                onClick={() => window.print()}
                className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1.5 cursor-pointer"
              >
                <Download size={13} />
                Download / Print PDF
              </button>

              <button
                onClick={() => setSelectedOfferLetter(null)}
                className="px-4 py-2 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 cursor-pointer"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Accept Offer Modal */}
      {acceptingOffer && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-xs p-4"
          onClick={() => setAcceptingOffer(null)}
        >
          <div
            className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-2.5 text-emerald-600">
              <CheckCircle2 size={22} />
              <h4 className="text-base font-extrabold text-slate-900">Accept Employment Offer</h4>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              You are accepting the offer for <strong className="text-slate-900">{acceptingOffer.job?.title || 'Principal Architect'}</strong> with total compensation of{' '}
              <strong className="text-emerald-700">{fmtCurrency(acceptingOffer.ctc, acceptingOffer.currency)}</strong>.
            </p>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-2">
              <label className="text-xs font-bold text-slate-700 block">
                Digital Signature (Full Legal Name) *
              </label>
              <input
                type="text"
                value={candidateSignName}
                onChange={(e) => setCandidateSignName(e.target.value)}
                placeholder="Enter your full legal name"
                className="w-full p-2.5 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />

              <label className="flex items-start gap-2 pt-1 cursor-pointer">
                <input
                  type="checkbox"
                  checked={eSigned}
                  onChange={(e) => setESigned(e.target.checked)}
                  className="mt-0.5 rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                />
                <span className="text-[11px] text-slate-600 leading-tight">
                  I accept the terms of employment and confirm my target joining date of{' '}
                  <strong>{fmtDate(acceptingOffer.joinDate || '2026-12-01T09:00:00.000Z')}</strong>.
                </span>
              </label>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setAcceptingOffer(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs cursor-pointer"
              >
                Review Later
              </button>

              <button
                type="button"
                disabled={!eSigned || !candidateSignName.trim() || busy}
                onClick={handleAcceptSubmit}
                className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold text-xs shadow-md transition-all cursor-pointer flex items-center gap-1.5"
              >
                {busy ? 'Confirming...' : 'Sign & Submit Acceptance'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Decline Offer Modal */}
      {decliningOffer && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-xs p-4"
          onClick={() => setDecliningOffer(null)}
        >
          <div
            className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-2.5 text-rose-600">
              <AlertCircle size={20} />
              <h4 className="text-base font-extrabold text-slate-900">Decline Employment Offer</h4>
            </div>

            <p className="text-xs text-slate-500">
              Are you sure you wish to decline this offer from <strong className="text-slate-800">{decliningOffer.job?.companyName || 'Fintech ScaleOps'}</strong>? This decision cannot be reversed.
            </p>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Reason for Declining (Optional)
              </label>
              <textarea
                rows={3}
                value={declineReason}
                onChange={(e) => setDeclineReason(e.target.value)}
                placeholder="e.g. Compensation alignment / Selected another offer / Relocation constraints"
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:bg-white"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setDecliningOffer(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={busy}
                onClick={handleDeclineSubmit}
                className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
              >
                {busy ? 'Submitting...' : 'Confirm Decline'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
