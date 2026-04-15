import React from 'react';

function DownloadButton({ onClick, label = 'Download result', disabled }) {
  return (
    <button className="button" type="button" onClick={onClick} disabled={disabled}>
      {label}
    </button>
  );
}

export default DownloadButton;
