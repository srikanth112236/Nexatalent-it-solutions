import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Logo } from './Logo';
import { ShieldCheck, Lock, PhoneCall, Mail, MapPin } from 'lucide-react';

interface FooterColumn {
  title: string;
  links: Array<{ label: string; to: string }>;
}

const COLUMNS: FooterColumn[] = [
  {
    title: 'Solutions Suite',
    links: [
      { label: 'Solutions Overview', to: '/solutions' },
      { label: 'Industries Practice', to: '/industries' },
      { label: 'Why NexaTalent IT Solutions', to: '/why-nexatalent' },
      { label: 'For Employers', to: '/employers' },
      { label: 'For Candidates', to: '/candidates' },
    ],
  },
  {
    title: 'Platform Portals',
    links: [
      { label: 'Recruitment Partners', to: '/partners' },
      { label: 'Job Board & Mandates', to: '/jobs' },
      { label: 'Unified Sign In', to: '/login' },
      { label: 'Employer KYC Registration', to: '/employer/register' },
      { label: 'Candidate Registration', to: '/candidate/register' },
    ],
  },
  {
    title: 'Research & Proof',
    links: [
      { label: 'Client Case Studies', to: '/case-studies' },
      { label: 'Market Insights & Salary Reports', to: '/insights' },
      { label: 'About Company', to: '/about' },
      { label: 'Contact & Office Directory', to: '/contact' },
    ],
  },
  {
    title: 'Trust & Legal',
    links: [
      { label: 'Privacy Policy (DPDP Act)', to: '/privacy-policy' },
      { label: 'Terms of Service', to: '/terms' },
      { label: 'Cookie Policy', to: '/cookie-policy' },
      { label: 'Accessibility Statement', to: '/accessibility' },
      { label: 'IP & Anti-Poaching', to: '/data-protection' },
      { label: 'Legal Disclaimer', to: '/disclaimer' },
    ],
  },
];

export const MinimalOutlineFooter: React.FC = () => {
  return (
    <footer className="relative bg-[#FAF8F5] text-slate-900 border-t border-slate-200 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 pt-14 pb-8 relative z-10">
        
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
          
          {/* Brand Info & Address Column */}
          <div className="md:col-span-4 space-y-4">
            <span style={{ display: 'inline-flex', backgroundColor: '#ffffff', borderRadius: 12, padding: '8px 14px', lineHeight: 0, boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
              <Logo height={38} />
            </span>
            
            <p className="text-xs text-slate-600 leading-relaxed font-normal">
              <strong>NEXA TALENT IT SOLUTIONS PRIVATE LIMITED</strong> is a technology recruitment and staffing partner connecting organizations with IT, contract, and executive talent.
            </p>

            {/* Official Contact Badges */}
            <div className="space-y-2 text-xs text-slate-700 font-medium pt-2">
              <div className="flex items-start gap-2">
                <MapPin size={15} className="text-[#0265FF] shrink-0 mt-0.5" />
                <span><strong>Corporate HQ:</strong> 4th and 7th Floor, Skyline Icon, Andheri - Kurla Rd, Chimatpada, Marol, Andheri East, Mumbai, Maharashtra 400059</span>
              </div>
              <div className="flex items-center gap-2">
                <PhoneCall size={15} className="text-[#0265FF] shrink-0" />
                <span><strong>Direct Line:</strong> <a href="tel:+917019696166" className="text-[#0265FF] font-bold hover:underline">+91 70196 96166</a></span>
              </div>
              <div className="flex items-center gap-2">
                <Mail size={15} className="text-[#0265FF] shrink-0" />
                <span><strong>Executive Email:</strong> <a href="mailto:ceo@nexatalentitsolutions.com" className="text-[#0265FF] font-bold hover:underline">ceo@nexatalentitsolutions.com</a></span>
              </div>
            </div>

            <div className="pt-2 flex items-center gap-3 text-slate-500 text-xs font-semibold">
              <span className="flex items-center gap-1 text-slate-700">
                <ShieldCheck size={14} className="text-[#0265FF]" /> Enterprise Governance
              </span>
              <span>•</span>
              <span className="flex items-center gap-1 text-slate-700">
                <Lock size={14} className="text-emerald-600" /> DPDP Act 2023 Compliant
              </span>
            </div>
          </div>

          {/* Links Columns */}
          <div className="md:col-span-8 grid grid-cols-2 sm:grid-cols-4 gap-6">
            {COLUMNS.map((col) => (
              <nav key={col.title} aria-label={col.title}>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-4">{col.title}</h4>
                <ul className="space-y-2.5">
                  {col.links.map((l) => (
                    <li key={`${col.title}-${l.label}`}>
                      <Link to={l.to} className="text-xs font-medium text-slate-600 hover:text-[#0265FF] transition-colors">
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
          </div>

        </div>

        {/* Dedicated One-Row Legal Navigation Strip */}
        <div className="mt-10 pt-6 border-t border-slate-200/80 flex flex-wrap items-center justify-between gap-4 text-xs font-bold text-slate-600">
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            <Link to="/privacy-policy" className="hover:text-[#0265FF] transition-colors">
              Privacy Policy (DPDP)
            </Link>
            <Link to="/terms" className="hover:text-[#0265FF] transition-colors">
              Terms of Service
            </Link>
            <Link to="/cookie-policy" className="hover:text-[#0265FF] transition-colors">
              Cookie Policy
            </Link>
            <Link to="/accessibility" className="hover:text-[#0265FF] transition-colors">
              Accessibility Statement
            </Link>
            <Link to="/data-protection" className="hover:text-[#0265FF] transition-colors">
              IP & Anti-Poaching
            </Link>
            <Link to="/disclaimer" className="hover:text-[#0265FF] transition-colors">
              Legal Disclaimer & Zero Fee Guarantee
            </Link>
            <Link to="/contact" className="hover:text-[#0265FF] transition-colors">
              Contact Us
            </Link>
          </div>
        </div>

        {/* Copyright & SLA Bottom Bar */}
        <div className="mt-4 pt-4 border-t border-slate-200/50 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 font-medium">
          <span>© 2026 <strong>NEXA TALENT IT SOLUTIONS PRIVATE LIMITED</strong>. All rights reserved.</span>
          <span className="font-mono text-slate-600">Technology Recruitment · Staffing Solutions · Talent Delivery</span>
        </div>

      </div>

      {/* Outlined Watermark Text on Scroll */}
      <div className="relative select-none pointer-events-none" aria-hidden="true">
        <motion.div
          initial={{ opacity: 0, y: 120 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-8%' }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          style={{
            fontSize: 'clamp(3.5rem, 13.5vw, 12rem)',
            fontWeight: 900,
            letterSpacing: '-0.04em',
            lineHeight: 0.95,
            textAlign: 'center',
            whiteSpace: 'nowrap',
            color: 'transparent',
            WebkitTextStroke: '1.5px rgba(2, 101, 255, 0.25)',
            paddingBottom: '0.08em',
            marginBottom: '-0.12em',
          }}
        >
          NEXATALENT IT SOLUTIONS
        </motion.div>
      </div>
    </footer>
  );
};
