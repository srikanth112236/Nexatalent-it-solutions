import { StandardNavbar } from './StandardNavbar';
import { MinimalOutlineFooter } from './MinimalOutlineFooter';
import { FooterFloatingDualTier } from './sample-library';

/**
 * Production site chrome shared by all website pages.
 * Navbar: standardized accessible enterprise navbar with 4 hover menus and logo palette.
 * Above footer: floating dual-tier elevated footer as the CTA band.
 * Footer: minimal outline footer with scroll-revealed watermark.
 */
export const SiteNavbar: React.FC = () => <StandardNavbar />;

export const SiteFooter: React.FC = () => (
  <>
    <div style={{ position: 'relative', zIndex: 998, isolation: 'isolate' }}>
      <FooterFloatingDualTier bare />
    </div>
    <div style={{ position: 'relative', zIndex: 999, isolation: 'isolate' }}>
      <MinimalOutlineFooter />
    </div>
  </>
);
