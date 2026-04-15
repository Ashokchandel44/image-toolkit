import React from 'react';
import { Helmet } from 'react-helmet-async';

function PageSeo({ title, description }) {
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
    </Helmet>
  );
}

export default PageSeo;
