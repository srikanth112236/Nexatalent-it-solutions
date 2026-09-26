import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Terminal, Cloud, Layers, CheckCircle2 } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export const FullScreenSplitConvergenceBilateralTerminal: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const leftTerminalRef = useRef<HTMLDivElement>(null);
  const rightTerminalRef = useRef<HTMLDivElement>(null);
  const consoleBadgeRef = useRef<HTMLDivElement>(null);

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
        { xPercent: -50 },
        { xPercent: 0, ease: 'power2.out' },
        0
      )
        .fromTo(
          rightTerminalRef.current,
          { xPercent: 50 },
          { xPercent: 0, ease: 'power2.out' },
          0
        )
        .fromTo(
          consoleBadgeRef.current,
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
      className="relative w-screen min-h-screen bg-slate-100 text-slate-900 overflow-hidden flex items-stretch m-0 p-0"
      style={{ width: '100vw', maxWidth: '100vw' }}
    >
      {/* Pattern 19: Left AWS Terraform Pane */}
      <div
        ref={leftTerminalRef}
        className="w-1/2 min-h-screen p-8 md:p-12 lg:p-16 flex flex-col justify-between bg-white border-r border-slate-300 shadow-xl"
      >
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-blue-700 font-bold mb-4">
            <Cloud className="w-4 h-4 text-blue-600" />
            <span>US CLOUD CORE · TERRAFORM MULTI-REGION SPEC</span>
          </div>
          <h2 className="text-section-title font-black text-slate-900 tracking-tight mb-4">
            Global VPC Infrastructure
          </h2>
          <pre className="text-xs font-mono text-slate-800 bg-slate-50 p-5 rounded-2xl border border-slate-200 leading-relaxed overflow-x-hidden shadow-inner mb-6">
            <code>
              {`module "global_transit_gateway" {
  source  = "nexatalent/tgw/aws"
  peering = ["us-east-1", "ap-south-1"]
  enclaves = {
    hardware_isolation = true
    fips_crypto         = "strict"
  }
}`}
            </code>
          </pre>
        </div>
        <div className="text-xs font-mono text-slate-400">
          TERRAFORM CLUSTER: PROVISIONED & VERIFIED
        </div>
      </div>

      {/* Pattern 19: Right Kubernetes Cluster Pane */}
      <div
        ref={rightTerminalRef}
        className="w-1/2 min-h-screen p-8 md:p-12 lg:p-16 flex flex-col justify-between bg-slate-50 border-l border-slate-300 shadow-xl text-right"
      >
        <div>
          <div className="flex items-center justify-end gap-2 text-xs font-mono text-emerald-700 font-bold mb-4">
            <span>INDIA GCC K8S INGRESS · ORCHESTRATION</span>
            <Layers className="w-4 h-4 text-emerald-600" />
          </div>
          <h2 className="text-section-title font-black text-slate-900 tracking-tight mb-4">
            Autonomous Pod Deployment
          </h2>
          <pre className="text-xs font-mono text-slate-800 bg-white p-5 rounded-2xl border border-slate-200 leading-relaxed overflow-x-hidden text-left shadow-inner mb-6">
            <code>
              {`apiVersion: apps/v1
kind: Deployment
metadata:
  name: gcc-quant-engine-pod
spec:
  replicas: 64
  strategy: ZeroDowntimeCanary
  resources: { cpu: "32", mem: "128Gi" }`}
            </code>
          </pre>
        </div>
        <div className="text-xs font-mono text-slate-400">
          KUBERNETES STATUS: 64/64 PODS HEALTHY
        </div>
      </div>

      {/* Center Unified Multi-Cloud Stamp */}
      <div
        ref={consoleBadgeRef}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 p-7 rounded-3xl bg-slate-900 text-white shadow-2xl border border-slate-700 flex flex-col items-center text-center"
      >
        <Terminal className="w-8 h-8 text-blue-400 mb-2" />
        <div className="text-xs font-mono font-bold text-slate-400 uppercase">Pattern 19 Unified</div>
        <div className="text-sm font-black text-white flex items-center gap-1.5 mt-1">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>Multi-Cloud Sync: Active</span>
        </div>
      </div>
    </section>
  );
};
