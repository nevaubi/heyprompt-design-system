import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article';
}

export function SEO({ 
  title = 'HeyPrompt - Discover & Share AI Prompts',
  description = 'The largest community-driven library of AI prompts. Discover, save, and share prompts for ChatGPT, Claude, and more.',
  keywords = 'AI prompts, ChatGPT prompts, Claude prompts, AI tools, prompt engineering',
  image = '/og-image.png',
  type = 'website'
}: SEOProps) {
  const location = useLocation();
  const url = `${window.location.origin}${location.pathname}`;

  useEffect(() => {
    // Update document title
    document.title = title;

    // Update meta tags
    updateMetaTag('description', description);
    updateMetaTag('keywords', keywords);
    
    // Open Graph tags
    updateMetaTag('og:title', title, 'property');
    updateMetaTag('og:description', description, 'property');
    updateMetaTag('og:image', image, 'property');
    updateMetaTag('og:url', url, 'property');
    updateMetaTag('og:type', type, 'property');
    updateMetaTag('og:site_name', 'HeyPrompt', 'property');
    
    // Twitter Card tags
    updateMetaTag('twitter:card', 'summary_large_image', 'name');
    updateMetaTag('twitter:title', title, 'name');
    updateMetaTag('twitter:description', description, 'name');
    updateMetaTag('twitter:image', image, 'name');
    
    // Additional SEO tags
    updateMetaTag('robots', 'index, follow');
    updateMetaTag('author', 'HeyPrompt');
    updateMetaTag('viewport', 'width=device-width, initial-scale=1.0');
    
    // Canonical URL
    updateLinkTag('canonical', url);
  }, [title, description, keywords, image, url, type]);

  return null;
}

function updateMetaTag(name: string, content: string, attribute: 'name' | 'property' = 'name') {
  let element = document.querySelector(`meta[${attribute}="${name}"]`) as HTMLMetaElement;
  
  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attribute, name);
    document.head.appendChild(element);
  }
  
  element.content = content;
}

function updateLinkTag(rel: string, href: string) {
  let element = document.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement;
  
  if (!element) {
    element = document.createElement('link');
    element.rel = rel;
    document.head.appendChild(element);
  }
  
  element.href = href;
}

// Structured data for prompts
export function generatePromptStructuredData(prompt: {
  id: string;
  title: string;
  description: string;
  author: { username: string };
  rating: number;
  totalRatings: number;
  createdAt: string;
}) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    "name": prompt.title,
    "description": prompt.description,
    "author": {
      "@type": "Person",
      "name": prompt.author.username
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": prompt.rating,
      "ratingCount": prompt.totalRatings,
      "bestRating": 5,
      "worstRating": 1
    },
    "dateCreated": prompt.createdAt,
    "url": `${window.location.origin}/prompts/${prompt.id}`,
    "genre": "AI Prompt",
    "inLanguage": "en"
  };

  // Add or update structured data script
  let script = document.querySelector('script[type="application/ld+json"]') as HTMLScriptElement;
  if (!script) {
    script = document.createElement('script');
    script.type = 'application/ld+json';
    document.head.appendChild(script);
  }
  
  script.textContent = JSON.stringify(structuredData);
}