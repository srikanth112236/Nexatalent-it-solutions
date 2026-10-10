import { useEffect, useRef, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiClient } from '../../shared/api-client';
import { clearSession, getAccessToken, getTenantId, getUserEmail } from '../../shared/auth/session';

interface InactivityGuardProps {
  timeoutMs?: number; // default: 15 minutes (900,000 ms)
  children: ReactNode;
}

const CHANNEL = 'nexatalent:activity';

export function InactivityGuard({ timeoutMs = 15 * 60 * 1000, children }: InactivityGuardProps) {
  const navigate = useNavigate();
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastFireRef = useRef(0);

  useEffect(() => {
    let bc: BroadcastChannel | null = null;
    try {
      bc = typeof BroadcastChannel !== 'undefined' ? new BroadcastChannel(CHANNEL) : null;
    } catch {
      bc = null;
    }

    const doLogout = async () => {
      const userEmail = getUserEmail();
      const tenantId = getTenantId();
      try {
        if (getAccessToken()) {
          await apiClient.post('/api/v1/auth/logout', {
            ...(userEmail ? { email: userEmail } : {}),
            ...(tenantId ? { tenantId } : {}),
            reason: 'INACTIVITY_TIMEOUT',
          });
        }
      } catch {
        // best-effort server notify; local session is always cleared
      } finally {
        clearSession();
        navigate('/login?reason=inactivity', { replace: true });
      }
    };

    const arm = () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (!getAccessToken()) return;
      timerRef.current = setTimeout(doLogout, timeoutMs);
    };

    const handleActivity = () => {
      // Throttle re-arming to avoid timer churn on mousemove/scroll
      const now = Date.now();
      if (now - lastFireRef.current < 1000) return;
      lastFireRef.current = now;
      arm();
      try {
        bc?.postMessage({ type: 'activity', at: now });
      } catch {
        /* noop */
      }
    };

    const onBcMessage = () => arm();
    bc?.addEventListener('message', onBcMessage);

    const onVisibility = () => {
      if (document.visibilityState === 'visible') arm();
    };

    const events = ['mousemove', 'mousedown', 'keydown', 'scroll', 'touchstart'];
    events.forEach((evt) => window.addEventListener(evt, handleActivity, { passive: true }));
    document.addEventListener('visibilitychange', onVisibility);
    arm();

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      events.forEach((evt) => window.removeEventListener(evt, handleActivity));
      document.removeEventListener('visibilitychange', onVisibility);
      bc?.removeEventListener('message', onBcMessage);
      bc?.close();
    };
  }, [navigate, timeoutMs]);

  return <>{children}</>;
}
