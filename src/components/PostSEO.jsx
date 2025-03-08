import React from "react";
import SEO from "./SEO";

const PostSEO = ({
  title,
  excerpt,
  category,
  date,
  imageUrl,
  author = "BlogHub Team",
  slug = "",
}) => {
  const formattedDate = new Date(date).toISOString();
  const canonicalUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/post/${slug}`
      : "";

  // Generate keywords from title, category and excerpt
  const keywords = `${title}, ${category}, blog, article, ${excerpt.split(" ").slice(0, 5).join(", ")}`;

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
      />
      <script type="application/ld+json">
        {JSON.stringify(structuredData)}
      </script>
    </>
  );
};

export default PostSEO;
