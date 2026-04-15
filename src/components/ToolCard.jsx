import React from 'react';
import { Link } from 'react-router-dom';

function ToolCard({ title, description, path }) {
  return (
    <article className="tool-card">
      <h3>{title}</h3>
      <p>{description}</p>
      <Link className="button secondary" to={path}>
        Open Tool
      </Link>
    </article>
  );
}

export default ToolCard;
