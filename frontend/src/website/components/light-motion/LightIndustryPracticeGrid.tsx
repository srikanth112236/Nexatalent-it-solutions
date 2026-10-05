import React from 'react';
import { motion } from 'framer-motion';
import { 
  Sparkles, 
  ArrowRight, 
  Database, 
  Globe2, 
  Shield, 
  Layers, 
  Cpu, 
  Landmark, 
  Stethoscope, 
  Factory, 
  ShoppingBag, 
  Car, 
  Radio, 
  Plane, 
  Sun, 
  Gamepad2, 
  BriefcaseBusiness 
} from 'lucide-react';
import { Link } from 'react-router-dom';

const practices = [
  { id: 'fintech', title: '1. FinTech & Quantitative Trading', desc: 'Ultra-low latency exchange gateways, FPGA acceleration, C++20, and algorithmic order routing.', roles: '48 Roles Active', icon: Landmark, accent: '#0265FF' },
  { id: 'ai-ml', title: '2. Generative AI & LLM Systems', desc: 'Distributed vLLM clusters, GPU memory kernels, RLHF alignment, and low-latency embeddings.', roles: '62 Roles Active', icon: Sparkles, accent: '#0265FF' },
  { id: 'cloud', title: '3. Cloud-Native & Distributed Systems', desc: 'Raft consensus state machines, petabyte-scale messaging fabrics, and multi-region Kubernetes.', roles: '74 Roles Active', icon: Database, accent: '#0265FF' },
  { id: 'gcc', title: '4. Global Capability Center (GCC) Pods', desc: 'Turnkey site directors, staff architects, and full pods established in 75 days across India hubs.', roles: '85 Roles Active', icon: Globe2, accent: '#0265FF' },
  { id: 'security', title: '5. Infrastructure Security & eBPF', desc: 'Kernel-bypass observability, zero-trust container security, cryptographic protocols, and SOC2.', roles: '36 Roles Active', icon: Shield, accent: '#0265FF' },
  { id: 'data', title: '6. High-Throughput Data Engineering', desc: 'Real-time streaming pipelines, Apache Flink/Kafka at scale, and columnar analytical engines.', roles: '42 Roles Active', icon: Layers, accent: '#0265FF' },
  { id: 'technology', title: '7. Technology & Enterprise SaaS', desc: 'Hyper-scale microservices, multi-tenant cloud platforms, and distributed backend engineering.', roles: '90 Roles Active', icon: Cpu, accent: '#0265FF' },
  { id: 'healthcare', title: '8. Healthcare & Digital MedTech', desc: 'HIPAA-compliant platforms, FHIR integrations, clinical AI models, and genomics data engines.', roles: '38 Roles Active', icon: Stethoscope, accent: '#0265FF' },
  { id: 'manufacturing', title: '9. Manufacturing & Industrial IoT', desc: 'Industry 4.0, embedded C/C++ firmware, SCADA systems, and smart factory robotics automation.', roles: '29 Roles Active', icon: Factory, accent: '#0265FF' },
  { id: 'retail', title: '10. Retail, E-Commerce & Supply Chain', desc: 'High-concurrency checkout engines, dynamic pricing ML, and warehouse robotics automation.', roles: '54 Roles Active', icon: ShoppingBag, accent: '#0265FF' },
  { id: 'automotive', title: '11. Automotive & Autonomous Mobility', desc: 'AUTOSAR adaptive stacks, ADAS computer vision, EV battery management, and connected vehicle IoT.', roles: '31 Roles Active', icon: Car, accent: '#0265FF' },
  { id: 'telecom', title: '12. Telecommunications & 5G Edge', desc: 'OpenRAN architecture, cloud-native packet cores, 5G MEC, and low-latency network slicing.', roles: '27 Roles Active', icon: Radio, accent: '#0265FF' },
  { id: 'aerospace', title: '13. Aerospace & Defense Technology', desc: 'DO-178C avionics software, real-time embedded Linux, flight control logic, and satellite systems.', roles: '22 Roles Active', icon: Plane, accent: '#0265FF' },
  { id: 'energy', title: '14. Energy, Utilities & CleanTech', desc: 'Smart grid telemetry, renewable energy analytics, IoT sensor fabrics, and carbon tracking platforms.', roles: '25 Roles Active', icon: Sun, accent: '#0265FF' },
  { id: 'media', title: '15. Media, Gaming & Streaming Tech', desc: 'Unreal/Unity rendering engines, WebRTC video streaming, anti-cheat security, and cloud gaming.', roles: '33 Roles Active', icon: Gamepad2, accent: '#0265FF' },
  { id: 'professional-services', title: '16. Professional IT Advisory & Services', desc: 'Management consulting, Big-4 digital transformations, enterprise architecture, and SAP S/4HANA.', roles: '45 Roles Active', icon: BriefcaseBusiness, accent: '#0265FF' },
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
          <span>16 CORE PRACTICE VERTICALS & SOLUTIONS</span>
        </div>

        <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 900, letterSpacing: '-0.03em', color: '#0F172A', marginBottom: '0.75rem' }}>
          Specialized Talent Solutions Across 16 Core Industries
        </h2>
        <p style={{ color: '#475569', fontSize: '1.0625rem', maxWidth: '720px', margin: '0 auto 4rem auto', lineHeight: 1.6 }}>
          NexaTalent IT Solutions organizes engineering teams into 16 dedicated technical practice verticals led by veteran tech recruiters and industry architects.
        </p>

        {/* 16 Practices Responsive Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', textAlign: 'left' }}>
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

