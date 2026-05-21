import React from 'react';
import { Link } from 'react-router-dom';
import PageSeo from './PageSeo';
import SeoContentSection from './SeoContentSection';
import FaqSection from './FaqSection';

const SITE_URL = 'https://travelwithanki.com';
const APP_URL = `${SITE_URL}/image-toolkit/`;

const DEFAULT_RELATED_TOOLS = [
  { path: '/jpg-to-png/', label: 'JPG to PNG' },
  { path: '/png-to-jpg/', label: 'PNG to JPG' },
  { path: '/image-compressor/', label: 'Image Compressor' },
  { path: '/image-resizer/', label: 'Image Resizer' },
  { path: '/image-cropper/', label: 'Image Cropper' },
  { path: '/webp-converter/', label: 'WebP Converter' },
  { path: '/watermark-image/', label: 'Watermark Image' },
];

function normalizeCanonical(pathname) {
  if (!pathname || pathname === '/') return APP_URL;
  const cleanPath = pathname.endsWith('/') ? pathname : `${pathname}/`;
  return `${SITE_URL}${cleanPath}`;
}

function getCurrentCanonical() {
  if (typeof window === 'undefined') return APP_URL;
  return normalizeCanonical(window.location.pathname);
}

function createWebApplicationSchema({ title, description, canonical }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: title,
    url: canonical,
    description,
    applicationCategory: 'MultimediaApplication',
    operatingSystem: 'All',
    browserRequirements: 'Requires JavaScript enabled',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
  };
}

function createFaqSchema(faqItems) {
  if (!faqItems?.length) return null;
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqItems.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };
}

function ToolPageShell({
  title,
  seoTitle,
  description,
  canonical,
  intro,
  seoContent,
  faqItems = [],
  relatedTools = DEFAULT_RELATED_TOOLS,
  children,
}) {
  const pageCanonical = canonical || getCurrentCanonical();
  const schemas = [
    createWebApplicationSchema({ title, description, canonical: pageCanonical }),
    createFaqSchema(faqItems),
  ];

  return (
    <>
      <PageSeo title={seoTitle || `${title} | ImageToolkit`} description={description} canonical={pageCanonical} schema={schemas} />
      <section className="hero hero-compact">
        <div className="container">
          <p className="eyebrow">ImageToolkit</p>
          <h1>{title}</h1>
          <p className="hero-copy">{intro || description}</p>
        </div>
      </section>
      <section className="container tool-layout">{children}</section>
      <section className="container content-stack">
        <SeoContentSection {...seoContent} title={`${title} Guide`} />
        <FaqSection items={faqItems} />
        <section className="panel related-panel">
          <h2>Related tools</h2>
          <div className="related-links">
            {relatedTools.map((tool) => (
              <Link key={tool.path} className="related-link" to={tool.path}>
                {tool.label}
              </Link>
            ))}
          </div>
        </section>
      </section>
    </>
  );
}

export default ToolPageShell;
