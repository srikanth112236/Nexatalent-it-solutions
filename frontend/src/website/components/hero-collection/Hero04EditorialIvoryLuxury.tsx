import React from 'react';
import { ArrowUpRight, Award, Star, UserCheck } from 'lucide-react';
import { Logo } from '../Logo';

export const Hero04EditorialIvoryLuxury: React.FC = () => {
  const handleContactClick = () => {
    window.location.href = '/contact?inquiry=candidate#contact-form';
  };

  return (
    <div className="relative min-h-[92vh] bg-[#fbf9f6] text-stone-900 overflow-hidden flex items-center justify-center border-y border-stone-200">
      
      {/* Editorial Stamp Watermark */}
      <div className="absolute top-12 left-8 md:left-16 text-[11px] font-serif tracking-widest text-stone-400 uppercase">
        Vol. IV · NexaTalent IT Solutions Candidates Network & Career Gateway
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 py-20 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        
        {/* Left Editorial Narrative */}
        <div className="lg:col-span-7 space-y-6">
          <div className="inline-flex items-center gap-2 text-xs font-serif italic text-amber-800 tracking-wide border-b border-amber-300 pb-1">
            <Award className="w-3.5 h-3.5 text-amber-700" />
            <span>NexaTalent IT Solutions Candidates • 100% Zero Candidate Fee</span>
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-7xl font-serif tracking-tight leading-[1.05] text-stone-950 font-normal">
            Precision Tech Careers with <br />
            <span className="italic font-serif font-light text-amber-900">
              NexaTalent IT Solutions.
            </span>
          </h1>

          <p className="text-base sm:text-lg text-stone-600 font-serif leading-relaxed max-w-lg">
            NexaTalent IT Solutions connects elite software engineers, architects, and tech leaders directly with Fortune 500 tech teams, GCC engineering pods, and high-growth SaaS enterprises.
          </p>

          <div className="pt-4 flex flex-wrap items-center gap-6">
            <button 
              type="button"
              onClick={handleContactClick}
              className="px-7 py-3.5 rounded-full bg-stone-950 hover:bg-amber-950 text-white text-xs sm:text-sm font-serif tracking-wider transition-all flex items-center gap-2 cursor-pointer shadow-md"
            >
              <span>Contact Us & Submit Profile</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>
            <div className="text-xs font-serif text-stone-500 italic">
              Direct routing to candidate advisory desk
            </div>
          </div>

          {/* Prestige Proof Badges */}
          <div className="pt-8 border-t border-stone-200 grid grid-cols-3 gap-6 text-stone-800">
            <div>
              <div className="text-2xl font-serif font-normal text-stone-950">15,000+</div>
              <div className="text-[11px] font-sans text-stone-500 uppercase tracking-wider mt-0.5">Placed Engineers</div>
            </div>
            <div>
              <div className="text-2xl font-serif font-normal text-stone-950">98.4%</div>
              <div className="text-[11px] font-sans text-stone-500 uppercase tracking-wider mt-0.5">Candidate Satisfaction</div>
            </div>
            <div>
              <div className="text-2xl font-serif font-normal text-stone-950">100%</div>
              <div className="text-[11px] font-sans text-stone-500 uppercase tracking-wider mt-0.5">Confidential Stealth Mode</div>
            </div>
          </div>
        </div>

        {/* Right Luxury Asymmetric Imagery with Centered NexaTalent Logo */}
        <div className="lg:col-span-5 relative pt-4">
          
          {/* Floating Gold Privilege Seal - Top of Card */}
          <div className="absolute -top-4 -right-2 sm:-right-6 bg-amber-50/95 backdrop-blur-md border border-amber-200/90 p-3.5 px-4 rounded-2xl shadow-xl max-w-[220px] z-30">
            <div className="flex items-center gap-1.5 text-amber-800 text-xs font-serif font-bold mb-1">
              <Star className="w-4 h-4 fill-amber-500 text-amber-500 shrink-0" />
              <span>NexaTalent Privilege</span>
            </div>
            <p className="text-[11px] text-amber-950/90 font-serif leading-tight font-medium">
              Verified ₹30L–₹80L+ engineering mandates across India & Global GCCs.
            </p>
          </div>

          <div className="relative mx-auto max-w-sm rounded-3xl overflow-hidden shadow-2xl border-8 border-white bg-white group z-10">
            
            {/* Centered NexaTalent Logo Area (No person photo) */}
            <div className="w-full h-80 bg-gradient-to-b from-stone-50 via-amber-50/40 to-stone-100 flex flex-col items-center justify-center p-8 relative overflow-hidden border-b border-stone-100">
              {/* Subtle Decorative Ambient Glow */}
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-amber-200/40 via-transparent to-transparent pointer-events-none" />

              <div className="relative z-10 bg-white/95 backdrop-blur-md p-6 px-8 rounded-3xl shadow-xl border border-amber-100 flex flex-col items-center justify-center text-center space-y-3 max-w-[280px]">
                <Logo height={54} />
                <div className="text-[10px] font-mono tracking-widest text-amber-900/80 font-bold uppercase pt-2 border-t border-amber-100 w-full">
                  CAREERS & GCC MANDATES
                </div>
              </div>
            </div>
            
            {/* Catchy & Relevant NexaTalent Candidate Details Box */}
            <div className="p-5 bg-white space-y-1.5">
              <div className="text-[11px] font-mono uppercase tracking-wider text-amber-800 font-bold flex items-center gap-1.5">
                <UserCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>NEXATALENT CAREER ACCELERATOR</span>
              </div>
              <div className="text-base font-serif font-bold text-stone-900 leading-snug">
                Top 1% Senior Tech & Leadership Mandates
              </div>
              <div className="text-xs text-stone-600 font-serif leading-relaxed">
                Connect directly with Fortune 500 tech hubs & GCC engineering teams with 100% zero candidate fee.
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
