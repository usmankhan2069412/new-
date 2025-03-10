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
  schema?: Record<string, any>;
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
  language?: string;
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
  schema,
  author = "BlogHub Team",
  publishedTime,
  modifiedTime,
  language = "en",
}: SEOProps) => {
  const siteUrl = typeof window !== "undefined" ? window.location.origin : "";

  // Default schema for the website
  const defaultSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "BlogHub",
    url: siteUrl,
    description: description,
    potentialAction: {
      "@type": "SearchAction",
      target: `${siteUrl}/?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };

  // Use provided schema or default
  const schemaData = schema || defaultSchema;

  return (
    <Helmet htmlAttributes={{ lang: language }}>
      {/* Basic Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content={author} />
      {noIndex && <meta name="robots" content="noindex, nofollow" />}
      {!noIndex && (
        <meta
          name="robots"
          content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"
        />
      )}
      <link rel="canonical" href={canonicalUrl} />

      {/* Open Graph Meta Tags */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:site_name" content="BlogHub" />
      <meta property="og:locale" content="en_US" />
      {publishedTime && (
        <meta property="article:published_time" content={publishedTime} />
      )}
      {modifiedTime && (
        <meta property="article:modified_time" content={modifiedTime} />
      )}

      {/* Twitter Meta Tags */}
      <meta name="twitter:card" content={twitterCard} />
      <meta name="twitter:creator" content={twitterCreator} />
      <meta name="twitter:site" content="@bloghub" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />

      {/* Mobile Meta Tags */}
      <meta
        name="viewport"
        content="width=device-width, initial-scale=1.0, maximum-scale=5.0"
      />
      <meta name="theme-color" content="#ffffff" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta
        name="apple-mobile-web-app-status-bar-style"
        content="black-translucent"
      />

      {/* Structured Data */}
      <script type="application/ld+json">{JSON.stringify(schemaData)}</script>

      {/* Preconnect to important domains */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://images.unsplash.com" />
    </Helmet>
  );
};

export default SEO;
