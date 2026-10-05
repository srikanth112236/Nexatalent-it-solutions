import { useState } from 'react';
import { motion } from 'framer-motion';
import { Building2, ShieldCheck, UploadCloud, CheckCircle2, FileText, Send } from 'lucide-react';

export function VendorEmpanelmentForm() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    companyName: 'Apex Talent Partners LLP',
    website: 'https://apextalentpartners.com',
    contactPerson: 'Sunil Mehta (Managing Partner)',
    email: 'sunil@apextalentpartners.com',
    phone: '+91 98200 44321',
    gst: '29ABCDE1234F1Z5',
    cin: 'U74999KA2019PTC123456',
    pan: 'ABCDE1234F',
    yearsInRecruitment: '7 Years',
    itRecruitmentPercent: '85% IT Tech Staffing',
    nonItRecruitmentPercent: '15% BFSI Operations',
    geographicCoverage: 'Bangalore, Pune, Hyderabad, NCR, US Offshore',
    technologiesCovered: 'Java/Spring, React/Node, AWS/DevOps, Data/AI/ML, Python',
    clientIndustries: 'Fintech, Healthcare, Cloud SaaS, Automotive Tech',
    numberOfRecruiters: '18 Full-Time Tech Recruiters',
    existingClients: 'Tier-1 GCCs, 4 High-Growth Unicorns',
    placementVolume: '140+ IT Placements Annually',
    agreedToTerms: true
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <section id="empanelment-form-section" className="w-full py-16 px-4 sm:px-6 lg:px-8 bg-slate-50 text-slate-900 border-b border-slate-200">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 mb-3 shadow-sm">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>OFFICIAL SUPPLIER EMPANELMENT GATEWAY</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-slate-950 mb-3">
            🤝 Apply for Recruitment Partner Empanelment
          </h2>
          <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Join NexaTalent IT Solutions’s authorized vendor network. Supply verified technology talent to Fortune 500 GCCs and high-growth tech enterprises with guaranteed 30-day payout cycles.
          </p>
        </motion.div>

        {/* Form Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-10 shadow-xl shadow-slate-200/50 relative"
        >
          {submitted ? (
            <div className="p-8 text-center">
              <div className="w-16 h-16 rounded-2xl bg-emerald-100 border border-emerald-300 text-emerald-700 flex items-center justify-center mx-auto mb-4 shadow-sm">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2">Empanelment Application Received!</h3>
              <p className="text-sm text-slate-600 max-w-md mx-auto mb-6">
                Your partnership dossier has entered Stage 2 (Document Verification) in the Nexa Alliance Portal. An Alliance Director will contact you within 24 hours.
              </p>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 border border-slate-200 text-xs text-slate-700 font-semibold">
                Application Tracking ID: <strong className="text-emerald-700 font-mono">NEXA-VND-2026-8842</strong>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Group 1: Corporate & Legal Entities */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-700 mb-4 flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-emerald-600" />
                  <span>1. Company Legal & Corporate Credentials</span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
                  <div>
                    <label className="block text-slate-600 mb-1 font-semibold">Company Name *</label>
                    <input
                      type="text"
                      required
                      value={formData.companyName}
                      onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 mb-1 font-semibold">Company Website *</label>
                    <input
                      type="url"
                      required
                      value={formData.website}
                      onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 mb-1 font-semibold">Contact Person & Designation *</label>
                    <input
                      type="text"
                      required
                      value={formData.contactPerson}
                      onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 mb-1 font-semibold">Corporate Email Address *</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 mb-1 font-semibold">Direct Mobile / Phone *</label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 mb-1 font-semibold">GST Registration Number *</label>
                    <input
                      type="text"
                      required
                      value={formData.gst}
                      onChange={(e) => setFormData({ ...formData, gst: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-slate-900 font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 mb-1 font-semibold">CIN / LLPIN *</label>
                    <input
                      type="text"
                      required
                      value={formData.cin}
                      onChange={(e) => setFormData({ ...formData, cin: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-slate-900 font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 mb-1 font-semibold">PAN Card Number *</label>
                    <input
                      type="text"
                      required
                      value={formData.pan}
                      onChange={(e) => setFormData({ ...formData, pan: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-slate-900 font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 mb-1 font-semibold">Years in Recruitment Business *</label>
                    <input
                      type="text"
                      required
                      value={formData.yearsInRecruitment}
                      onChange={(e) => setFormData({ ...formData, yearsInRecruitment: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-slate-900"
                    />
                  </div>
                </div>
              </div>

              {/* Group 2: Recruitment Expertise & Coverage */}
              <div className="pt-4 border-t border-slate-200">
                <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-700 mb-4 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>2. Recruitment Domain & Operational Footprint</span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
                  <div>
                    <label className="block text-slate-600 mb-1 font-semibold">IT Recruitment Experience (%)</label>
                    <input
                      type="text"
                      value={formData.itRecruitmentPercent}
                      onChange={(e) => setFormData({ ...formData, itRecruitmentPercent: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 mb-1 font-semibold">Non-IT Recruitment Experience (%)</label>
                    <input
                      type="text"
                      value={formData.nonItRecruitmentPercent}
                      onChange={(e) => setFormData({ ...formData, nonItRecruitmentPercent: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 mb-1 font-semibold">Geographic Coverage</label>
                    <input
                      type="text"
                      value={formData.geographicCoverage}
                      onChange={(e) => setFormData({ ...formData, geographicCoverage: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-slate-900"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-slate-600 mb-1 font-semibold">Technologies Covered</label>
                    <input
                      type="text"
                      value={formData.technologiesCovered}
                      onChange={(e) => setFormData({ ...formData, technologiesCovered: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 mb-1 font-semibold">Client Industries Supported</label>
                    <input
                      type="text"
                      value={formData.clientIndustries}
                      onChange={(e) => setFormData({ ...formData, clientIndustries: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 mb-1 font-semibold">Dedicated Recruiter Headcount</label>
                    <input
                      type="text"
                      value={formData.numberOfRecruiters}
                      onChange={(e) => setFormData({ ...formData, numberOfRecruiters: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 mb-1 font-semibold">Notable Existing Clients</label>
                    <input
                      type="text"
                      value={formData.existingClients}
                      onChange={(e) => setFormData({ ...formData, existingClients: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 mb-1 font-semibold">Annual Tech Placement Volume</label>
                    <input
                      type="text"
                      value={formData.placementVolume}
                      onChange={(e) => setFormData({ ...formData, placementVolume: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-slate-900"
                    />
                  </div>
                </div>
              </div>

              {/* Group 3: Document Uploads & Terms */}
              <div className="pt-4 border-t border-slate-200">
                <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-700 mb-4 flex items-center gap-2">
                  <UploadCloud className="w-4 h-4 text-emerald-600" />
                  <span>3. Document Dossier & Legal Acceptance</span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4 text-xs">
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-3">
                    <FileText className="w-5 h-5 text-emerald-600" />
                    <div>
                      <span className="font-bold text-slate-900 block">GST Certificate</span>
                      <span className="text-emerald-700 text-[11px] font-semibold">gst_cert_apex.pdf (Uploaded)</span>
                    </div>
                  </div>
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-3">
                    <FileText className="w-5 h-5 text-emerald-600" />
                    <div>
                      <span className="font-bold text-slate-900 block">Incorporation Certificate</span>
                      <span className="text-emerald-700 text-[11px] font-semibold">coi_llp_2019.pdf (Uploaded)</span>
                    </div>
                  </div>
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-3">
                    <FileText className="w-5 h-5 text-emerald-600" />
                    <div>
                      <span className="font-bold text-slate-900 block">Company PAN Card</span>
                      <span className="text-emerald-700 text-[11px] font-semibold">company_pan.pdf (Uploaded)</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                  <input
                    type="checkbox"
                    id="terms"
                    required
                    checked={formData.agreedToTerms}
                    onChange={(e) => setFormData({ ...formData, agreedToTerms: e.target.checked })}
                    className="mt-0.5 rounded text-emerald-600 focus:ring-emerald-500"
                  />
                  <label htmlFor="terms" className="text-slate-600 leading-relaxed font-medium">
                    We accept NexaTalent IT Solutions’s Partner Master Supplier Agreement (MSA), candidate non-solicitation guidelines, anti-duplicate submission policies, and agree to undergo compliance background verification.
                  </label>
                </div>
              </div>

              {/* Submit */}
              <div className="pt-4">
                <button
                  type="submit"
                  className="w-full inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-xl shadow-emerald-600/25 active:scale-95 transition-all"
                >
                  <Send className="w-4 h-4" />
                  <span>Submit Partner Empanelment Application</span>
                </button>
              </div>
            </form>
          )}
        </motion.div>
      </div>
    </section>
  );
}
