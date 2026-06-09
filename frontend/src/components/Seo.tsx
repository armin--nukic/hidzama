import { useEffect } from 'react';

type SeoProps = {
  title: string;
  description: string;
  image?: string;
};

function upsertMeta(selector: string, attr: 'name' | 'property', key: string, content: string) {
  let meta = document.querySelector(selector) as HTMLMetaElement | null;
  if (!meta) {
    meta = document.createElement('meta');
    meta.setAttribute(attr, key);
    document.head.appendChild(meta);
  }
  meta.setAttribute('content', content);
}

function upsertCanonical(url: string) {
  let link = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
  if (!link) {
    link = document.createElement('link');
    link.rel = 'canonical';
    document.head.appendChild(link);
  }
  link.href = url;
}

export function Seo({ title, description, image = 'https://sifahidzama.ba/og.svg' }: SeoProps) {
  useEffect(() => {
    const fullTitle = `${title} | Šifa Hidžama Bosna i Hercegovina`;
    const canonical = `https://sifahidzama.ba${window.location.pathname}`;

    document.title = fullTitle;
    upsertCanonical(canonical);
    upsertMeta('meta[name="description"]', 'name', 'description', description);
    upsertMeta('meta[name="keywords"]', 'name', 'keywords', 'hidžama Bosna i Hercegovina, hidzama BiH, Šifa Hidžama, hidžama Visoko, Porječani, akupunktura, cupping therapy Bosnia');
    upsertMeta('meta[property="og:title"]', 'property', 'og:title', fullTitle);
    upsertMeta('meta[property="og:description"]', 'property', 'og:description', description);
    upsertMeta('meta[property="og:url"]', 'property', 'og:url', canonical);
    upsertMeta('meta[property="og:image"]', 'property', 'og:image', image);
    upsertMeta('meta[name="twitter:card"]', 'name', 'twitter:card', 'summary_large_image');
    upsertMeta('meta[name="twitter:title"]', 'name', 'twitter:title', fullTitle);
    upsertMeta('meta[name="twitter:description"]', 'name', 'twitter:description', description);
    upsertMeta('meta[name="twitter:image"]', 'name', 'twitter:image', image);
  }, [title, description, image]);
  return null;
}
