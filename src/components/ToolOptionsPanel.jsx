import React from 'react';

function ToolOptionsPanel({ title = 'Options', children, actions }) {
  return (
    <section className="panel options-panel">
      <div className="panel-header">
        <h2>{title}</h2>
      </div>
      <div className="option-grid">{children}</div>
      {actions ? <div className="action-row">{actions}</div> : null}
    </section>
  );
}

export default ToolOptionsPanel;
