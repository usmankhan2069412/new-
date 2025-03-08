import React from "react";
import { Helmet } from "react-helmet";

type SEOProps = {
  title?: string;
  description?: string;
  keywords?: string;
  ogImage?: string;
  ogType?: string;
  canonicalUrl?: string;
  twitterCard?: string;
  twitterCreator?: string;
  noIndex?: boolean;
};

const SEO = ({
  title = "BlogHub - Modern Blog Platform",
  description = "A clean, responsive blogging platform that allows users to read articles with a focus on readability and content discovery.",
  keywords = "blog, articles, web development, technology, design, content",
  ogImage = "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=1200&q=80",
  ogType = "website",
  canonicalUrl = typeof window !== "undefined" ? window.location.href : "",
  twitterCard = "summary_large_image",
  twitterCreator = "@bloghub",
  noIndex = false,
}: SEOProps) => {
  const siteUrl = typeof window !== "undefined" ? window.location.origin : "";

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      {noIndex && <meta name="robots" content="noindex, nofollow" />}
      <link rel="canonical" href={canonicalUrl} />

      {/* Open Graph Meta Tags */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:site_name" content="BlogHub" />

      {/* Twitter Meta Tags */}
      <meta name="twitter:card" content={twitterCard} />
      <meta name="twitter:creator" content={twitterCreator} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
    </Helmet>
  );
};

export default SEO;
