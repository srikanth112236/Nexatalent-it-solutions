import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Clock, 
  Send, 
  CheckCircle2, 
  ShieldCheck, 
  Sparkles,
  ArrowRight,
  Calendar,
  Building2,
  ExternalLink,
  MessageSquare,
  Users2
} from 'lucide-react';
import { SiteNavbar, SiteFooter } from '../components/SiteChrome';
import { SeoHead } from '../components/SeoHead';

const LOCATION_DETAILS = [
  {
    city: 'Mumbai (Corporate HQ)',
    slug: 'mumbai',
    tag: 'Corporate Registered Office & Primary HQ',
    address: '4th and 7th Floor, Skyline Icon, Andheri - Kurla Rd, Chimatpada, Marol, Andheri East, Mumbai, Maharashtra 400059',
    phone: '+91 70196 96166',
    email: 'info@nexatalentitsolutions.com',
    talentPool: '280,000+ Active Vetted Devs',
    hours: '09:00 - 19:00 IST',
    mapQuery: 'Skyline+Icon+Marol+Andheri+East+Mumbai',
    director: 'Executive Office (Nexa Talent IT Solutions)'
  },
  {
    city: 'Bengaluru R&D Hub',
    slug: 'bengaluru',
    tag: 'Global Delivery & AI R&D Hub',
    address: 'Level 7, Prestige Tech Park IV, Outer Ring Road, Bellandur, Bengaluru, Karnataka 560103',
    phone: '+91 70196 96166',
    email: 'info@nexatalentitsolutions.com',
    talentPool: '240,000+ Active Vetted Devs',
    hours: '09:00 - 19:00 IST',
    mapQuery: 'Prestige+Tech+Park+Bengaluru',
    director: 'Anand Vardhan (Senior Practice Director)'
  },
  {
    city: 'Hyderabad Hub',
    slug: 'hyderabad',
    tag: 'Cloud & GCC Acceleration Pod',
    address: 'HITEC City, Phase II, Madhapur, Hyderabad, Telangana 500081',
    phone: '+91 70196 96166',
    email: 'info@nexatalentitsolutions.com',
    talentPool: '185,000+ Active Vetted Devs',
    hours: '09:00 - 19:00 IST',
    mapQuery: 'HITEC+City+Hyderabad',
    director: 'Rajesh K. (Cloud & DevOps Lead)'
  },
  {
    city: 'Pune Hub',
    slug: 'pune',
    tag: 'Enterprise & Embedded Systems',
    address: 'Cybercity Tower 4, Magarpatta City, Hadapsar, Pune, Maharashtra 411028',
    phone: '+91 70196 96166',
    email: 'info@nexatalentitsolutions.com',
    talentPool: '130,000+ Active Vetted Devs',
    hours: '09:00 - 19:00 IST',
    mapQuery: 'Magarpatta+Cybercity+Pune',
    director: 'Priya N. (Embedded & IoT Lead)'
  },
  {
    city: 'Delhi NCR Desk',
    slug: 'delhi',
    tag: 'FinTech & Executive Search',
    address: 'DLF Cyber City, Building 10, Phase II, Gurugram, Haryana 122002',
    phone: '+91 70196 96166',
    email: 'info@nexatalentitsolutions.com',
    talentPool: '160,000+ Active Vetted Devs',
    hours: '09:00 - 19:00 IST',
    mapQuery: 'DLF+Cyber+City+Gurugram',
    director: 'Siddharth M. (FinTech Practice Lead)'
  },
  {
    city: 'Dubai Silicon Oasis (UAE)',
    slug: 'dubai',
    tag: 'MENA & GCC Corporate Desk',
    address: 'Silicon Park Tower B2, Dubai Silicon Oasis, Dubai, United Arab Emirates',
    phone: '+91 70196 96166',
    email: 'info@nexatalentitsolutions.com',
    talentPool: '95,000+ Regional Talent Network',
    hours: '09:00 - 18:00 GST',
    mapQuery: 'Dubai+Silicon+Oasis',
    director: 'Tariq Al-Mansoor (MENA Regional Lead)'
  }
];

