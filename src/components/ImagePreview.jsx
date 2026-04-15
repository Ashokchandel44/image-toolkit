import React from 'react';

function ImagePreview({ title = 'Original preview', src, details }) {
  if (!src) return null;

  return (
    <section className="panel preview-card">
      <div className="preview-header">
        <h3>{title}</h3>
        {details ? <p>{details}</p> : null}
      </div>
      <div className="preview-frame">
        <img src={src} alt={title} />
      </div>
    </section>
  );
}

export default ImagePreview;
