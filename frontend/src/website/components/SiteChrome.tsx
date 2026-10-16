import { V2Navbar } from '../v2/components/V2Navbar';
import { V2Footer } from '../v2/components/V2Footer';

/**
 * Production site chrome shared by all website pages.
 * Single source of truth: floating-pill V2Navbar (About / Solutions /
 * Industries / Jobs / Careers / Insights / For Employers + For Candidates
 * + Contact us) and pure-white V2Footer. Every public route — including
 * detail pages (/solutions/:slug, /industries/:slug, /jobs/:slug,
 * /insights/:slug, /careers/:slug, /case-studies/:slug) — renders this
 * chrome so header/footer are identical everywhere.
 * White background + black text only. No blue / green.
 */
export const SiteNavbar: React.FC = () => <V2Navbar />;

export const SiteFooter: React.FC = () => <V2Footer />;
