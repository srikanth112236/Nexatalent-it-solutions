/* ============================================================================
   NexaTalent — AuthLayout
   Split-screen auth shell: light background, 40px rounded corners on the whole
   card, black text + black action buttons. Reuse for login / register / forgot.
   ============================================================================ */
import type { ReactNode } from 'react';
import { Logo } from '../../website/components/Logo';

export interface AuthLayoutProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
  footer?: ReactNode;
}

export function AuthLayout({ title, subtitle, children, footer }: AuthLayoutProps) {
  return (
    <div className="min-h-screen w-full bg-[#F5F7FA] flex items-center justify-center p-4 sm:p-6 lg:p-10 font-sans">
      <div
        className="relative w-full max-w-5xl overflow-hidden bg-white shadow-2xl shadow-slate-300/40"
        style={{ borderRadius: '40px', border: '1px solid #e2e8f0' }}
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[640px]">
          {/* Left — brand panel (light) */}
          <div className="hidden lg:flex flex-col justify-between p-10 bg-[#F8FAFC] border-r border-slate-200">
            <div>
              <div className="inline-block bg-white p-2.5 rounded-2xl shadow-sm border border-slate-200">
                <Logo height={34} />
              </div>
              <h2 className="mt-8 text-3xl font-extrabold text-slate-900 tracking-tight leading-tight">
                Hire. Place. Grow.
              </h2>
              <p className="mt-3 text-sm text-slate-600 font-medium leading-relaxed max-w-sm">
                NexaTalent connects companies, recruitment agencies and candidates on one
                verified platform — with compliance, billing and onboarding built in.
              </p>
            </div>
            <div className="text-xs text-slate-500 font-medium">
              © NexaTalent · Secure sign-in
            </div>
          </div>

          {/* Right — form panel */}
          <div className="p-8 sm:p-10 lg:p-12 flex flex-col justify-center">
            <div className="lg:hidden mb-6">
              <Logo height={30} />
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">{title}</h1>
            {subtitle && <p className="text-slate-600 text-sm mt-1">{subtitle}</p>}
            <div className="mt-6">{children}</div>
            {footer && <div className="mt-6 pt-4 border-t border-slate-200">{footer}</div>}
          </div>
        </div>
      </div>
    </div>
  );
}
