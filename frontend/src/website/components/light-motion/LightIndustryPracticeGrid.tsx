import React from 'react';
import { motion } from 'framer-motion';
import { 
  Sparkles, 
  ArrowRight,
  Shield, 
  Cpu, 
  Landmark, 
  Globe2, 
  BriefcaseBusiness 
} from 'lucide-react';
import { Link } from 'react-router-dom';

const practices = [
  { id: 'cloud', title: '1. Software & Cloud Engineering', desc: 'Backend, Frontend, Full Stack, Microservices, DevOps, Kubernetes, and Cloud Architecture.', roles: 'Active Requisitions', icon: Cpu, accent: '#0265FF' },
  { id: 'ai-ml', title: '2. Data & AI Engineering', desc: 'Data Engineering, Data Pipelines, AI/ML Models, Business Intelligence, and Analytics.', roles: 'Active Requisitions', icon: Sparkles, accent: '#0265FF' },
  { id: 'security', title: '3. Cybersecurity & Infrastructure', desc: 'Cloud Security, SecOps, Network Infrastructure, Systems Administration, and Governance.', roles: 'Active Requisitions', icon: Shield, accent: '#0265FF' },
  { id: 'leadership', title: '4. Executive Search & Leadership', desc: 'Confidential CXO, VP Engineering, Director of Technology, and Product Management search.', roles: 'Active Requisitions', icon: Landmark, accent: '#0265FF' },
  { id: 'gcc', title: '5. GCC & Technology Operations', desc: 'Technology talent acquisition, operational leadership, and team scaling for GCCs.', roles: 'Active Requisitions', icon: Globe2, accent: '#0265FF' },
  { id: 'business', title: '6. Enterprise Business Functions', desc: 'Sales Engineering, HR, Finance, Talent Operations, and Enterprise Tech Support.', roles: 'Active Requisitions', icon: BriefcaseBusiness, accent: '#0265FF' },
];

export const LightIndustryPracticeGrid: React.FC = () => {
  return (
    <section
      className="theme-light"
      style={{
        backgroundColor: '#f8fafc',
        borderBottom: '1px solid #e2e8f0',
        padding: '6rem 2rem',
      }}
    >
      <div style={{ maxWidth: '1280px', margin: '0 auto', textAlign: 'center' }}>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            padding: '0.35rem 0.85rem',
            borderRadius: '9999px',
            backgroundColor: '#EFF6FF',
            border: '1px solid #BFDBFE',
            fontSize: '0.8125rem',
            fontWeight: 800,
            color: '#0265FF',
            marginBottom: '1rem',
          }}
        >
          <Sparkles size={14} />
          <span>OUR RECRUITMENT EXPERTISE & PRACTICE DOMAINS</span>
        </div>

        <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 900, letterSpacing: '-0.03em', color: '#0F172A', marginBottom: '0.75rem' }}>
          Our Recruitment Expertise Across Key Technology Domains
        </h2>
        <p style={{ color: '#475569', fontSize: '1.0625rem', maxWidth: '720px', margin: '0 auto 4rem auto', lineHeight: 1.6 }}>
          NexaTalent IT Solutions organizes talent acquisition into specialized core technology practices to deliver structured candidate screening and reliable hiring.
        </p>

        {/* 6 Core Practices Grid - 3 per row on desktop */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-left">
          {practices.map((p) => {
            const IconComp = p.icon;
            return (
              <motion.div
                key={p.id}
                whileHover={{ y: -6, boxShadow: '0 20px 40px -15px rgba(2, 101, 255, 0.12)' }}
                style={{
                  backgroundColor: '#ffffff',
                  borderRadius: '20px',
                  border: '1px solid #e2e8f0',
                  padding: '1.75rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  boxShadow: '0 4px 12px -2px rgba(0,0,0,0.03)',
                  transition: 'all 0.25s ease'
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                    <div
                      style={{
                        width: '44px',
                        height: '44px',
                        borderRadius: '12px',
                        backgroundColor: '#EFF6FF',
                        color: '#0265FF',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <IconComp size={22} />
                    </div>
                    <span style={{ fontSize: '0.725rem', fontWeight: 800, color: '#0265FF', backgroundColor: '#EFF6FF', padding: '0.25rem 0.65rem', borderRadius: '9999px', border: '1px solid #DBEAFE' }}>
                      {p.roles}
                    </span>
                  </div>

                  <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0F172A', lineHeight: 1.3, marginBottom: '0.6rem' }}>
                    {p.title}
                  </h3>

                  <p style={{ color: '#475569', fontSize: '0.875rem', lineHeight: 1.55, marginBottom: '1.5rem' }}>
                    {p.desc}
                  </p>
                </div>

                <div style={{ paddingTop: '1rem', borderTop: '1px solid #f1f5f9' }}>
                  <Link
                    to={`/industries/${p.id}`}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.35rem',
                      color: '#0265FF',
                      fontWeight: 700,
                      fontSize: '0.85rem',
                      textDecoration: 'none',
                    }}
                  >
                    <span>View Practice Spec</span>
                    <ArrowRight size={14} />
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

