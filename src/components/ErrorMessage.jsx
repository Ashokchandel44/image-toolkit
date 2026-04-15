import React from 'react';

function ErrorMessage({ message }) {
  if (!message) return null;
  return (
    <div className="status-box error-box" role="alert">
      {message}
    </div>
  );
}

export default ErrorMessage;
