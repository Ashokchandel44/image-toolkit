
import React from 'react';
import ToolCard from '../components/ToolCard';
import PageSeo from '../components/PageSeo';
import SeoContentSection from '../components/SeoContentSection';
import FaqSection from '../components/FaqSection';
import { TOOL_CARDS } from '../utils/constants';

const title = 'Free Image Toolkit Online | Compress, Resize & Convert Images';
const description = 'Use this free online Image Toolkit to compress, resize, crop, convert, watermark, and export images directly in your browser. No upload required.';
const canonical = 'https://travelwithanki.com/image-toolkit/';
const faqItems = [
  { question: 'Does ImageToolkit upload my images?', answer: 'No. The tools process images directly in your browser, so your files do not need to be uploaded to a server.' },
  { question: 'What can I do with this free Image Toolkit?', answer: 'You can compress, resize, crop, convert, watermark, adjust, inspect metadata, and export images from one browser-based toolkit.' },
  { question: 'Can I use ImageToolkit on mobile?', answer: 'Yes. The app is responsive and works on modern mobile and desktop browsers with JavaScript enabled.' },
];
const schemas = [
  {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'Free Image Toolkit Online',
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
  },
  {
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
  },
];

function HomePage() {
  return (
    <>
      <PageSeo
        title={title}
        description={description}
        canonical={canonical}
        schema={schemas}
      />
      <section className="hero">
        <div className="container hero-grid">
          <div>
            <p className="eyebrow">Frontend-only image editor</p>
            <h1>Free Image Toolkit Online</h1>
            <p className="hero-copy">
              Compress, resize, crop, convert, watermark, inspect metadata, and export images directly in your browser.
            </p>
          </div>
          <div className="hero-panel">
            <p>Simple, secure, and hosting-friendly</p>
            <ul>
              <li>Runs entirely in your browser</li>
              <li>No backend server required</li>
              <li>Works on shared hosting and subfolders</li>
            </ul>
          </div>
        </div>
      </section>
      <section className="container">
        <div className="section-heading">
          <h2>Tools ashok</h2>
          <p>Choose a tool and process your images directly on-device.</p>
        </div>
        <div className="tool-grid">
          {TOOL_CARDS.map((tool) => (
            <ToolCard key={tool.path} {...tool} />
          ))}
        </div>
      </section>
      <section className="container content-stack">
        <SeoContentSection
          title="Why use ImageToolkit"
          whatItDoes="ImageToolkit combines common image editing and export tasks into one browser-based React app that can be uploaded to normal shared hosting."
          howToUse="Open a tool, upload an image, adjust the tool settings, preview the result, and download the processed output."
          whyUseful="Because processing happens client-side, hosting stays simple, privacy is improved, and the final app can run without Node.js or an API server in production."
        />
        <FaqSection
          items={faqItems}
        />
      </section>
    </>
  );
}

export default HomePage;
