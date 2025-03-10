import React from "react";
import SEO from "./SEO";

type PostSEOProps = {
  title: string;
  excerpt: string;
  category: string;
  date: string;
  imageUrl: string;
  author?: string;
  slug?: string;
  readTime?: string;
  content?: string;
};

const PostSEO = ({
  title,
  excerpt,
  category,
  date,
  imageUrl,
  author = "BlogHub Team",
  slug = "",
  readTime = "5 min read",
  content = "",
}: PostSEOProps) => {
  const formattedDate = new Date(date).toISOString();
  const canonicalUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/post/${slug}`
      : "";

  // Generate keywords from title, category and excerpt
  const keywords = `${title}, ${category}, blog, article, ${excerpt.split(" ").slice(0, 5).join(", ")}, bloghub, web development, technology`;

  // Extract reading time in minutes from the readTime string
  const readingTimeMinutes = parseInt(readTime.split(" ")[0]) || 5;

  // Create structured data for the article
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: title,
    description: excerpt,
    image: imageUrl,
    datePublished: formattedDate,
    dateModified: formattedDate,
    author: {
      "@type": "Person",
      name: author,
    },
    publisher: {
      "@type": "Organization",
      name: "BlogHub",
      logo: {
        "@type": "ImageObject",
        url: "https://bloghub.com/logo.png",
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": canonicalUrl,
    },
    wordCount: content
      ? content.split(/\s+/).length
      : excerpt.split(/\s+/).length * 5,
    timeRequired: `PT${readingTimeMinutes}M`,
    articleSection: category,
    keywords: keywords.replace(/,\s/g, ","),
    inLanguage: "en-US",
  };

  // Create breadcrumb structured data
  const breadcrumbData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: typeof window !== "undefined" ? window.location.origin : "",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: category,
        item: `${typeof window !== "undefined" ? window.location.origin : ""}/?category=${encodeURIComponent(category)}`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: title,
      },
    ],
  };

  return (
    <>
      <SEO
        title={`${title} | BlogHub`}
        description={excerpt}
        keywords={keywords}
        ogImage={imageUrl}
        ogType="article"
        canonicalUrl={canonicalUrl}
        twitterCard="summary_large_image"
        author={author}
        publishedTime={formattedDate}
        modifiedTime={formattedDate}
        schema={structuredData}
      />
      <script type="application/ld+json">
        {JSON.stringify(breadcrumbData)}
      </script>
    </>
  );
};

export default PostSEO;
