import React from 'react';
import { Helmet } from 'react-helmet-async';

function PageSeo({ title, description, canonical, image, schema }) {
  const socialImage = image || 'https://travelwithanki.com/wp-content/uploads/2024/06/cropped-apple-touch-icon.png';
  const schemaItems = Array.isArray(schema) ? schema.filter(Boolean) : [schema].filter(Boolean);

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      {canonical ? <link rel="canonical" href={canonical} /> : null}
      <meta property="og:type" content="website" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      {canonical ? <meta property="og:url" content={canonical} /> : null}
      <meta property="og:image" content={socialImage} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={socialImage} />
      {schemaItems.map((schemaItem, index) => (
        <script key={index} type="application/ld+json">
          {JSON.stringify(schemaItem)}
        </script>
      ))}
    </Helmet>
  );
}

export default PageSeo;
