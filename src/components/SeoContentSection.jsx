import React from 'react';

function SeoContentSection({ title, whatItDoes, howToUse, whyUseful }) {
  return (
    <section className="panel prose-panel">
      <h2>{title}</h2>
      <div className="prose-grid">
        <article>
          <h3>What this tool does</h3>
          <p>{whatItDoes}</p>
        </article>
        <article>
          <h3>How to use it</h3>
          <p>{howToUse}</p>
        </article>
        <article>
          <h3>Why it is useful</h3>
          <p>{whyUseful}</p>
        </article>
      </div>
    </section>
  );
}

export default SeoContentSection;
