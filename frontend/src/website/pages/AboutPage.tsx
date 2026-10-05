import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  CheckCircle2,
  Clock,
  ChevronDown,
  ArrowRight,
  Activity,
  BarChart3,
  Check,
  Award,
  TrendingUp,
  Globe,
  ShieldCheck,
  Cpu,
  HeartPulse,
  ShoppingCart,
  Compass,
  Rocket,
  Layers,
  Zap,
  Landmark,
  Database,
  Factory,
  Car,
  Radio,
  Plane,
  Sun,
  Gamepad2,
  Briefcase
} from 'lucide-react';

import { SiteNavbar, SiteFooter } from '../components/SiteChrome';
import { SeoHead } from '../components/SeoHead';

export function AboutPage() {
  const [activeFaq, setActiveFaq] = useState<number | null>(0);
  const [faqCategory, setFaqCategory] = useState<'General' | 'Vetting' | 'GCC Hubs' | 'Support'>('General');

  const faqs = {
    General: [
      { q: 'What is NexaTalent IT Solutions?', a: 'NexaTalent IT Solutions is an AI-powered talent intelligence and recruitment platform connecting enterprise employers, recruitment partners, and senior software engineers across Dubai, Riyadh, Bangalore, and global tech corridors.' },
      { q: 'How does NexaTalent IT Solutions differ from traditional recruitment agencies?', a: 'Unlike traditional agencies that rely on manual resume screening (60-90 day cycles), NexaTalent IT Solutions combines automated algorithmic code vetting with human technical panel defenses to match pre-evaluated candidate dossiers in under 72 hours.' },
      { q: 'Where are NexaTalent IT Solutions regional hubs located?', a: 'We operate primary engineering hubs in Bangalore (India), Dubai Silicon Oasis (UAE), Riyadh KAFD (Saudi Arabia), and Singapore.' },
    ],
    Vetting: [
      { q: 'What does "Deterministic Talent Verification" mean?', a: 'It means every candidate is evaluated against empirical code execution benchmarks (O(1) memory optimization, high-concurrency stress tests) and live system architecture defenses rather than subjective resume claims.' },
      { q: 'How does Algorithmic Rigor work with Human Empathy?', a: 'While our AI models benchmark code efficiency and memory utilization, experienced tech leads conduct human technical panel interviews to evaluate communication, culture fit, and soft skills.' },
      { q: 'What is the 14-day zero-risk trial guarantee?', a: 'You get 14 full days to work directly with the engineer in your Jira and GitHub repos. If you are not completely satisfied with their output, you pay zero.' },
    ],
    'GCC Hubs': [
      { q: 'How does NexaTalent IT Solutions handle timezone overlap for GCC clients?', a: 'Our Dubai, Riyadh, and Bangalore engineers operate with 4-6 hours of daily synchronous timezone overlap with Middle East and European working hours.' },
      { q: 'Can NexaTalent IT Solutions set up turnkey offshore hubs?', a: 'Yes! We manage local employment contracts, local labor law compliance, hardware logistics, and office space setup for 5 to 50+ person pods.' },
    ],
    Support: [
      { q: 'How do I submit an employer hiring mandate?', a: 'You can click "Submit Requirement" on our homepage or contact our sourcing team to receive 3 pre-vetted candidate dossiers within 72 hours.' },
      { q: 'How do you ensure 100% intellectual property protection?', a: 'All work product, code, and patents belong exclusively to your corporate entity under strict enterprise NDAs and SOC2 compliant protocols.' },
    ],
  };

  return (
    <div className="bg-white min-h-screen text-neutral-900 font-sans relative overflow-x-clip">
      <SeoHead
        title="About Us | NexaTalent IT Solutions — Engineering The Future of Work"
        description="NexaTalent IT Solutions connects companies, recruitment partners, and technology professionals through an intelligent hiring ecosystem. Discover our vision, founding story, future roadmap, and target industries."
        keywords="About NexaTalent IT Solutions, IT recruitment company Bengaluru, GCC tech hiring founders, AI vetting platform, target industries tech staffing"
        canonicalPath="/about"
      />

      <SiteNavbar />

      {/* ============================================================================
       * 1. HERO SECTION — Clean Modern Centered Layout with 3 Preview Cards
       * ============================================================================ */}
      <section className="relative pt-32 pb-20 px-6 lg:px-16 bg-white border-b border-neutral-200/80 text-center overflow-hidden">
        <div className="max-w-5xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-[#0265FF] text-xs font-bold uppercase tracking-wider shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-[#0265FF]" />
            ✦ ABOUT NEXATALENT IT SOLUTIONS
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold text-neutral-900 tracking-tight leading-[1.1] uppercase">
            Built for Modern Engineering <br />
            <span className="text-[#0265FF]">
              Talent Ecosystems
            </span>
          </h1>

          <p className="text-base sm:text-lg text-neutral-600 max-w-3xl mx-auto font-medium leading-relaxed">
            Business success depends on an intelligent, real-time tech talent ecosystem. NexaTalent IT Solutions provides a unified view of verified engineering supply and enterprise demand across Dubai, Riyadh, Bangalore, and global corridors.
          </p>

          {/* 3 Visual Image Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 max-w-5xl mx-auto text-left">
            <div className="relative group overflow-hidden rounded-3xl border border-neutral-200 shadow-xl bg-slate-50 transition-all hover:-translate-y-1">
              <img
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=600&q=80"
                alt="AI Vetting Lab"
                className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="p-5 space-y-1">
                <span className="px-3 py-1 bg-blue-100 text-[#0265FF] text-[10px] font-bold rounded-full border border-blue-200">
                  50,000+ Vetted Devs
                </span>
                <h4 className="font-bold text-sm text-neutral-900 pt-2">AI Code Vetting Lab</h4>
                <p className="text-xs text-neutral-500">Automated algorithmic benchmarks & live system architecture defenses.</p>
              </div>
            </div>

            <div className="relative group overflow-hidden rounded-3xl border border-neutral-200 shadow-xl bg-slate-50 transition-all hover:-translate-y-1">
              <img
                src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80"
                alt="GCC Tech Corridors"
                className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="p-5 space-y-1">
                <span className="px-3 py-1 bg-blue-100 text-[#0265FF] text-[10px] font-bold rounded-full border border-blue-200">
                  100+ Enterprise Clients
                </span>
                <h4 className="font-bold text-sm text-neutral-900 pt-2">GCC Tech Corridors</h4>
                <p className="text-xs text-neutral-500">Dubai Silicon Oasis, Riyadh KAFD, and Bangalore tech hubs.</p>
              </div>
            </div>

            <div className="relative group overflow-hidden rounded-3xl border border-neutral-200 shadow-xl bg-slate-50 transition-all hover:-translate-y-1">
              <img
                src="https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=600&q=80"
                alt="Human Empathy & Retention"
                className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="p-5 space-y-1">
                <span className="px-3 py-1 bg-blue-100 text-[#0265FF] text-[10px] font-bold rounded-full border border-blue-200">
                  99.4% Retention Rate
                </span>
                <h4 className="font-bold text-sm text-neutral-900 pt-2">Human Empathy Safeguards</h4>
                <p className="text-xs text-neutral-500">Dedicated candidate career success managers and 2-year retention pledge.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================================
       * 2. MISSION STATEMENT & KEY METRICS ROW
       * ============================================================================ */}
      <section className="py-16 px-6 lg:px-16 bg-[#FAF8F5] border-b border-neutral-200/80">
        <div className="max-w-5xl mx-auto space-y-10 text-center">
          <div className="space-y-4 max-w-3xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 leading-relaxed">
              We are on a mission to help tech organizations reach their <strong className="text-[#0265FF]">full potential</strong> through smarter and more <strong className="text-[#0265FF]">efficient tech hiring</strong> across global operations.
            </h2>
          </div>

          {/* 4 Crisp Key Metric Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
            <div className="p-6 bg-white rounded-2xl border border-neutral-200/80 shadow-md">
              <div className="text-3xl sm:text-4xl font-extrabold text-neutral-900">25+</div>
              <div className="text-xs font-bold text-neutral-500 mt-2">Global Talent Hubs</div>
            </div>
            <div className="p-6 bg-white rounded-2xl border border-neutral-200/80 shadow-md">
              <div className="text-3xl sm:text-4xl font-extrabold text-[#0265FF]">100+</div>
              <div className="text-xs font-bold text-neutral-500 mt-2">Global Enterprise Partners</div>
            </div>
            <div className="p-6 bg-white rounded-2xl border border-neutral-200/80 shadow-md">
              <div className="text-3xl sm:text-4xl font-extrabold text-[#0265FF]">50,000+</div>
              <div className="text-xs font-bold text-neutral-500 mt-2">Vetted Engineers</div>
            </div>
            <div className="p-6 bg-white rounded-2xl border border-neutral-200/80 shadow-md">
              <div className="text-3xl sm:text-4xl font-extrabold text-[#0265FF]">99.4%</div>
              <div className="text-xs font-bold text-neutral-500 mt-2">Engineering Retention</div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================================
       * 3. NEW SECTION: VISION & MISSION DUAL PILLARS
       * ============================================================================ */}
      <section className="py-20 px-6 lg:px-16 bg-white border-b border-neutral-200/80">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-bold text-[#0265FF] uppercase tracking-widest bg-blue-50 px-3.5 py-1 rounded-full border border-blue-200">
              PURPOSE & PHILOSOPHY
            </span>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-neutral-900 tracking-tight">
              Our Vision & Core Mission
            </h2>
            <p className="text-base text-neutral-600">
              Pioneering the global AI-vetted tech workforce corridor with empirical rigor and human empathy.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="p-8 bg-slate-50 border border-slate-200 rounded-3xl space-y-6 shadow-md hover:shadow-xl transition-all">
              <div className="w-12 h-12 rounded-2xl bg-[#0265FF] text-white flex items-center justify-center font-bold">
                <Compass className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold text-neutral-900">Our Strategic Vision</h3>
              <p className="text-sm text-neutral-600 leading-relaxed font-normal">
                To become the global gold standard for technical talent matchmaking — creating a frictionless corridor where enterprise CTOs and scaleups can deploy pre-evaluated 1% engineering pods anywhere in the world within 72 hours.
              </p>
              <div className="pt-2 flex flex-wrap gap-2 text-xs font-bold text-[#0265FF]">
                <span className="px-3 py-1 bg-white border rounded-full">✓ Zero Hiring Friction</span>
                <span className="px-3 py-1 bg-white border rounded-full">✓ Global Corridor Scale</span>
              </div>
            </div>

            <div className="p-8 bg-blue-50/60 border border-blue-200 rounded-3xl space-y-6 shadow-md hover:shadow-xl transition-all">
              <div className="w-12 h-12 rounded-2xl bg-[#0265FF] text-white flex items-center justify-center font-bold">
                <Rocket className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold text-neutral-900">Our Core Mission</h3>
              <p className="text-sm text-neutral-600 leading-relaxed font-normal">
                To eliminate traditional recruiting latencies by pairing automated AI code benchmarks with expert human panel defenses — providing full transparency, 60% payroll cost arbitrage, and 99.4% engineering retention.
              </p>
              <div className="pt-2 flex flex-wrap gap-2 text-xs font-bold text-[#0265FF]">
                <span className="px-3 py-1 bg-white border rounded-full">✓ Empirical Code Rigor</span>
                <span className="px-3 py-1 bg-white border rounded-full">✓ 99.4% Retention Pledge</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================================
       * 4. NEW SECTION: OUR FOUNDING STORY — HOW WE STARTED
       * ============================================================================ */}
      <section className="py-20 px-6 lg:px-16 bg-[#FAF8F5] border-b border-neutral-200/80">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-bold text-[#0265FF] uppercase tracking-wider bg-blue-50 px-3.5 py-1 rounded-full border border-blue-200">FOUNDING STORY</span>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-neutral-900 tracking-tight">
              How NexaTalent IT Solutions Started
            </h2>
            <p className="text-base text-neutral-600">
              Born from the frustration of 90-day hiring cycles and mismatched tech profiles.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              {
                year: '2021',
                title: 'The Sourcing Friction',
                desc: 'Our founders — veteran tech leads in Bangalore & Dubai — saw tech teams struggle with 60-90 day agency hiring delays and high attrition.'
              },
              {
                year: '2023',
                title: 'Deterministic AI Vetting',
                desc: 'We built our proprietary automated benchmark suite to evaluate algorithm efficiency (O(1) memory) and live system architecture defense.'
              },
              {
                year: '2024',
                title: 'GCC Regional Corridors',
                desc: 'Established physical and legal offshore hubs across Dubai Silicon Oasis, Riyadh KAFD, and Bangalore Outer Ring Road.'
              },
              {
                year: 'Today',
                title: '50,000+ Vetted Network',
                desc: 'Serving 100+ global enterprises and scaleups with 72-hour candidate matching and 99.4% retention.'
              },
            ].map((milestone, idx) => (
              <div key={idx} className="p-6 bg-white rounded-3xl border border-neutral-200/80 shadow-md space-y-3 hover:shadow-xl transition-all">
                <span className="text-3xl font-black text-[#0265FF] block">{milestone.year}</span>
                <h4 className="font-bold text-base text-neutral-900">{milestone.title}</h4>
                <p className="text-xs text-neutral-600 leading-relaxed font-normal">{milestone.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================================
       * 5. NEW SECTION: FUTURE ROADMAP — HOW WE ARE GOING FORWARD
       * ============================================================================ */}
      <section className="py-20 px-6 lg:px-16 bg-white border-b border-neutral-200/80">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-bold text-[#0265FF] uppercase tracking-widest bg-blue-50 px-3.5 py-1 rounded-full border border-blue-200">
              STRATEGIC GROWTH
            </span>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-neutral-900 tracking-tight">
              How We Are Going Forward
            </h2>
            <p className="text-base text-neutral-600">
              Accelerating innovation across global talent networks and autonomous AI verification.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 bg-slate-50 border border-slate-200 rounded-3xl space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#0265FF] text-white flex items-center justify-center font-bold">
                <TrendingUp className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-base text-neutral-900">AI Match Engine V5</h4>
              <p className="text-xs text-neutral-600 leading-relaxed font-normal">
                Sub-second conversational candidate matching parsing live repo codebases directly.
              </p>
            </div>

            <div className="p-6 bg-slate-50 border border-slate-200 rounded-3xl space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#0265FF] text-white flex items-center justify-center font-bold">
                <Globe className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-base text-neutral-900">GCC Corridor Expansion</h4>
              <p className="text-xs text-neutral-600 leading-relaxed font-normal">
                Launching physical hub presence in Qatar, Abu Dhabi, and Oman by Q4.
              </p>
            </div>

            <div className="p-6 bg-slate-50 border border-slate-200 rounded-3xl space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#0265FF] text-white flex items-center justify-center font-bold">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-base text-neutral-900">Zero-Trust Desks</h4>
              <p className="text-xs text-neutral-600 leading-relaxed font-normal">
                Pre-configured hardware-encrypted remote workstations with SOC2 Type II isolation.
              </p>
            </div>

            <div className="p-6 bg-slate-50 border border-slate-200 rounded-3xl space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#0265FF] text-white flex items-center justify-center font-bold">
                <Layers className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-base text-neutral-900">100,000+ Vetted Pool</h4>
              <p className="text-xs text-neutral-600 leading-relaxed font-normal">
                Expanding our pre-evaluated senior engineer database across 50+ modern stacks.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================================
       * 6. SPECIALIZED TALENT SOLUTIONS ACROSS 16 CORE INDUSTRIES (6 IN A ROW SMALL CARDS)
       * ============================================================================ */}
      <section className="py-20 px-6 lg:px-12 bg-[#FAF8F5] border-b border-neutral-200/80">
        <div className="max-w-7xl mx-auto space-y-10">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs font-bold text-[#0265FF] uppercase tracking-widest bg-blue-50 px-3.5 py-1 rounded-full border border-blue-200">
              16 DEDICATED DOMAIN PRACTICES
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-neutral-900 tracking-tight">
              Specialized Talent Solutions Across <span className="text-[#0265FF]">16 Core Industries</span>
            </h2>
            <p className="text-sm text-neutral-600 max-w-2xl mx-auto">
              Domain-specialized engineering recruitment teams led by tech architects and former engineering practitioners.
            </p>
          </div>

          {/* 6 in a row responsive grid of small cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3.5">
            {[
              { title: 'FinTech & Trading', desc: 'Low-Latency C++ & FPGA', icon: Landmark, href: '/industries/bfsi' },
              { title: 'Generative AI & LLMs', desc: 'vLLM, PyTorch & RAG', icon: Zap, href: '/industries/ai-ml' },
              { title: 'Cloud & DevOps', desc: 'K8s, Multi-Region IaC', icon: Database, href: '/industries/cloud' },
              { title: 'Turnkey GCC Pods', desc: 'BOT Pods in 75 Days', icon: Globe, href: '/industries/gcc' },
              { title: 'Cyber & eBPF', desc: 'Zero-Trust & SOC2', icon: ShieldCheck, href: '/industries/security' },
              { title: 'Data Engineering', desc: 'Kafka, Flink & Snowflake', icon: Layers, href: '/industries/data' },
              { title: 'Enterprise SaaS', desc: 'Microservices & Scaling', icon: Cpu, href: '/industries/technology' },
              { title: 'Healthcare & MedTech', desc: 'HIPAA & FHIR Platforms', icon: HeartPulse, href: '/industries/healthcare' },
              { title: 'Industrial IoT', desc: 'Industry 4.0 & Embedded', icon: Factory, href: '/industries/manufacturing' },
              { title: 'Retail & E-Commerce', desc: 'Checkout & Warehouse ML', icon: ShoppingCart, href: '/industries/retail' },
              { title: 'Automotive & EV', desc: 'AUTOSAR & ADAS Vision', icon: Car, href: '/industries/automotive' },
              { title: 'Telecom & 5G Edge', desc: 'OpenRAN & 5G Core', icon: Radio, href: '/industries/telecom' },
              { title: 'Aerospace & Defense', desc: 'DO-178C Avionics', icon: Plane, href: '/industries/aerospace' },
              { title: 'Energy & CleanTech', desc: 'Smart Grid Telemetry', icon: Sun, href: '/industries/energy' },
              { title: 'Gaming & Streaming', desc: 'Unreal 5 & WebRTC', icon: Gamepad2, href: '/industries/media' },
              { title: 'IT Advisory', desc: 'Digital Transformation', icon: Briefcase, href: '/industries/professional-services' },
            ].map((ind, idx) => {
              const IconComp = ind.icon;
              return (
                <div
                  key={idx}
                  className="bg-white rounded-2xl border border-neutral-200/90 p-4 shadow-sm hover:shadow-lg hover:border-blue-400 hover:-translate-y-1 transition-all duration-200 flex flex-col justify-between group"
                >
                  <div className="space-y-2.5">
                    <div className="w-9 h-9 rounded-xl bg-blue-50 text-[#0265FF] group-hover:bg-[#0265FF] group-hover:text-white flex items-center justify-center transition-colors">
                      <IconComp className="w-4 h-4" />
                    </div>

                    <div>
                      <h4 className="font-bold text-xs text-neutral-900 leading-tight group-hover:text-[#0265FF] transition-colors">
                        {ind.title}
                      </h4>
                      <p className="text-[11px] text-neutral-500 mt-1 leading-snug line-clamp-2">
                        {ind.desc}
                      </p>
                    </div>
                  </div>

                  {/* Simple Effective Call */}
                  <Link
                    to={ind.href}
                    className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] font-bold text-[#0265FF] group-hover:text-[#004FBF] transition-colors"
                  >
                    <span>View Spec</span>
                    <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                  </Link>
                </div>
              );
            })}
          </div>

          {/* Simple Effective Section Call-to-Action Bar */}
          <div className="p-4 sm:p-6 bg-white rounded-2xl border border-neutral-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-50 border border-blue-200 flex items-center justify-center text-[#0265FF] shrink-0">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-neutral-900">Need domain-specific tech talent for your stack?</h4>
                <p className="text-xs text-neutral-500">Get 3 verified candidate dossiers in 72 hours under our 14-day zero-risk trial.</p>
              </div>
            </div>

            <div className="flex items-center gap-2.5 shrink-0">
              <Link
                to="/employers"
                className="px-5 py-2.5 rounded-full bg-[#0265FF] hover:bg-[#004FBF] text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5"
              >
                <span>Hire Talent Now</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <Link
                to="/industries"
                className="px-4 py-2.5 rounded-full bg-slate-100 hover:bg-slate-200 text-neutral-700 font-bold text-xs transition-colors"
              >
                Explore All Practices
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================================
       * 7. FEATURE BLOCK 1: Deterministic Talent Verification In Action
       * ============================================================================ */}
      <section className="py-20 px-6 lg:px-16 bg-white border-b border-neutral-200/80">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 space-y-6">
            <span className="px-3.5 py-1 bg-blue-50 text-[#0265FF] text-xs font-bold rounded-full uppercase tracking-wider border border-blue-200">
              SOLUTION 01
            </span>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-neutral-900 tracking-tight leading-tight">
              Delivering Certainty — <br />
              <span className="text-[#0265FF]">Deterministic Talent Verification In Action</span>
            </h2>
            <p className="text-base text-neutral-600 leading-relaxed font-normal">
              NexaTalent IT Solutions replaces subjective resume screening with empirical code benchmarks. Every candidate is evaluated on live memory allocation efficiency, concurrent stress handling, and system architecture defense.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
                <div className="flex items-center gap-2 font-bold text-sm text-neutral-900">
                  <Clock className="w-4 h-4 text-[#0265FF]" /> Faster Decision
                </div>
                <p className="text-xs text-neutral-500">Real-time data insights to act quickly and respond to changing conditions.</p>
              </div>
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
                <div className="flex items-center gap-2 font-bold text-sm text-neutral-900">
                  <BarChart3 className="w-4 h-4 text-[#0265FF]" /> Sustainable Growth
                </div>
                <p className="text-xs text-neutral-500">Supporting long-term growth while maintaining engineering resilience.</p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 bg-slate-900 text-white p-8 rounded-3xl space-y-6 shadow-2xl relative overflow-hidden">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-4">
              <div className="flex items-center gap-2 text-blue-400 font-mono text-xs font-bold">
                <Activity className="w-4 h-4 animate-pulse" />
                <span>NEXA_VERIFICATION_BENCHMARK_SUITE</span>
              </div>
              <span className="text-xs font-mono text-neutral-400">PASSED 100%</span>
            </div>

            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="p-5 bg-neutral-800/80 rounded-2xl border border-neutral-700">
                <div className="text-3xl font-extrabold text-blue-400">10x</div>
                <div className="text-xs text-neutral-400 mt-1">Faster Match Decisions</div>
              </div>
              <div className="p-5 bg-neutral-800/80 rounded-2xl border border-neutral-700">
                <div className="text-3xl font-extrabold text-blue-400">98.4%</div>
                <div className="text-xs text-neutral-400 mt-1">Code Benchmark Pass</div>
              </div>
            </div>

            <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-2xl text-xs text-blue-300 font-mono">
              ✓ Algorithmic Competency: Top 1% Percentile Verified
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================================
       * 8. FEATURE BLOCK 2: Algorithmic Rigor Backed by Human Empathy
       * ============================================================================ */}
      <section className="py-20 px-6 lg:px-16 bg-slate-50 border-b border-slate-200/80">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 bg-white p-8 rounded-3xl border border-slate-200 shadow-xl space-y-6">
            <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
              <div className="text-xs font-bold text-[#0265FF] uppercase">Human Assessment Panel</div>
              <h4 className="font-bold text-lg text-neutral-900">Expert Technical Panel Safeguards</h4>
              <p className="text-xs text-neutral-600 leading-relaxed font-normal">
                Technology alone cannot gauge teamwork or cultural adaptability. We blend empirical code benchmarks with human panel defenses to ensure engineers thrive in your team.
              </p>
            </div>

            <div className="space-y-2 text-xs text-neutral-600">
              <div className="flex items-center gap-2 font-semibold">
                <CheckCircle2 className="w-4 h-4 text-[#0265FF]" /> Deep Industry Expertise: 18+ years building global tech hubs
              </div>
              <div className="flex items-center gap-2 font-semibold">
                <CheckCircle2 className="w-4 h-4 text-[#0265FF]" /> Consistent Performance Outcomes with zero candidate dropouts
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 space-y-6">
            <span className="px-3.5 py-1 bg-blue-50 text-[#0265FF] text-xs font-bold rounded-full uppercase tracking-wider border border-blue-200">
              SOLUTION 02
            </span>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-neutral-900 tracking-tight leading-tight">
              Unparalleled Experience — <br />
              <span className="text-[#0265FF]">Algorithmic Rigor Backed by Human Empathy</span>
            </h2>
            <p className="text-base text-neutral-600 leading-relaxed font-normal">
              We bring 40 years of combined recruitment expertise delivering strong results, faster value, and measurable ROI across global clients. Automated vetting is paired with dedicated candidate success managers to maintain high morale and commitment.
            </p>
          </div>
        </div>
      </section>

      {/* ============================================================================
       * 9. FEATURE BLOCK 3: How We Maintain 99.4% Engineering Retention
       * ============================================================================ */}
      <section className="py-20 px-6 lg:px-16 bg-white border-b border-neutral-200/80">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 space-y-6">
            <span className="px-3.5 py-1 bg-blue-50 text-[#0265FF] text-xs font-bold rounded-full uppercase tracking-wider border border-blue-200">
              SOLUTION 03
            </span>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-neutral-900 tracking-tight leading-tight">
              Long-Term Success — <br />
              <span className="text-[#0265FF]">How We Maintain 99.4% Engineering Retention</span>
            </h2>
            <p className="text-base text-neutral-600 leading-relaxed font-normal">
              High retention is not luck; it's a structured methodology. From rigorous 14-day trial alignment to ongoing career development and transparent compensation benchmarking, we ensure engineers stay engaged for the long haul.
            </p>

            <div className="space-y-3 pt-2">
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex items-start gap-3">
                <Check className="w-5 h-5 text-[#0265FF] shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-sm text-neutral-900">14-Day Zero-Risk Trial Alignment</h4>
                  <p className="text-xs text-neutral-500">Immediate feedback loop during the first 14 days to resolve technical or workflow friction early.</p>
                </div>
              </div>
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex items-start gap-3">
                <Check className="w-5 h-5 text-[#0265FF] shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-sm text-neutral-900">Continuous Career Pathway & Upskilling</h4>
                  <p className="text-xs text-neutral-500">Engineers receive continuous access to advanced AI, Cloud, and System Design courses.</p>
                </div>
              </div>
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex items-start gap-3">
                <Check className="w-5 h-5 text-[#0265FF] shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-sm text-neutral-900">2-Year Placement Pledge</h4>
                  <p className="text-xs text-neutral-500">We guarantee continuous performance monitoring and replacement backing for 24 months.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 bg-slate-900 text-white p-8 rounded-3xl space-y-6 shadow-2xl text-center">
            <Award className="w-12 h-12 text-blue-400 mx-auto" />
            <h3 className="text-3xl font-extrabold">99.4% 2-Year Retention Record</h3>
            <p className="text-xs text-slate-300 max-w-md mx-auto leading-relaxed font-normal">
              Our holistic human-centric talent management keeps attrition virtually zero across all enterprise offshore pods in Dubai, Riyadh, and Bangalore.
            </p>
            <div className="p-4 bg-blue-600/20 border border-blue-500/40 rounded-2xl text-xs text-blue-300 font-mono font-bold">
              ✓ Verified Across 500+ Engineering Placements
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================================
       * 10. FREQUENTLY ASKED QUESTIONS (CATEGORIZED TABS & EXPANDABLE ACCORDION)
       * ============================================================================ */}
      <section className="py-20 px-6 lg:px-16 bg-white border-b border-neutral-200/80">
        <div className="max-w-4xl mx-auto space-y-10">
          <div className="text-center space-y-3">
            <h2 className="text-3xl sm:text-5xl font-extrabold text-neutral-900 tracking-tight">
              Frequently Asked Questions
            </h2>
            <p className="text-base text-neutral-600">
              Clear answers to common questions about our platform, features, and support.
            </p>

            {/* Categorized Tabs */}
            <div className="flex justify-center gap-2 pt-4">
              {(['General', 'Vetting', 'GCC Hubs', 'Support'] as const).map((cat) => (
                <button
                  key={cat}
                  onClick={() => {
                    setFaqCategory(cat);
                    setActiveFaq(0);
                  }}
                  className={`px-5 py-2 rounded-full text-xs font-bold transition-all ${
                    faqCategory === cat
                      ? 'bg-[#0265FF] text-white shadow-md'
                      : 'bg-slate-100 text-neutral-700 hover:bg-slate-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Accordion Questions List */}
          <div className="space-y-4">
            {faqs[faqCategory].map((faq, idx) => {
              const isOpen = activeFaq === idx;
              return (
                <div
                  key={idx}
                  className="bg-slate-50 border border-slate-200/80 rounded-2xl overflow-hidden transition-all shadow-sm"
                >
                  <button
                    onClick={() => setActiveFaq(isOpen ? null : idx)}
                    className="w-full text-left p-6 flex items-center justify-between font-bold text-base text-neutral-900"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown className={`w-5 h-5 text-neutral-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {isOpen && (
                    <div className="p-6 pt-0 text-sm text-neutral-600 leading-relaxed border-t border-slate-200/60 bg-white">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ============================================================================
       * 11. FINAL HIGH-CONVERSION CTA BANNER (SOLID BRAND BLUE #0265FF)
       * ============================================================================ */}
      <section className="py-20 px-6 lg:px-16 bg-[#0265FF] text-white text-center">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 backdrop-blur border border-white/20 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-white" /> Start Building Your Team
          </div>
          <h2 className="text-4xl sm:text-6xl font-extrabold tracking-tight">
            Ready to Scale Your Technology Organization?
          </h2>
          <p className="text-base sm:text-lg text-blue-100 max-w-2xl mx-auto">
            Get matched with pre-vetted senior candidates within 72 hours under our 14-day zero-risk trial guarantee.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <Link
              to="/employers"
              className="px-8 py-4 bg-white text-[#0265FF] font-bold text-sm rounded-full shadow-2xl hover:bg-slate-100 transition-all flex items-center gap-2"
            >
              Get Matched Candidates Now <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/contact"
              className="px-8 py-4 bg-white/10 border border-white/30 text-white font-bold text-sm rounded-full hover:bg-white/20 transition-all"
            >
              Schedule Founder Consultation
            </Link>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
