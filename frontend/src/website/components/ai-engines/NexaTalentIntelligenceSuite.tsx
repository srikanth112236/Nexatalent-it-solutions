import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, 
  Cpu, 
  FileText, 
  CheckCircle2, 
  ShieldCheck, 
  Bot, 
  Network, 
  Users, 
  Building2, 
  Briefcase, 
  Search, 
  AlertTriangle, 
  MessageSquare, 
  Terminal, 
  Award,
  Lock
} from 'lucide-react';

export function NexaTalentIntelligenceSuite() {
  const [activeModule, setActiveModule] = useState<'match' | 'parse' | 'screen' | 'source' | 'graph' | 'copilot' | 'partner' | 'connect'>('match');
  const [copilotCommand, setCopilotCommand] = useState('Find 10 immediate Java developers in Bangalore with 4-7 years experience');
  const [copilotRunning, setCopilotRunning] = useState(false);
  const [copilotResult, setCopilotResult] = useState<string | null>(null);

  const [parseMode, setParseMode] = useState<'resume' | 'jd'>('resume');
  const matchScoreWeights = {
    skills: 95,
    experience: 90,
    notice: 98,
    compensation: 88,
  };

  const runCopilot = (cmd: string) => {
    setCopilotCommand(cmd);
    setCopilotRunning(true);
    setCopilotResult(null);
    setTimeout(() => {
      setCopilotRunning(false);
      if (cmd.includes('Java')) {
        setCopilotResult('Found 14 verified candidates matching criteria. 8 have <15 days notice, 6 immediately available in Bengaluru. Median CTC ₹16.8 LPA. Top matches: NEXA-IND-9482 (96%), NEXA-IND-8821 (94%).');
      } else if (cmd.includes('requirements')) {
        setCopilotResult('Analysis: 2 active requisitions have <3 candidate submissions: (1) Rust Core Dev (Fintech) - needs sourcing boost; (2) Staff Cloud Architect (GCC) - 4 vendor submissions pending screening.');
      } else if (cmd.includes('vendors')) {
        setCopilotResult('Identified 3 top-tier empanelled vendors with >85% Java interview conversion: (1) CloudTech Partners (Bangalore), (2) AgileSquad IT (Hyderabad), (3) Apex Talent Sourcing (Pune).');
      } else {
        setCopilotResult('Analysis complete. Candidate calibrated against JD. 4 technical strengths identified, 1 minor framework gap (FastAPI vs Flask). Recommended for Client Round 1.');
      }
    }, 700);
  };

  return (
    <section 
      id="talent-intelligence-suite"
      style={{
        position: 'relative',
        padding: '6rem 1.5rem',
        backgroundColor: '#ffffff',
        borderTop: '1px solid #E2E8F0',
        borderBottom: '1px solid #E2E8F0',
        overflow: 'hidden'
      }}
    >
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
        
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.4rem 1rem',
            borderRadius: '9999px',
            backgroundColor: '#EEF2FF',
            border: '1px solid #C7D2FE',
            color: '#3730A3',
            fontSize: '0.85rem',
            fontWeight: 700,
            marginBottom: '1rem'
          }}>
            <Sparkles size={16} color="#4361EE" />
            <span>Nexa Talent Intelligence™ Central Engine</span>
          </div>

          <h2 style={{
            fontSize: 'clamp(2.2rem, 4.5vw, 3.5rem)',
            fontWeight: 800,
            letterSpacing: '-0.03em',
            color: '#0B132B',
            lineHeight: 1.15,
            marginBottom: '1rem'
          }}>
            The AI-Powered <span style={{ color: '#4361EE' }}>Recruitment Operating System</span>
          </h2>

          <p style={{
            fontSize: 'clamp(1rem, 1.8vw, 1.2rem)',
            color: '#475569',
            maxWidth: '850px',
            margin: '0 auto',
            lineHeight: 1.6
          }}>
            Nexa Talent IT Solutions is not a traditional recruitment agency. We built a proprietary multi-sided marketplace connecting Client Requirements ↔ AI ↔ Candidates ↔ Recruiters ↔ Vendors.
          </p>
        </div>

        {/* Central Pulse Architecture Flow Bar */}
        <div style={{
          backgroundColor: '#0B132B',
          borderRadius: '24px',
          padding: '2.5rem',
          color: '#ffffff',
          marginBottom: '4rem',
          position: 'relative',
          overflow: 'hidden',
          boxShadow: '0 20px 60px rgba(11, 19, 43, 0.25)'
        }}>
          <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#93C5FD', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Central Multi-Sided Coordination Topology
            </span>
            <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#ffffff', marginTop: '0.25rem' }}>
              How Nexa Talent Intelligence™ Governs Every Mandate
            </h3>
          </div>

          {/* 6-Node Flow Visualizer */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
            gap: '1rem',
            alignItems: 'center',
            position: 'relative',
            zIndex: 1
          }}>
            {[
              { icon: Building2, label: 'Client Requirement', sub: 'JD / Natural Language', color: '#60A5FA' },
              { icon: Cpu, label: 'Nexa AI Engine™', sub: 'Embeddings & Weights', color: '#818CF8' },
              { icon: Users, label: 'Candidate', sub: 'Talent ID & Vetted CTC', color: '#34D399' },
              { icon: Bot, label: 'Nexa Recruiter', sub: 'Copilot Verification', color: '#F472B6' },
              { icon: Briefcase, label: 'Vendor Partner', sub: 'Empanelled Supply', color: '#FBBF24' },
              { icon: CheckCircle2, label: 'Client Placement', sub: 'Offer & Day-1 Joining', color: '#10B981' },
            ].map((node) => {
              const Icon = node.icon;
              return (
                <div
                  key={node.label}
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.06)',
                    border: `1px solid rgba(255, 255, 255, 0.12)`,
                    borderRadius: '16px',
                    padding: '1.25rem 1rem',
                    textAlign: 'center',
                    backdropFilter: 'blur(10px)',
                    position: 'relative'
                  }}
                >
                  <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '12px',
                    backgroundColor: `${node.color}20`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 0.75rem'
                  }}>
                    <Icon size={20} color={node.color} />
                  </div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#ffffff', marginBottom: '0.2rem' }}>
                    {node.label}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#94A3B8' }}>
                    {node.sub}
                  </div>
                </div>
              );
            })}
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '1.5rem',
            marginTop: '1.75rem',
            paddingTop: '1.5rem',
            borderTop: '1px solid rgba(255, 255, 255, 0.1)',
            flexWrap: 'wrap',
            fontSize: '0.8rem',
            color: '#94A3B8'
          }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <ShieldCheck size={14} color="#10B981" />
              <span>India DPDP Act 2023 Explicit Candidate Consent</span>
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <Lock size={14} color="#60A5FA" />
              <span>Multi-Signal Duplicate Detection</span>
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <Award size={14} color="#FBBF24" />
              <span>Zero Black-Box Scoring (Assistive & Auditable)</span>
            </span>
          </div>
        </div>

        {/* 8 Branded Modules Tabs */}
        <div style={{
          display: 'flex',
          gap: '0.5rem',
          overflowX: 'auto',
          paddingBottom: '1rem',
          marginBottom: '2.5rem',
          scrollbarWidth: 'none'
        }}>
          {[
            { id: 'match', label: 'Nexa Match™', sub: 'Semantic Matching' },
            { id: 'parse', label: 'Nexa Parse™', sub: 'Resume & JD AI' },
            { id: 'screen', label: 'Nexa Screen™', sub: 'Automated Screening' },
            { id: 'source', label: 'Nexa Source™', sub: 'Passive Discovery' },
            { id: 'graph', label: 'Nexa Graph™', sub: 'Talent Relationships' },
            { id: 'copilot', label: 'Nexa Copilot™', sub: 'Recruiter Assistant' },
            { id: 'partner', label: 'Nexa Partner™', sub: 'Vendor Ecosystem' },
            { id: 'connect', label: 'Nexa Connect™', sub: 'Consent & Messaging' },
          ].map((tab) => {
            const isActive = activeModule === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveModule(tab.id as any)}
                style={{
                  padding: '0.85rem 1.25rem',
                  borderRadius: '14px',
                  border: isActive ? '2px solid #4361EE' : '1px solid #E2E8F0',
                  backgroundColor: isActive ? '#EEF2FF' : '#ffffff',
                  color: isActive ? '#4361EE' : '#334155',
                  textAlign: 'left',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.15s ease',
                  boxShadow: isActive ? '0 4px 15px rgba(67, 97, 238, 0.15)' : 'none'
                }}
              >
                <div style={{ fontSize: '0.9rem', fontWeight: 800 }}>{tab.label}</div>
                <div style={{ fontSize: '0.75rem', color: isActive ? '#3730A3' : '#64748B' }}>{tab.sub}</div>
              </button>
            );
          })}
        </div>

        {/* Module Content Views */}
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '24px',
          border: '1px solid #E2E8F0',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.05)',
          padding: '2.5rem',
          minHeight: '480px'
        }}>
          <AnimatePresence mode="wait">
            
            {/* MODULE 1: NEXA MATCH */}
            {activeModule === 'match' && (
              <motion.div
                key="match"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '3rem' }}
              >
                <div>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: '#4361EE', fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                    <Cpu size={16} />
                    <span>Deep Multi-Factor Matching Engine</span>
                  </div>
                  <h3 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0B132B', marginBottom: '0.75rem' }}>
                    Nexa Match™: Semantic Scoring & Gap Analysis
                  </h3>
                  <p style={{ fontSize: '0.95rem', color: '#475569', lineHeight: 1.6, marginBottom: '2rem' }}>
                    Unlike traditional keyword-matching ATS systems that reject qualified engineers due to syntax variance, Nexa Match™ evaluates structured candidate data, semantic vector embeddings, and configurable weighted scoring.
                  </p>

                  <div style={{ marginBottom: '1.5rem' }}>
                    <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0B132B', marginBottom: '0.75rem' }}>
                      Configurable Weight Distribution
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                      {[
                        { label: 'Technical Skills & Depth', val: matchScoreWeights.skills, key: 'skills' },
                        { label: 'Experience & Architecture Scale', val: matchScoreWeights.experience, key: 'experience' },
                        { label: 'Notice Period & Joining Certainty', val: matchScoreWeights.notice, key: 'notice' },
                        { label: 'CTC & Budget Envelope Fit', val: matchScoreWeights.compensation, key: 'compensation' },
                      ].map((item) => (
                        <div key={item.key}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: 600, color: '#475569', marginBottom: '0.25rem' }}>
                            <span>{item.label}</span>
                            <span style={{ color: '#4361EE', fontWeight: 700 }}>{item.val}%</span>
                          </div>
                          <div style={{ width: '100%', height: '6px', backgroundColor: '#F1F5F9', borderRadius: '4px', overflow: 'hidden' }}>
                            <div style={{ width: `${item.val}%`, height: '100%', backgroundColor: '#4361EE', borderRadius: '4px' }} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Match Card Simulation */}
                <div style={{
                  backgroundColor: '#F8FAFC',
                  borderRadius: '20px',
                  border: '1px solid #E2E8F0',
                  padding: '2rem'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
                    <div>
                      <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#4361EE', backgroundColor: '#EEF2FF', padding: '0.2rem 0.6rem', borderRadius: '6px' }}>
                        NEXA-IND-9482
                      </span>
                      <h4 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0B132B', marginTop: '0.35rem' }}>
                        Staff Distributed Systems Engineer
                      </h4>
                      <div style={{ fontSize: '0.85rem', color: '#64748B' }}>Bengaluru • 7.4 Years Exp • 15 Days Notice</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '2rem', fontWeight: 800, color: '#10B981', lineHeight: 1 }}>94%</div>
                      <div style={{ fontSize: '0.75rem', color: '#10B981', fontWeight: 700 }}>Match Score</div>
                    </div>
                  </div>

                  {/* "Why this candidate?" transparent explanation */}
                  <div style={{
                    backgroundColor: '#ffffff',
                    borderRadius: '14px',
                    border: '1px solid #E2E8F0',
                    padding: '1.25rem',
                    marginBottom: '1rem'
                  }}>
                    <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#166534', display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.5rem' }}>
                      <CheckCircle2 size={15} color="#16A34A" />
                      <span>Why this candidate? (Transparent Match Rationale)</span>
                    </div>
                    <ul style={{ margin: 0, paddingLeft: '1.25rem', fontSize: '0.85rem', color: '#334155', lineHeight: 1.6 }}>
                      <li>5.8 years production Go and Java microservices experience</li>
                      <li>Proven scale handling 25,000 TPS on Kafka event bus</li>
                      <li>Bengaluru based with verified immediate / 15-day notice period</li>
                      <li>Expected CTC ₹36 LPA is within client budget band (₹32L - ₹42L)</li>
                    </ul>
                  </div>

                  {/* Highlighted Gaps */}
                  <div style={{
                    backgroundColor: '#FFFBEB',
                    borderRadius: '14px',
                    border: '1px solid #FDE68A',
                    padding: '1rem',
                    fontSize: '0.85rem',
                    color: '#92400E'
                  }}>
                    <div style={{ fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.25rem' }}>
                      <AlertTriangle size={15} color="#D97706" />
                      <span>Identified Skill & Scope Gaps:</span>
                    </div>
                    <div>Candidate has limited AWS EKS Terraform automation (mostly GCP GKE). Recruiter verified GCP skills transfer seamlessly.</div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* MODULE 2: NEXA PARSE */}
            {activeModule === 'parse' && (
              <motion.div
                key="parse"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '3rem' }}
              >
                <div>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: '#4361EE', fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                    <FileText size={16} />
                    <span>Bidirectional Entity Extraction</span>
                  </div>
                  <h3 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0B132B', marginBottom: '0.75rem' }}>
                    Nexa Parse™: Resume & JD Intelligence
                  </h3>
                  <p style={{ fontSize: '0.95rem', color: '#475569', lineHeight: 1.6, marginBottom: '1.75rem' }}>
                    Converts unstructured PDFs, DOCX files, and raw text into 15+ structured database entities with automated confidence scores and skill taxonomies.
                  </p>

                  <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem' }}>
                    <button
                      type="button"
                      onClick={() => setParseMode('resume')}
                      style={{
                        padding: '0.65rem 1.25rem',
                        borderRadius: '10px',
                        border: 'none',
                        cursor: 'pointer',
                        fontSize: '0.85rem',
                        fontWeight: 700,
                        backgroundColor: parseMode === 'resume' ? '#4361EE' : '#F1F5F9',
                        color: parseMode === 'resume' ? '#ffffff' : '#475569'
                      }}
                    >
                      Resume Parsing (15 Entities)
                    </button>
                    <button
                      type="button"
                      onClick={() => setParseMode('jd')}
                      style={{
                        padding: '0.65rem 1.25rem',
                        borderRadius: '10px',
                        border: 'none',
                        cursor: 'pointer',
                        fontSize: '0.85rem',
                        fontWeight: 700,
                        backgroundColor: parseMode === 'jd' ? '#4361EE' : '#F1F5F9',
                        color: parseMode === 'jd' ? '#ffffff' : '#475569'
                      }}
                    >
                      JD Requirement Parsing
                    </button>
                  </div>
                </div>

                {/* Parsing Entity Output */}
                <div style={{
                  backgroundColor: '#0B132B',
                  borderRadius: '20px',
                  padding: '2rem',
                  color: '#ffffff',
                  fontFamily: 'monospace',
                  fontSize: '0.85rem',
                  overflowX: 'auto'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.5rem' }}>
                    <span style={{ color: '#93C5FD', fontWeight: 700 }}>
                      {parseMode === 'resume' ? 'JSON // Nexa Talent ID: NEXA-IND-9482' : 'JSON // Client Requisition Struct'}
                    </span>
                    <span style={{ color: '#34D399', fontSize: '0.75rem' }}>AI Confidence: 98.4%</span>
                  </div>

                  {parseMode === 'resume' ? (
                    <pre style={{ margin: 0, color: '#E2E8F0', whiteSpace: 'pre-wrap' }}>
{`{
  "nexa_talent_id": "NEXA-IND-9482",
  "candidate_name": "Karthik Venkataraman",
  "primary_title": "Lead Backend Architect",
  "experience_years": 8.2,
  "current_ctc": "₹32,00,000 INR",
  "expected_ctc": "₹38,00,000 - ₹42,00,000 INR",
  "notice_period": "30 Days (Negotiable buyout)",
  "location": "Bengaluru",
  "preferred_locations": ["Bengaluru", "Hyderabad", "Remote"],
  "skills": [
    { "name": "Go", "years": 5.4, "confidence": 0.98 },
    { "name": "Distributed Systems", "confidence": 0.95 },
    { "name": "Kafka", "confidence": 0.92 },
    { "name": "Kubernetes", "confidence": 0.89 }
  ],
  "education": "B.Tech Computer Science, NIT Trichy",
  "dpdp_consent_status": "EXPLICIT_GRANTED"
}`}
                    </pre>
                  ) : (
                    <pre style={{ margin: 0, color: '#E2E8F0', whiteSpace: 'pre-wrap' }}>
{`{
  "client_mandate_id": "REQ-FINTECH-0881",
  "job_title": "Staff Backend Engineer (Low Latency)",
  "headcount": 5,
  "mandatory_skills": ["Go", "Kafka", "PostgreSQL", "Concurrency"],
  "preferred_experience": "6-10 Years",
  "location": "Bengaluru",
  "work_mode": "Hybrid (3 days onsite)",
  "budget_bracket": "₹35,00,000 - ₹45,00,000 INR",
  "target_joining": "Immediate / Within 30 days",
  "sla_commitment": "72 Hours First Shortlist",
  "empanelled_vendors_eligible": 12
}`}
                    </pre>
                  )}
                </div>
              </motion.div>
            )}

            {/* MODULE 3: NEXA SCREEN */}
            {activeModule === 'screen' && (
              <motion.div
                key="screen"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '3rem' }}
              >
                <div>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: '#4361EE', fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                    <Bot size={16} />
                    <span>Role-Specific AI Screening</span>
                  </div>
                  <h3 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0B132B', marginBottom: '0.75rem' }}>
                    Nexa Screen™: Automated Technical & Behavioral Vetting
                  </h3>
                  <p style={{ fontSize: '0.95rem', color: '#475569', lineHeight: 1.6, marginBottom: '1.5rem' }}>
                    Generates tailored screening questions mapped directly to client JD criteria. Conducts asynchronous text evaluations with automated candidate transcript scoring and human recruiter sign-off.
                  </p>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div style={{ padding: '1rem', borderRadius: '12px', backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0' }}>
                      <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0B132B' }}>Generated Technical Question 1:</div>
                      <div style={{ fontSize: '0.85rem', color: '#475569', marginTop: '0.25rem' }}>
                        "Explain how you prevent consumer group rebalance storms in high-throughput Apache Kafka clusters when worker nodes cycle."
                      </div>
                    </div>
                    <div style={{ padding: '1rem', borderRadius: '12px', backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0' }}>
                      <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0B132B' }}>Generated Architectural Question 2:</div>
                      <div style={{ fontSize: '0.85rem', color: '#475569', marginTop: '0.25rem' }}>
                        "Walk us through how you would architect a dual-region PostgreSQL active-standby database failover with sub-30 second RTO."
                      </div>
                    </div>
                  </div>
                </div>

                {/* Candidate Screening Result */}
                <div style={{ backgroundColor: '#F8FAFC', borderRadius: '20px', border: '1px solid #E2E8F0', padding: '2rem' }}>
                  <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                    Screening Scorecard Assessment
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <h4 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0B132B' }}>Overall Score: 92/100</h4>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#16A34A', backgroundColor: '#DCFCE7', padding: '0.25rem 0.65rem', borderRadius: '6px' }}>
                      Passed AI Screen
                    </span>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', color: '#334155', fontWeight: 600 }}>
                        <span>Distributed Systems Knowledge</span>
                        <span>96%</span>
                      </div>
                      <div style={{ width: '100%', height: '6px', backgroundColor: '#E2E8F0', borderRadius: '3px', marginTop: '4px' }}>
                        <div style={{ width: '96%', height: '100%', backgroundColor: '#10B981', borderRadius: '3px' }} />
                      </div>
                    </div>
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', color: '#334155', fontWeight: 600 }}>
                        <span>Concurrency & Memory Management</span>
                        <span>90%</span>
                      </div>
                      <div style={{ width: '100%', height: '6px', backgroundColor: '#E2E8F0', borderRadius: '3px', marginTop: '4px' }}>
                        <div style={{ width: '90%', height: '100%', backgroundColor: '#10B981', borderRadius: '3px' }} />
                      </div>
                    </div>
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', color: '#334155', fontWeight: 600 }}>
                        <span>Notice Period Verification</span>
                        <span>100%</span>
                      </div>
                      <div style={{ width: '100%', height: '6px', backgroundColor: '#E2E8F0', borderRadius: '3px', marginTop: '4px' }}>
                        <div style={{ width: '100%', height: '100%', backgroundColor: '#4361EE', borderRadius: '3px' }} />
                      </div>
                    </div>
                  </div>

                  <div style={{ padding: '0.75rem', borderRadius: '10px', backgroundColor: '#EEF2FF', color: '#3730A3', fontSize: '0.8rem', fontWeight: 600 }}>
                    Human Recruiter Gatekeeper: Signed off by Senior Tech Practice Lead. Verified eligible for immediate client submission.
                  </div>
                </div>
              </motion.div>
            )}

            {/* MODULE 4: NEXA SOURCE */}
            {activeModule === 'source' && (
              <motion.div
                key="source"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '3rem' }}
              >
                <div>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: '#4361EE', fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                    <Search size={16} />
                    <span>Passive Talent Graph Discovery</span>
                  </div>
                  <h3 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0B132B', marginBottom: '0.75rem' }}>
                    Nexa Source™ & Duplicate Candidate Detection
                  </h3>
                  <p style={{ fontSize: '0.95rem', color: '#475569', lineHeight: 1.6, marginBottom: '1.5rem' }}>
                    Identifies passive engineering talent across Tier-1 tech corridors while preventing duplicate agency submissions through multi-signal fingerprinting.
                  </p>

                  <div style={{ backgroundColor: '#F8FAFC', borderRadius: '16px', border: '1px solid #E2E8F0', padding: '1.5rem' }}>
                    <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#0B132B', marginBottom: '0.75rem' }}>
                      Multi-Signal Duplicate Prevention Signals:
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', fontSize: '0.85rem', color: '#334155' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <CheckCircle2 size={15} color="#10B981" />
                        <span>Hashed Email & Phone</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <CheckCircle2 size={15} color="#10B981" />
                        <span>Cosine Resume Similarity</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <CheckCircle2 size={15} color="#10B981" />
                        <span>Unique Nexa Talent ID</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <CheckCircle2 size={15} color="#10B981" />
                        <span>Work History Fingerprint</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div style={{ backgroundColor: '#ffffff', borderRadius: '20px', border: '1px solid #E2E8F0', padding: '2rem', boxShadow: '0 10px 30px rgba(0,0,0,0.04)' }}>
                  <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                    Live Sourcing Sieve Simulation
                  </div>
                  <h4 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0B132B', marginBottom: '1rem' }}>
                    Active Candidate Talent Pool
                  </h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {[
                      { name: 'NEXA-IND-9482', role: 'Staff Backend (Go)', status: 'Verified Single Source', flag: 'Approved' },
                      { name: 'NEXA-IND-3211', role: 'DevOps / SRE Lead', status: 'Duplicate Detected (Vendor B)', flag: 'Blocked & Resolved' },
                      { name: 'NEXA-IND-5419', role: 'Principal AI Scientist', status: 'Verified Single Source', flag: 'Approved' },
                    ].map((c) => (
                      <div key={c.name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.85rem 1rem', borderRadius: '12px', backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0' }}>
                        <div>
                          <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#0B132B' }}>{c.name}</div>
                          <div style={{ fontSize: '0.75rem', color: '#64748B' }}>{c.role} • {c.status}</div>
                        </div>
                        <span style={{ fontSize: '0.75rem', fontWeight: 700, color: c.flag.includes('Approved') ? '#10B981' : '#D97706', backgroundColor: c.flag.includes('Approved') ? '#ECFDF5' : '#FEF3C7', padding: '0.2rem 0.5rem', borderRadius: '6px' }}>
                          {c.flag}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* MODULE 5: NEXA GRAPH */}
            {activeModule === 'graph' && (
              <motion.div
                key="graph"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '3rem' }}
              >
                <div>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: '#4361EE', fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                    <Network size={16} />
                    <span>Relationship Intelligence</span>
                  </div>
                  <h3 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0B132B', marginBottom: '0.75rem' }}>
                    Nexa Graph™: Talent Relationship Intelligence
                  </h3>
                  <p style={{ fontSize: '0.95rem', color: '#475569', lineHeight: 1.6, marginBottom: '1.5rem' }}>
                    Instead of treating resumes as flat static documents, Nexa Graph™ builds an associative graph connecting Candidates ↔ Skills ↔ Experience ↔ Companies ↔ Requirements ↔ Similar Candidates.
                  </p>

                  <div style={{
                    padding: '1.5rem',
                    borderRadius: '16px',
                    backgroundColor: '#EEF2FF',
                    border: '1px solid #C7D2FE',
                    marginBottom: '1.5rem'
                  }}>
                    <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#1E1B4B', marginBottom: '0.5rem' }}>
                      "Find Candidates Similar to This Candidate"
                    </div>
                    <div style={{ fontSize: '0.85rem', color: '#3730A3', lineHeight: 1.5 }}>
                      Recruiters can upload an elite high-performing profile and instantly discover 15 comparable engineers with equivalent architectural pedigree.
                    </div>
                  </div>
                </div>

                <div style={{
                  backgroundColor: '#0B132B',
                  borderRadius: '20px',
                  padding: '2.5rem',
                  color: '#ffffff',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                  textAlign: 'center'
                }}>
                  <Network size={54} color="#60A5FA" style={{ marginBottom: '1rem' }} />
                  <h4 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#ffffff', marginBottom: '0.5rem' }}>
                    High-Dimension Talent Vector Graph
                  </h4>
                  <p style={{ fontSize: '0.85rem', color: '#94A3B8', maxWidth: '380px', lineHeight: 1.6, marginBottom: '1.5rem' }}>
                    Mapping semantic cluster proximity between Go, C++, Rust, and low-latency architectural patterns across 350,000+ indexed tech profiles.
                  </p>
                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', justifyContent: 'center' }}>
                    <span style={{ fontSize: '0.75rem', padding: '0.3rem 0.75rem', borderRadius: '9999px', backgroundColor: 'rgba(255,255,255,0.1)', color: '#93C5FD' }}>Candidate Cluster</span>
                    <span style={{ fontSize: '0.75rem', padding: '0.3rem 0.75rem', borderRadius: '9999px', backgroundColor: 'rgba(255,255,255,0.1)', color: '#34D399' }}>Company Pedigree</span>
                    <span style={{ fontSize: '0.75rem', padding: '0.3rem 0.75rem', borderRadius: '9999px', backgroundColor: 'rgba(255,255,255,0.1)', color: '#F472B6' }}>Skill Relationships</span>
                  </div>
                </div>
              </motion.div>
            )}

            {/* MODULE 6: NEXA COPILOT */}
            {activeModule === 'copilot' && (
              <motion.div
                key="copilot"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '3rem' }}
              >
                <div>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: '#4361EE', fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                    <Terminal size={16} />
                    <span>Recruiter AI Copilot</span>
                  </div>
                  <h3 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0B132B', marginBottom: '0.75rem' }}>
                    Nexa Copilot™: Recruiter AI Operations Assistant
                  </h3>
                  <p style={{ fontSize: '0.95rem', color: '#475569', lineHeight: 1.6, marginBottom: '1.5rem' }}>
                    Equips Nexa internal recruiters with an assistive intelligence assistant executing natural language queries against our PostgreSQL vector database.
                  </p>

                  <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0B132B', marginBottom: '0.5rem' }}>
                    Try Instant Copilot Commands:
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {[
                      'Find 10 immediate Java developers in Bangalore with 4-7 years experience',
                      'Show requirements that do not have enough candidates',
                      'Find vendors specializing in Java',
                      'Summarize candidate NEXA-IND-9482 for client submission',
                    ].map((cmd) => (
                      <button
                        key={cmd}
                        type="button"
                        onClick={() => runCopilot(cmd)}
                        style={{
                          textAlign: 'left',
                          padding: '0.65rem 0.9rem',
                          borderRadius: '10px',
                          border: '1px solid #E2E8F0',
                          backgroundColor: copilotCommand === cmd ? '#EEF2FF' : '#F8FAFC',
                          color: copilotCommand === cmd ? '#4361EE' : '#334155',
                          fontSize: '0.8rem',
                          fontWeight: 600,
                          cursor: 'pointer'
                        }}
                      >
                        ⚡ "{cmd}"
                      </button>
                    ))}
                  </div>
                </div>

                {/* Copilot Terminal Simulation */}
                <div style={{
                  backgroundColor: '#0F172A',
                  borderRadius: '20px',
                  padding: '2rem',
                  color: '#ffffff',
                  fontFamily: 'monospace',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  boxShadow: '0 20px 50px rgba(0,0,0,0.3)'
                }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem', borderBottom: '1px solid #334155', paddingBottom: '0.75rem' }}>
                      <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#EF4444' }} />
                      <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#F59E0B' }} />
                      <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#10B981' }} />
                      <span style={{ fontSize: '0.75rem', color: '#94A3B8', marginLeft: '0.5rem' }}>nexa-copilot-v2.6 // authorized_recruiter_session</span>
                    </div>

                    <div style={{ color: '#60A5FA', fontSize: '0.85rem', marginBottom: '0.5rem' }}>
                      $ copilot --execute "{copilotCommand}"
                    </div>

                    {copilotRunning ? (
                      <div style={{ color: '#FBBF24', fontSize: '0.85rem' }}>
                        Processing semantic vector search over talent graph...
                      </div>
                    ) : copilotResult ? (
                      <div style={{ color: '#34D399', fontSize: '0.85rem', lineHeight: 1.6 }}>
                        {copilotResult}
                      </div>
                    ) : (
                      <div style={{ color: '#94A3B8', fontSize: '0.85rem' }}>
                        Ready. Click any preset command above or type query to execute.
                      </div>
                    )}
                  </div>

                  <div style={{ marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid #334155', fontSize: '0.75rem', color: '#64748B' }}>
                    RBAC Protected • Multi-Tenant Client Isolation Active
                  </div>
                </div>
              </motion.div>
            )}

            {/* MODULE 7: NEXA PARTNER */}
            {activeModule === 'partner' && (
              <motion.div
                key="partner"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '3rem' }}
              >
                <div>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: '#4361EE', fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                    <Briefcase size={16} />
                    <span>Vendor Management Portal & Marketplace</span>
                  </div>
                  <h3 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0B132B', marginBottom: '0.75rem' }}>
                    Nexa Partner™: Recruitment Vendor Ecosystem
                  </h3>
                  <p style={{ fontSize: '0.95rem', color: '#475569', lineHeight: 1.6, marginBottom: '1.5rem' }}>
                    Empanelled recruitment vendors receive relevant, pre-qualified client requirements. Human compliance officers verify GST, CIN, and PAN before portal activation.
                  </p>

                  <div style={{
                    padding: '1.25rem',
                    borderRadius: '16px',
                    backgroundColor: '#F8FAFC',
                    border: '1px solid #E2E8F0',
                    marginBottom: '1.5rem'
                  }}>
                    <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#0B132B', marginBottom: '0.5rem' }}>
                      5-Stage Empanelment Verification Workflow:
                    </div>
                    <div style={{ fontSize: '0.8rem', color: '#475569', lineHeight: 1.6 }}>
                      Application Submission → Document Verification (GST/PAN) → Nexa Human Review → Approved Status → Requirement Marketplace Activated.
                    </div>
                  </div>
                </div>

                <div style={{ backgroundColor: '#ffffff', borderRadius: '20px', border: '1px solid #E2E8F0', padding: '2rem', boxShadow: '0 10px 30px rgba(0,0,0,0.04)' }}>
                  <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                    Vendor Performance Analytics Engine
                  </div>
                  <h4 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0B132B', marginBottom: '1.25rem' }}>
                    Auditable Vendor Scorecard
                  </h4>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                    <div style={{ padding: '1rem', borderRadius: '12px', backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0' }}>
                      <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#4361EE' }}>89.4%</div>
                      <div style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 600 }}>Submission Quality</div>
                    </div>
                    <div style={{ padding: '1rem', borderRadius: '12px', backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0' }}>
                      <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#10B981' }}>76.2%</div>
                      <div style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 600 }}>Interview Conversion</div>
                    </div>
                    <div style={{ padding: '1rem', borderRadius: '12px', backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0' }}>
                      <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#8B5CF6' }}>94.1%</div>
                      <div style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 600 }}>Offer-to-Joiner Ratio</div>
                    </div>
                    <div style={{ padding: '1rem', borderRadius: '12px', backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0' }}>
                      <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0B132B' }}>4.2 Hrs</div>
                      <div style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 600 }}>Avg. Response SLA</div>
                    </div>
                  </div>

                  <div style={{ padding: '0.75rem', borderRadius: '10px', backgroundColor: '#FEF3C7', color: '#92400E', fontSize: '0.75rem', fontWeight: 600 }}>
                    Notice: AI does not make final approval decisions. All vendor empanelment requires formal review by Nexa Legal & Operations.
                  </div>
                </div>
              </motion.div>
            )}

            {/* MODULE 8: NEXA CONNECT */}
            {activeModule === 'connect' && (
              <motion.div
                key="connect"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '3rem' }}
              >
                <div>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: '#4361EE', fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                    <MessageSquare size={16} />
                    <span>Multi-Party Communications & Consent</span>
                  </div>
                  <h3 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0B132B', marginBottom: '0.75rem' }}>
                    Nexa Connect™ & DPDP Consent Engine
                  </h3>
                  <p style={{ fontSize: '0.95rem', color: '#475569', lineHeight: 1.6, marginBottom: '1.5rem' }}>
                    Automates multi-party communication via transactional Email and WhatsApp Business APIs with full audit logs. Candidate profiles cannot be shared without explicit recorded consent.
                  </p>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: '#334155' }}>
                      <ShieldCheck size={16} color="#10B981" />
                      <span>Explicit candidate consent logged prior to client submission</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: '#334155' }}>
                      <ShieldCheck size={16} color="#10B981" />
                      <span>Unconditional right to data access, correction, and permanent deletion</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: '#10B981' }}>
                      <ShieldCheck size={16} color="#10B981" />
                      <span>Indian Digital Personal Data Protection (DPDP) Act 2023 compliant</span>
                    </div>
                  </div>
                </div>

                <div style={{ backgroundColor: '#F8FAFC', borderRadius: '20px', border: '1px solid #E2E8F0', padding: '2rem' }}>
                  <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                    Automated WhatsApp & Email Dispatch Telemetry
                  </div>
                  <h4 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0B132B', marginBottom: '1rem' }}>
                    Candidate & Client Event Stream
                  </h4>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    <div style={{ padding: '0.85rem', borderRadius: '12px', backgroundColor: '#ffffff', border: '1px solid #E2E8F0' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: 700, color: '#0B132B' }}>
                        <span>WhatsApp OTP & Verification</span>
                        <span style={{ color: '#10B981' }}>Delivered (0.4s)</span>
                      </div>
                      <div style={{ fontSize: '0.75rem', color: '#64748B', marginTop: '0.2rem' }}>
                        "NexaTalent IT Solutions: Your secure login OTP is 492081. Valid for 5 minutes."
                      </div>
                    </div>

                    <div style={{ padding: '0.85rem', borderRadius: '12px', backgroundColor: '#ffffff', border: '1px solid #E2E8F0' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: 700, color: '#0B132B' }}>
                        <span>Client Interview Invitation</span>
                        <span style={{ color: '#4361EE' }}>Confirmed</span>
                      </div>
                      <div style={{ fontSize: '0.75rem', color: '#64748B', marginTop: '0.2rem' }}>
                        Interview confirmed with VP Engineering on Oct 3, 2026 at 15:00 IST. Calendar invite synced.
                      </div>
                    </div>

                    <div style={{ padding: '0.85rem', borderRadius: '12px', backgroundColor: '#ffffff', border: '1px solid #E2E8F0' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: 700, color: '#0B132B' }}>
                        <span>Candidate Consent Confirmation</span>
                        <span style={{ color: '#10B981' }}>Logged & Immutable</span>
                      </div>
                      <div style={{ fontSize: '0.75rem', color: '#64748B', marginTop: '0.2rem' }}>
                        Candidate consent recorded: SHA-256 fingerprint token stored in audit database.
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>

      </div>
    </section>
  );
}
