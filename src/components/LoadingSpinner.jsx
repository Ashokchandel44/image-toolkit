import React from 'react';

function LoadingSpinner({ label = 'Processing image...' }) {
  return (
    <div className="status-box loading-box" role="status" aria-live="polite">
      <span className="spinner" aria-hidden="true" />
      <span>{label}</span>
    </div>
  );
}

export default LoadingSpinner;
