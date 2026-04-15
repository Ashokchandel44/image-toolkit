import React from 'react';

function SuccessMessage({ message }) {
  if (!message) return null;
  return <div className="status-box success-box">{message}</div>;
}

export default SuccessMessage;