const DEPARTMENT_DIRECTORY = [
  { role: 'Enterprise Client Solutions', email: 'sales@nexatalent.com', desc: 'Custom developer pods, contract staffing & SLAs' },
  { role: 'GCC Setup & BOT Advisory', email: 'gcc@nexatalent.com', desc: 'Offshore tech center setup & site leadership' },
  { role: 'Candidate Career Network', email: 'careers@nexatalent.com', desc: 'Senior software engineering applications & profile review' },
  { role: 'Partner & Vendor Empanelment', email: 'partners@nexatalent.com', desc: 'Recruitment agency onboarding & mandate marketplace' },
];

const CONTACT_FAQS = [
  {
    q: 'How quickly will I receive a response after submitting a hiring requirement?',
    a: 'Our enterprise practice directors review inquiries in real-time. You will receive an initial response and pre-screening timeline within 120 minutes during business hours.'
  },
  {
    q: 'Can we execute an NDA before sharing proprietary technical specs?',
    a: 'Yes. All client interactions and mandate details are strictly governed under enterprise NDAs and standard ISO 27001 / DPDP Act data privacy protocols.'
  },
  {
    q: 'How does the 14-day zero-risk trial work for new engineering pods?',
    a: 'You get 14 full business days to evaluate the deployed engineers directly inside your codebase. If you are not completely satisfied, you pay zero.'
  },
  {
    q: 'Do you support custom offshore hub (GCC) setup in India?',
    a: 'Yes! We manage end-to-end site setup, legal entity compliance, HR operations, and engineering team recruitment for 5 to 50+ person squads.'
  }
];

