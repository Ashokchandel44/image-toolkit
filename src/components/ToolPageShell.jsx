import React from 'react';
import PageSeo from './PageSeo';
import SeoContentSection from './SeoContentSection';
import FaqSection from './FaqSection';

function ToolPageShell({ title, description, intro, seoContent, faqItems, children }) {
  return (
    <>
      <PageSeo title={`${title} | ImageToolkit`} description={description} />
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
      </section>
    </>
  );
}

export default ToolPageShell;
