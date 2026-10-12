import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const API_BASE =
  (typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_API_BASE_URL) ||
  'http://localhost:5000';

interface PublicJob {
  id: string;
  title: string;
  companyName?: string;
  location?: string;
  employmentType?: string;
  experienceMin?: number;
  experienceMax?: number;
  salaryMin?: number;
  salaryMax?: number;
  currency?: string;
  requiredSkills?: string;
}

/**
 * Phase 7: live eligible openings (published, non-expired, public allowlist).
 * Compact table on desktop, cards on mobile. Never invents listings.
 */
export const LiveOpenings: React.FC = () => {
  const [rows, setRows] = useState<PublicJob[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [q, setQ] = useState('');
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);
  const pageSize = 8;

  useEffect(() => {
    let live = true;
    setLoading(true);
    setFailed(false);
    const params = new URLSearchParams({ page: String(page), pageSize: String(pageSize) });
    if (query.trim()) params.set('q', query.trim());
    fetch(`${API_BASE}/api/v1/jobs-public?${params.toString()}`)
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(`HTTP ${r.status}`))))
      .then((body) => {
        if (!live) return;
        setRows(Array.isArray(body?.data) ? body.data : []);
        setTotal(Number(body?.pagination?.total ?? body?.data?.length ?? 0));
      })
      .catch(() => {
        if (live) setFailed(true);
      })
      .finally(() => {
        if (live) setLoading(false);
      });
    return () => {
      live = false;
    };
  }, [page, query]);

  const pages = Math.max(1, Math.ceil(total / pageSize));

  return (
    <section style={{ backgroundColor: '#fff', borderBottom: '1px solid #e2e8f0', padding: '4rem 2rem' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 800, letterSpacing: '0.08em', color: '#2563eb' }}>
            LIVE OPENINGS
          </span>
          <h2 style={{ fontSize: 'clamp(1.5rem, 3vw, 2.25rem)', fontWeight: 900, color: '#0f172a', margin: '0.5rem 0' }}>
            Open roles hiring now
          </h2>
          <p style={{ fontSize: '0.875rem', color: '#64748b' }}>
            {total > 0 ? `${total} verified opening${total === 1 ? '' : 's'}` : 'Verified openings from hiring companies'}
          </p>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            setPage(1);
            setQuery(q);
          }}
          style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}
        >
          <label htmlFor="live-openings-search" style={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden', clip: 'rect(0 0 0 0)' }}>
            Search openings by title, skill, or location
          </label>
          <input
            id="live-openings-search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search title, skill, location…"
            aria-label="Search openings"
            style={{ flex: 1, minWidth: '220px', padding: '0.7rem 1rem', borderRadius: '0.75rem', border: '1px solid #e2e8f0', fontSize: '0.875rem' }}
          />
          <button
            type="submit"
            style={{ padding: '0.7rem 1.5rem', borderRadius: '0.75rem', backgroundColor: '#2563eb', color: '#fff', fontWeight: 800, fontSize: '0.875rem', border: 'none', cursor: 'pointer' }}
          >
            Search
          </button>
        </form>

        {loading ? (
          <div role="status" style={{ textAlign: 'center', color: '#64748b', fontSize: '0.875rem', padding: '2rem' }}>Loading openings…</div>
        ) : failed ? (
          <div role="alert" style={{ textAlign: 'center', color: '#64748b', fontSize: '0.875rem', padding: '2rem', backgroundColor: '#f8fafc', borderRadius: '1rem' }}>
            Could not reach the jobs service right now. Please try again shortly.
            <div style={{ marginTop: '0.75rem' }}>
              <button type="button" onClick={() => window.location.reload()} style={{ padding: '0.6rem 1.25rem', borderRadius: '0.75rem', backgroundColor: '#2563eb', color: '#fff', fontWeight: 800, fontSize: '0.8rem', border: 'none', cursor: 'pointer' }}>
                Try again
              </button>
            </div>
          </div>
        ) : rows.length === 0 ? (
          <div style={{ textAlign: 'center', color: '#64748b', fontSize: '0.875rem', padding: '2rem', backgroundColor: '#f8fafc', borderRadius: '1rem' }}>
            No openings match right now. Adjust your search or check back soon.
          </div>
        ) : (
          <>
            <div style={{ display: 'grid', gap: '0.75rem' }}>
              {rows.map((j) => (
                <div
                  key={j.id}
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap', padding: '1rem 1.25rem', border: '1px solid #e2e8f0', borderRadius: '1rem', backgroundColor: '#fff' }}
                >
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontWeight: 800, color: '#0f172a', fontSize: '0.95rem' }}>{j.title}</div>
                    <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '0.25rem' }}>
                      {[j.companyName, j.location, j.employmentType].filter(Boolean).join(' • ')}
                      {j.experienceMin != null && ` • ${j.experienceMin}–${j.experienceMax ?? '+'} yrs`}
                    </div>
                    {j.requiredSkills && (
                      <div style={{ fontSize: '0.75rem', color: '#475569', marginTop: '0.25rem' }}>{j.requiredSkills}</div>
                    )}
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexShrink: 0 }}>
                    {j.salaryMin ? (
                      <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#0f172a' }}>
                        ₹{Number(j.salaryMin).toLocaleString('en-IN')}
                        {j.salaryMax ? `–₹${Number(j.salaryMax).toLocaleString('en-IN')}` : ''}
                      </span>
                    ) : null}
                    <Link
                      to={`/candidate/jobs/${encodeURIComponent(j.id)}`}
                      style={{ padding: '0.6rem 1.25rem', borderRadius: '0.75rem', backgroundColor: '#0f172a', color: '#fff', fontWeight: 800, fontSize: '0.8rem', textDecoration: 'none' }}
                    >
                      View & Apply
                    </Link>
                  </div>
                </div>
              ))}
            </div>
            {pages > 1 && (
              <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginTop: '1.25rem', alignItems: 'center' }}>
                <button type="button" disabled={page <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))} style={{ padding: '0.5rem 1rem', borderRadius: '0.5rem', border: '1px solid #e2e8f0', backgroundColor: '#fff', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 700 }}>
                  ← Prev
                </button>
                <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Page {page} of {pages}</span>
                <button type="button" disabled={page >= pages} onClick={() => setPage((p) => Math.min(pages, p + 1))} style={{ padding: '0.5rem 1rem', borderRadius: '0.5rem', border: '1px solid #e2e8f0', backgroundColor: '#fff', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 700 }}>
                  Next →
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
};
