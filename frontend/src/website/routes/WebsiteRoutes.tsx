import { Routes, Route } from 'react-router-dom';
import { WebsiteHeader } from '../components/WebsiteHeader';
import { WebsiteFooter } from '../components/WebsiteFooter';
import { HomePage } from '../pages/HomePage';

function PlaceholderPage({ title, description }: { title: string; description: string }) {
  return (
    <div style={{ padding: '6rem 2rem', maxWidth: '1000px', margin: '0 auto', textAlign: 'center' }}>
      <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '1rem' }}>{title}</h1>
      <p style={{ color: 'var(--color-text-muted, #94a3b8)', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto' }}>
        {description}
      </p>
    </div>
  );
}

export function WebsiteRoutes() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <WebsiteHeader />
      <main style={{ flex: 1 }}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<PlaceholderPage title="About NexaTalent" description="Pioneering technology-enabled recruitment and global talent advisory." />} />
          <Route path="/solutions" element={<PlaceholderPage title="Hiring Solutions" description="Custom permanent recruitment, contract staffing, RPO, and executive search." />} />
          <Route path="/industries" element={<PlaceholderPage title="Industries We Power" description="Technology, BFSI, Healthcare, GCC Hubs, and Enterprise Scale." />} />
          <Route path="/jobs" element={<PlaceholderPage title="Job Discovery" description="Browse verified senior roles and engineering mandates." />} />
          <Route path="/employers" element={<PlaceholderPage title="Hire Talent" description="Build and scale teams with verified specialists." />} />
          <Route path="/candidates" element={<PlaceholderPage title="Candidate Career Services" description="Career advancement, interview coaching, and private mandates." />} />
          <Route path="/case-studies" element={<PlaceholderPage title="Client Case Studies" description="How global leaders build engineering teams with NexaTalent." />} />
        </Routes>
      </main>
      <WebsiteFooter />
    </div>
  );
}
