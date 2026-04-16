
import React from 'react';
import ToolCard from '../components/ToolCard';
import PageSeo from '../components/PageSeo';
import SeoContentSection from '../components/SeoContentSection';
import FaqSection from '../components/FaqSection';
import { TOOL_CARDS } from '../utils/constants';

function HomePage() {
  return (
    <>
      <PageSeo
        title="ImageToolkit | Browser-based image tools"
        description="Use ImageToolkit to compress, resize, crop, convert, watermark, adjust, and export images directly in your browser."
      />
      <section className="hero">
        <div className="container hero-grid">
          <div>
            <p className="eyebrow">Frontend-only image editor</p>
            <h1>All-in-one image tools that run fully in the browser.</h1>
            <p className="hero-copy">
              Compress, resize, crop, convert, watermark, inspect metadata, and more without a backend runtime.
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
          <h2>Tools</h2>
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
          items={[
            { question: 'Does ImageToolkit require a backend to run?', answer: 'No. After build, it is a static frontend app that runs fully in the browser on normal shared hosting.' },
            { question: 'Will every image format conversion work in every browser?', answer: 'Only browser-supported formats are offered. If a browser cannot export a format reliably, the app shows a graceful validation message.' },
            { question: 'Can I deploy it in a subfolder such as /image-toolkit/?', answer: 'Yes. The Vite base path, BrowserRouter basename, and included .htaccess file are configured for shared hosting subfolder deployment.' },
          ]}
        />
      </section>
    </>
  );
}

export default HomePage;
