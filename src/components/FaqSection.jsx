import React from 'react';

function FaqSection({ items }) {
  return (
    <section className="panel faq-panel">
      <h2>FAQ</h2>
      <div className="faq-list">
        {items.map((item) => (
          <details key={item.question}>
            <summary>{item.question}</summary>
            <p>{item.answer}</p>
          </details>
        ))}
      </div>
    </section>
  );
}

export default FaqSection;