export function ContactPage() {
  const [inquiryType, setInquiryType] = useState<'employer' | 'candidate' | 'partner'>('employer');
  const [activeCitySlug, setActiveCitySlug] = useState('bengaluru');
  const [submitted, setSubmitted] = useState(false);
  const [activeFaq, setActiveFaq] = useState<number | null>(0);
  const [formData, setFormData] = useState({
    name: '',
    workEmail: '',
    phone: '',
    company: '',
    roleOrHeadcount: '',
    message: '',
  });

  React.useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const inquiry = searchParams.get('inquiry');
    if (inquiry === 'candidate') {
      setInquiryType('candidate');
    }

    const scrollToForm = () => {
      const el = document.getElementById('contact-form') || document.getElementById('form');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    };

    scrollToForm();
    const t1 = setTimeout(scrollToForm, 100);
    const t2 = setTimeout(scrollToForm, 400);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  const selectedLocation = LOCATION_DETAILS.find((l) => l.slug === activeCitySlug) || LOCATION_DETAILS[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="bg-white min-h-screen text-slate-900 font-sans relative overflow-x-clip">
      {/* SEO & Meta Tags */}
      <SeoHead
        title="Contact Us | NexaTalent IT Solutions — Enterprise Talent & Hiring Desk"
        description="Get in touch with NexaTalent IT Solutions. Schedule an executive hiring consultation, submit enterprise talent mandates, or connect with our delivery centers across Bangalore, Hyderabad, Pune, Delhi NCR, Dubai, and Riyadh."
        keywords="contact NexaTalent IT Solutions, hire developers India contact, IT recruitment desk Bangalore, enterprise staffing inquiry, GCC hub setup Dubai Riyadh"
        canonical="/contact"
      />

      <SiteNavbar />

      {/* Hero Header */}
      <section className="pt-32 pb-16 px-6 lg:px-16 bg-[#FAF8F5] border-b border-slate-200/80 text-center">
        <div className="max-w-4xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-[#0265FF] text-xs font-bold uppercase tracking-wider">
            <Sparkles size={14} className="text-[#0265FF]" />
            <span>CONNECT WITH NEXATALENT IT SOLUTIONS</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
            Get in Touch with Our <span className="text-[#0265FF]">Enterprise Talent Team</span>
          </h1>

          <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto font-medium leading-relaxed">
            Whether you need to scale engineering pods within 72 hours, set up an offshore GCC hub, or discuss executive tech search, our practice directors are ready to assist.
          </p>
        </div>
      </section>

      {/* Direct Key Metrics Telemetry Strip */}
      <section className="py-6 px-6 lg:px-16 bg-white border-b border-slate-100">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
            <div className="text-2xl font-extrabold text-[#0265FF]">120 Mins</div>
            <div className="text-xs font-semibold text-slate-500 mt-0.5">Enterprise SLA Response</div>
          </div>
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
            <div className="text-2xl font-extrabold text-[#0265FF]">72 Hours</div>
            <div className="text-xs font-semibold text-slate-500 mt-0.5">Shortlist Turnaround</div>
          </div>
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
            <div className="text-2xl font-extrabold text-[#0265FF]">100% NDA</div>
            <div className="text-xs font-semibold text-slate-500 mt-0.5">DPDP & ISO 27001 Governed</div>
          </div>
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
            <div className="text-2xl font-extrabold text-[#0265FF]">14 Days</div>
            <div className="text-xs font-semibold text-slate-500 mt-0.5">Zero-Risk Trial Guarantee</div>
          </div>
        </div>
      </section>

      {/* Main Form & Contact Information Grid */}
      <section className="py-16 px-6 lg:px-16 bg-white">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Column: Form (7 cols) */}
          <div id="contact-form" className="lg:col-span-7 bg-white rounded-3xl p-8 border border-slate-200 shadow-xl space-y-6 scroll-mt-24">
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-slate-900">Send Us a Mandate or Message</h2>
              <p className="text-xs text-slate-500">
                Select your inquiry type below to route your message directly to the practice director.
              </p>
            </div>

            {/* Inquiry Type Tabs */}
            <div className="flex gap-2 p-1.5 bg-slate-100 rounded-xl">
              {(['employer', 'candidate', 'partner'] as const).map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setInquiryType(type)}
                  className={`flex-1 py-2.5 px-3 text-xs font-bold rounded-lg transition-all capitalize ${
                    inquiryType === type
                      ? 'bg-[#0265FF] text-white shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {type === 'employer' ? 'Hiring Mandate' : type === 'candidate' ? 'Senior Talent' : 'Partner Empanelment'}
                </button>
              ))}
            </div>

            {submitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="py-12 text-center space-y-4"
              >
                <div className="w-16 h-16 rounded-full bg-blue-50 text-[#0265FF] flex items-center justify-center mx-auto border border-blue-200">
                  <CheckCircle2 size={36} />
                </div>
                <h3 className="text-2xl font-extrabold text-slate-900">Inquiry Received</h3>
                <p className="text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
                  Thank you for reaching out. Your inquiry has been routed to our practice lead. A senior director will follow up with you within 120 minutes.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="px-6 py-2.5 rounded-full border border-slate-300 text-slate-800 text-xs font-bold hover:bg-slate-50 transition-colors"
                >
                  Submit Another Message
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Full Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Vikramaditya Sen"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#0265FF] bg-slate-50/50"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Corporate Email *</label>
                    <input
                      type="email"
                      required
                      placeholder="vikram@company.com"
                      value={formData.workEmail}
                      onChange={(e) => setFormData({ ...formData, workEmail: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#0265FF] bg-slate-50/50"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Phone / WhatsApp *</label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 98765 43210"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#0265FF] bg-slate-50/50"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Company / Organization *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Goldman Sachs GCC"
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#0265FF] bg-slate-50/50"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {inquiryType === 'employer' ? 'Roles & Headcount Needed' : inquiryType === 'candidate' ? 'Current Tech Stack & Years of Experience' : 'Partnership Scope'}
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 4 Senior React/Node Engineers in Bengaluru"
                    value={formData.roleOrHeadcount}
                    onChange={(e) => setFormData({ ...formData, roleOrHeadcount: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#0265FF] bg-slate-50/50"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Message / Mandate Specs</label>
                  <textarea
                    rows={4}
                    placeholder="Provide additional details regarding tech stack, budget, or timeline..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#0265FF] bg-slate-50/50 resize-y"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-4 rounded-full bg-[#0265FF] hover:bg-[#004FBF] text-white font-bold text-sm shadow-lg transition-all flex items-center justify-center gap-2"
                >
                  <span>Submit Message to Director</span>
                  <Send size={16} />
                </button>

                <div className="flex items-center justify-center gap-1.5 text-slate-500 text-xs text-center pt-2">
                  <ShieldCheck size={14} className="text-emerald-600" />
                  <span>Strictly confidential under enterprise NDA & DPDP privacy rules.</span>
                </div>
              </form>
            )}
          </div>

          {/* Right Column: Direct Hotlines & Instant Channels (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Direct Channels Card */}
            <div className="bg-slate-50 rounded-3xl p-6 border border-slate-200 space-y-4">
              <h3 className="text-lg font-bold text-slate-900">Direct Communication Channels</h3>
              
              <div className="space-y-3 text-xs text-slate-600">
                <div className="flex items-start gap-3 p-3.5 bg-white rounded-2xl border border-slate-200/80">
                  <div className="w-9 h-9 rounded-xl bg-blue-50 text-[#0265FF] flex items-center justify-center shrink-0">
                    <Mail size={16} />
                  </div>
                  <div>
                    <div className="font-bold text-slate-900">Executive & Corporate Desk</div>
                    <a href="mailto:info@nexatalentitsolutions.com" className="text-[#0265FF] font-semibold hover:underline">info@nexatalentitsolutions.com</a>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3.5 bg-white rounded-2xl border border-slate-200/80">
                  <div className="w-9 h-9 rounded-xl bg-blue-50 text-[#0265FF] flex items-center justify-center shrink-0">
                    <Phone size={16} />
                  </div>
                  <div>
                    <div className="font-bold text-slate-900">Direct Hotline / WhatsApp</div>
                    <a href="https://wa.me/917019696166" target="_blank" rel="noreferrer" className="text-[#0265FF] font-semibold hover:underline">+91 70196 96166</a>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3.5 bg-white rounded-2xl border border-slate-200/80">
                  <div className="w-9 h-9 rounded-xl bg-blue-50 text-[#0265FF] flex items-center justify-center shrink-0">
                    <Clock size={16} />
                  </div>
                  <div>
                    <div className="font-bold text-slate-900">Operating Hours</div>
                    <div className="text-slate-600">Monday – Saturday (09:00 - 19:00 IST)</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Instant Strategy Call Card */}
            <div className="p-6 bg-blue-50 rounded-3xl border border-blue-200 space-y-3">
              <div className="flex items-center gap-2 text-[#0265FF] font-bold text-xs">
                <Calendar size={16} />
                <span>EXECUTIVE CALENDAR</span>
              </div>
              <h3 className="text-base font-bold text-slate-900">Book a 30-Min Tech Hiring Strategy Call</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Direct consultation with our Practice Leads regarding developer salary benchmarks, GCC setup timelines, or contract staffing rates.
              </p>
              <a
                href="/employers"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-[#0265FF] hover:bg-[#004FBF] text-white font-bold text-xs shadow-md transition-all"
              >
                <span>Reserve Consultation Slot</span>
                <ArrowRight size={14} />
              </a>
            </div>

          </div>

        </div>
      </section>

      {/* NEW SECTION 1: INTERACTIVE GLOBAL LOCATION & CORRIDORS EXPLORER */}
      <section className="py-20 px-6 lg:px-16 bg-[#FAF8F5] border-y border-slate-200/80">
        <div className="max-w-6xl mx-auto space-y-10">
          <div className="text-center max-w-3xl mx-auto space-y-2">
            <span className="text-xs font-bold text-[#0265FF] uppercase tracking-widest bg-blue-50 px-3.5 py-1 rounded-full border border-blue-200">
              PHYSICAL DELIVERY FOOTPRINT
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
              Regional Delivery Centers & <span className="text-[#0265FF]">Tech Corridors</span>
            </h2>
            <p className="text-sm text-slate-600">
              Inspect our 6 physical hubs across India and Middle East. Click a location to view full details and practice lead contacts.
            </p>
          </div>

          {/* Location Tabs */}
          <div className="flex flex-wrap justify-center gap-2">
            {LOCATION_DETAILS.map((loc) => (
              <button
                key={loc.slug}
                onClick={() => setActiveCitySlug(loc.slug)}
                className={`px-4 py-2.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 ${
                  activeCitySlug === loc.slug
                    ? 'bg-[#0265FF] text-white shadow-md'
                    : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                <MapPin size={14} />
                <span>{loc.city}</span>
              </button>
            ))}
          </div>

          {/* Active Location Detail Card */}
          <motion.div
            key={selectedLocation.slug}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            className="bg-white rounded-3xl border border-slate-200 p-8 shadow-xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center"
          >
            {/* Left Location Info (7 cols) */}
            <div className="lg:col-span-7 space-y-5">
              <div className="space-y-1">
                <span className="text-xs font-bold text-[#0265FF] bg-blue-50 px-3 py-1 rounded-full border border-blue-200 inline-block">
                  {selectedLocation.tag}
                </span>
                <h3 className="text-2xl font-extrabold text-slate-900 pt-2">{selectedLocation.city}</h3>
                <p className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
                  <CheckCircle2 size={14} /> {selectedLocation.talentPool}
                </p>
              </div>

              <div className="space-y-3 text-xs text-slate-600 border-t border-b border-slate-100 py-4">
                <div className="flex items-start gap-3">
                  <MapPin size={16} className="text-[#0265FF] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-slate-900 block">Office Address:</span>
                    <span>{selectedLocation.address}</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div className="flex items-center gap-2">
                    <Phone size={14} className="text-[#0265FF]" />
                    <span className="font-bold text-slate-900">{selectedLocation.phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail size={14} className="text-[#0265FF]" />
                    <span>{selectedLocation.email}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-1 text-slate-500">
                  <Users2 size={14} className="text-[#0265FF]" />
                  <span>Hub Lead: <strong className="text-slate-900">{selectedLocation.director}</strong></span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <a
                  href={`https://maps.google.com/?q=${selectedLocation.mapQuery}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-colors"
                >
                  <span>Open in Google Maps</span>
                  <ExternalLink size={13} />
                </a>
                <a
                  href="mailto:info@nexatalentitsolutions.com"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-blue-50 text-[#0265FF] hover:bg-blue-100 text-xs font-bold transition-colors border border-blue-200"
                >
                  <span>Contact Hub Director</span>
                  <ArrowRight size={13} />
                </a>
              </div>
            </div>

            {/* Right Interactive Location Visual Box (5 cols) */}
            <div className="lg:col-span-5 bg-slate-900 rounded-2xl p-6 text-white space-y-4 shadow-2xl">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2 font-mono text-xs text-blue-400 font-bold">
                  <Building2 size={16} />
                  <span>HUB_TELEMETRY</span>
                </div>
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">ONLINE 24/7</span>
              </div>

              <div className="space-y-3 font-mono text-xs">
                <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700">
                  <div className="text-slate-400 text-[10px]">Location Coordinate</div>
                  <div className="text-white font-bold">{selectedLocation.city}</div>
                </div>
                <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700">
                  <div className="text-slate-400 text-[10px]">Operating Hours</div>
                  <div className="text-emerald-400 font-bold">{selectedLocation.hours}</div>
                </div>
                <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700">
                  <div className="text-slate-400 text-[10px]">Active Talent Pool</div>
                  <div className="text-blue-400 font-bold">{selectedLocation.talentPool}</div>
                </div>
              </div>

              <div className="text-[11px] text-slate-400 text-center font-mono pt-1">
                ISO 27001 & SOC2 Certified Offsite Assessment Suite
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* NEW SECTION 2: DEPARTMENT EMAIL DIRECTORY & ESCALATION */}
      <section className="py-16 px-6 lg:px-16 bg-white border-b border-slate-200/80">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">Direct Department Email Directory</h2>
            <p className="text-xs sm:text-sm text-slate-600">Reach the specific operational or legal team for expedited processing.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {DEPARTMENT_DIRECTORY.map((dept, idx) => (
              <div key={idx} className="p-5 bg-slate-50 rounded-2xl border border-slate-200/90 space-y-2 hover:border-blue-300 transition-colors">
                <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#0265FF] flex items-center justify-center font-bold">
                  <MessageSquare size={16} />
                </div>
                <h4 className="font-bold text-sm text-slate-900">{dept.role}</h4>
                <p className="text-xs text-slate-500 leading-snug">{dept.desc}</p>
                <a href={`mailto:${dept.email}`} className="text-xs font-bold text-[#0265FF] hover:underline block pt-1">
                  {dept.email}
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Compact FAQ Section */}
      <section className="py-16 px-6 lg:px-16 bg-[#FAF8F5]">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">Frequently Asked Questions</h2>
            <p className="text-xs sm:text-sm text-slate-600">Quick answers to questions regarding our hiring process and contact SLAs.</p>
          </div>

          <div className="space-y-3">
            {CONTACT_FAQS.map((faq, idx) => {
              const isOpen = activeFaq === idx;
              return (
                <div key={idx} className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                  <button
                    onClick={() => setActiveFaq(isOpen ? null : idx)}
                    className="w-full text-left p-5 flex items-center justify-between font-bold text-sm text-slate-900 hover:text-[#0265FF] transition-colors"
                  >
                    <span>{faq.q}</span>
                    <ArrowRight size={16} className={`text-slate-400 transition-transform ${isOpen ? 'rotate-90 text-[#0265FF]' : ''}`} />
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 text-xs text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
