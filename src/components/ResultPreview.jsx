import React from 'react';

function ResultPreview({ src, details, children }) {
  if (!src) return null;

  return (
    <section className="panel preview-card result-card">
      <div className="preview-header">
        <h3>Processed result</h3>
        {details ? <p>{details}</p> : null}
      </div>
      <div className="preview-frame">
        <img src={src} alt="Processed preview" />
      </div>
      {children}
    </section>
  );
}

export default ResultPreview;
