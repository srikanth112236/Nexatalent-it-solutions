import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

interface SeoHeadProps {
  title: string;
  description: string;
  keywords?: string;
  canonicalPath?: string;
  canonical?: string;
  ogType?: 'website' | 'article' | 'profile';
  ogImage?: string;
  structuredData?: Record<string, any>;
  schemaJson?: Record<string, any>;
}

const DEFAULT_KEYWORDS = 
  'IT Recruitment India, IT Staffing, AI Recruitment Platform, Hire IT Talent, Tech Recruitment Bengaluru, GCC Turnkey Pods, Lateral Engineering Hiring, Executive Search Tech, NexaTalent IT Solutions';

export function SeoHead({
  title,
  description,
  keywords = DEFAULT_KEYWORDS,
  canonicalPath,
  canonical,
  ogType = 'website',
  ogImage = 'https://nexatalent.com/logo.png',
  structuredData,
  schemaJson,
}: SeoHeadProps) {
  const location = useLocation();
  const targetPath = canonical || canonicalPath || location.pathname;
  const canonicalUrl = `https://nexatalent.com${targetPath === '/' ? '' : targetPath}`;
  const fullTitle = title.includes('NexaTalent IT Solutions') ? title : `${title} | NexaTalent IT Solutions`;
  const finalSchema = schemaJson || structuredData;

  useEffect(() => {
    // 1. Update Document Title
    document.title = fullTitle;

    // Helper to create or update meta tags
    const setMeta = (nameAttr: 'name' | 'property', attrValue: string, content: string) => {
      let element = document.querySelector(`meta[${nameAttr}="${attrValue}"]`) as HTMLMetaElement | null;
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(nameAttr, attrValue);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    // 2. Primary Meta Tags
    setMeta('name', 'description', description);
    setMeta('name', 'keywords', keywords);
    setMeta('name', 'robots', 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1');
    setMeta('name', 'author', 'NexaTalent IT Solutions Pvt. Ltd.');

    // 3. Open Graph Tags
    setMeta('property', 'og:title', fullTitle);
    setMeta('property', 'og:description', description);
    setMeta('property', 'og:url', canonicalUrl);
    setMeta('property', 'og:type', ogType);
    setMeta('property', 'og:site_name', 'NexaTalent IT Solutions');
    setMeta('property', 'og:image', ogImage);

    // 4. Twitter Card Tags
    setMeta('name', 'twitter:card', 'summary_large_image');
    setMeta('name', 'twitter:title', fullTitle);
    setMeta('name', 'twitter:description', description);
    setMeta('name', 'twitter:image', ogImage);

    // 5. Canonical Link
    let canonicalLink = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute('href', canonicalUrl);

    // 6. JSON-LD Structured Data Injection
    let scriptTag = document.querySelector('#nexa-structured-data') as HTMLScriptElement | null;
    if (finalSchema) {
      if (!scriptTag) {
        scriptTag = document.createElement('script');
        scriptTag.id = 'nexa-structured-data';
        scriptTag.type = 'application/ld+json';
        document.head.appendChild(scriptTag);
      }
      scriptTag.textContent = JSON.stringify(finalSchema);
    } else if (scriptTag) {
      scriptTag.remove();
    }
  }, [fullTitle, description, keywords, canonicalUrl, ogType, ogImage, finalSchema]);

  return null;
}
