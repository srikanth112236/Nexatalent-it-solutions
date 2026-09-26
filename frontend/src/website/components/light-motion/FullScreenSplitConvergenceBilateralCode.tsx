import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Terminal, GitPullRequest, GitMerge } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export const FullScreenSplitConvergenceBilateralCode: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const leftTerminalRef = useRef<HTMLDivElement>(null);
  const rightTerminalRef = useRef<HTMLDivElement>(null);
  const mergeHubRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: '+=150%',
          pin: true,
          scrub: 1,
        },
      });

      tl.fromTo(
        leftTerminalRef.current,
        { xPercent: -50, opacity: 0.3 },
        { xPercent: 0, opacity: 1, ease: 'power2.out' },
        0
      )
        .fromTo(
          rightTerminalRef.current,
          { xPercent: 50, opacity: 0.3 },
          { xPercent: 0, opacity: 1, ease: 'power2.out' },
          0
        )
        .fromTo(
          mergeHubRef.current,
          { scale: 0, opacity: 0 },
          { scale: 1, opacity: 1, ease: 'back.out(1.5)' },
          0.3
        );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative w-screen min-h-screen bg-slate-100 text-slate-900 overflow-hidden flex items-center justify-center m-0 p-0"
      style={{ width: '100vw', maxWidth: '100vw' }}
    >
      {/* Pattern 19: Left Code Screen */}
      <div
        ref={leftTerminalRef}
        className="w-1/2 min-h-screen p-8 md:p-12 lg:p-16 flex flex-col justify-between bg-white border-r border-slate-300 shadow-xl"
      >
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-blue-600 font-bold mb-4">
            <Terminal className="w-4 h-4" />
            <span>US INFRASTRUCTURE REPO · BRANCH: MASTER</span>
          </div>
          <pre className="text-xs font-mono text-slate-800 bg-slate-50 p-5 rounded-2xl border border-slate-200 leading-relaxed overflow-x-hidden shadow-inner">
            <code>
              {`// Silicon Valley Tier-1 Backplane
impl ClusterOrchestrator {
    pub async fn dispatch_workload(&self) {
        let span = trace_span!("us_primary");
        self.peer_pool.route(Target::IndiaGCC).await;
    }
}`}
            </code>
          </pre>
        </div>
        <div className="text-xs font-mono text-slate-400">
          STAGE: WAITING FOR BILATERAL MERGE
        </div>
      </div>

      {/* Pattern 19: Right Code Screen */}
      <div
        ref={rightTerminalRef}
        className="w-1/2 min-h-screen p-8 md:p-12 lg:p-16 flex flex-col justify-between bg-slate-50 border-l border-slate-300 shadow-xl text-right"
      >
        <div>
          <div className="flex items-center justify-end gap-2 text-xs font-mono text-emerald-600 font-bold mb-4">
            <span>BANGALORE QUANT SQUAD · BRANCH: FEATURE/OPT</span>
            <Terminal className="w-4 h-4" />
          </div>
          <pre className="text-xs font-mono text-slate-800 bg-white p-5 rounded-2xl border border-slate-200 leading-relaxed overflow-x-hidden text-left shadow-inner">
            <code>
              {`// India GCC Optimization Kernel
async fn handle_packet_burst(buf: &[u8]) {
    let zero_copy = bypass_kernel_ring(buf);
    record_telemetry("latency_sub_10us", zero_copy);
    println!("GCC Pod: 0-drop verified");
}`}
            </code>
          </pre>
        </div>
        <div className="text-xs font-mono text-slate-400">
          STAGE: CODE REVIEW APPROVED 100%
        </div>
      </div>

      {/* Center Merge Pipeline Hub */}
      <div
        ref={mergeHubRef}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 p-7 rounded-3xl bg-slate-900 text-white shadow-2xl border-2 border-emerald-500 flex flex-col items-center text-center"
      >
        <GitMerge className="w-8 h-8 text-emerald-400 mb-2" />
        <div className="text-xs font-mono font-bold uppercase text-slate-400">Unified Pipeline</div>
        <div className="text-sm font-black text-white flex items-center gap-1.5 mt-1">
          <GitPullRequest className="w-4 h-4 text-blue-400" />
          <span>PR #4182 Merged to Prod</span>
        </div>
      </div>
    </section>
  );
};
