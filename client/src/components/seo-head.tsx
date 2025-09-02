import { useEffect } from 'react';
import { useLocation } from 'wouter';

interface SEOHeadProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article';
  structuredData?: object;
}

const defaultMeta = {
  title: "KEVIN Stamp Saga - Bitcoin Mysteries, Digital Legends & OG Memes | Ghost in the Machine",
  description: "Discover the legendary KEVIN phenomenon: 104 self-replicating Bitcoin stamps, first SRC-20 token, and the ultimate digital legend. From blockchain mysteries to global memes - experience the ghost in the machine.",
  keywords: "KEVIN, Bitcoin stamps, SRC-20 token, blockchain mysteries, digital legends, OG memes, Bitcoin lore, ghost in the machine, self-replicating stamps, Kevin token, Bitcoin artifacts, digital collectibles, Satoshi mysteries",
  image: "https://kevinstamp.io/kevin-original.png",
  url: "https://kevinstamp.io",
  type: "website" as const
};

const pageMeta = {
  '/': {
    title: "KEVIN Stamp Saga - Bitcoin Mysteries, Digital Legends & OG Memes | Ghost in the Machine",
    description: "Discover the legendary KEVIN phenomenon: 104 self-replicating Bitcoin stamps, first SRC-20 token, and the ultimate digital legend. From blockchain mysteries to global memes - experience the ghost in the machine.",
    keywords: "KEVIN stamps, Bitcoin mysteries, digital legends, OG memes, ghost in the machine, self-replicating stamps, SRC-20 token, blockchain phenomena"
  },
  '/stamps': {
    title: "104 KEVIN Stamps Collection - Self-Replicating Bitcoin Artifacts | KEVIN Saga",
    description: "Explore the complete collection of 104 mysterious KEVIN stamps that self-replicated on the Bitcoin blockchain. From stamp #4258 to #18430 - witness the ghost in the machine phenomenon.",
    keywords: "KEVIN stamps, Bitcoin stamps, stamp collection, self-replicating stamps, stamp #4258, stamp #18430, Bitcoin artifacts, digital collectibles, blockchain stamps"
  },
  '/lore': {
    title: "KEVIN Lore - Origins, Mysteries & Digital Legends | Bitcoin Saga",
    description: "Uncover the epic story of KEVIN: from mysterious self-replicating stamps to the first SRC-20 token. The ultimate Bitcoin legend and ghost in the machine phenomenon.",
    keywords: "KEVIN lore, Bitcoin origins, stamp mysteries, digital legends, ghost in the machine, SRC-20 token, Bitcoin history, blockchain legends"
  },
  '/community': {
    title: "KEVIN Community Gallery - OG Memes & Digital Artifacts | Global KEVIN Movement",
    description: "Explore the wildest KEVIN creations from believers worldwide. OG memes, digital artifacts, and community masterpieces celebrating the ultimate Bitcoin legend.",
    keywords: "KEVIN memes, community gallery, OG memes, digital artifacts, KEVIN art, Bitcoin memes, community creations, KEVIN believers"
  },
  '/token': {
    title: "KEVIN Token - First SRC-20 Token | Bitcoin Blockchain | Live Market Data",
    description: "Track KEVIN, the first SRC-20 token born from mysterious self-replicating stamps. Live market data, holder stats, and trading information for the ultimate Bitcoin meme token.",
    keywords: "KEVIN token, SRC-20 token, Bitcoin token, KEVIN price, token market cap, Bitcoin trading, SRC-20 protocol, meme token",
    image: "https://kevinstamp.io/kevin-token-chart.png",
    type: "article"
  }
};

export default function SEOHead({ title, description, keywords, image, url, type = 'website', structuredData }: SEOHeadProps) {
  const [location] = useLocation();

  useEffect(() => {
    // Get page-specific meta or fallback to defaults
    const currentMeta = pageMeta[location as keyof typeof pageMeta] || defaultMeta;

    // Update document title
    const fullTitle = title || currentMeta.title;
    document.title = fullTitle;

    // Update or create meta tags
    updateMetaTag('name', 'description', description || currentMeta.description);
    updateMetaTag('name', 'keywords', keywords || currentMeta.keywords);

    // Update Open Graph tags
    updateMetaTag('property', 'og:title', fullTitle);
    updateMetaTag('property', 'og:description', description || currentMeta.description);
    updateMetaTag('property', 'og:image', image || (currentMeta as any).image || defaultMeta.image);
    updateMetaTag('property', 'og:url', url || `${defaultMeta.url}${location}`);
    updateMetaTag('property', 'og:type', type);

    // Update Twitter tags
    updateMetaTag('name', 'twitter:title', fullTitle);
    updateMetaTag('name', 'twitter:description', description || currentMeta.description);
    updateMetaTag('name', 'twitter:image', image || (currentMeta as any).image || defaultMeta.image);

    // Update canonical URL
    updateCanonicalUrl(url || `${defaultMeta.url}${location}`);

    // Update structured data if provided
    if (structuredData) {
      updateStructuredData(structuredData);
    }

    // Track page view for SEO analytics
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('config', 'GA_MEASUREMENT_ID', {
        page_title: fullTitle,
        page_location: window.location.href
      });
    }

  }, [title, description, keywords, image, url, type, structuredData, location]);

  return null; // This component doesn't render anything
}

function updateMetaTag(attrName: string, attrValue: string, content: string) {
  let element = document.querySelector(`meta[${attrName}="${attrValue}"]`) as HTMLMetaElement;

  if (element) {
    element.content = content;
  } else {
    element = document.createElement('meta');
    element.setAttribute(attrName, attrValue);
    element.content = content;
    document.head.appendChild(element);
  }
}

function updateCanonicalUrl(url: string) {
  let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;

  if (canonical) {
    canonical.href = url;
  } else {
    canonical = document.createElement('link');
    canonical.rel = 'canonical';
    canonical.href = url;
    document.head.appendChild(canonical);
  }
}

function updateStructuredData(data: object) {
  // Remove existing structured data
  const existingSD = document.querySelector('script[type="application/ld+json"][data-page-specific]');
  if (existingSD) {
    existingSD.remove();
  }

  // Add new structured data
  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.setAttribute('data-page-specific', 'true');
  script.textContent = JSON.stringify(data);
  document.head.appendChild(script);
}

// Export utility functions for programmatic SEO updates
export { pageMeta, defaultMeta };
export type { SEOHeadProps };
