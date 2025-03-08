import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Header from "./Header";
import FeaturedPost from "./FeaturedPost";
import PostGrid from "./PostGrid";
import SEO from "./SEO.jsx";
import Footer from "./Footer";

const Home = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState("");

  // Parse search query from URL on component mount
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const query = params.get("q");
    if (query) {
      setSearchQuery(query);
    }
  }, [location.search]);

  // Mock data for featured post
  const featuredPost = {
    title: "Building Scalable Web Applications with Modern Architecture",
    excerpt:
      "Discover the essential patterns and practices for creating robust, maintainable web applications that can grow with your business needs. This comprehensive guide covers everything from frontend frameworks to backend services and deployment strategies.",
    date: "May 12, 2023",
    readTime: "8 min read",
    imageUrl:
      "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1200&q=80",
    category: "Architecture",
  };

  // Mock data for blog posts
  const blogPosts = [
    {
      id: "1",
      title: "How to Build a Modern Blog with React and Tailwind",
      excerpt:
        "Learn the best practices for creating a responsive and accessible blog using the latest web technologies.",
      date: "April 15, 2023",
      imageUrl:
        "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&q=80",
      category: "Web Development",
    },
    {
      id: "2",
      title: "The Future of AI in Content Creation",
      excerpt:
        "Explore how artificial intelligence is transforming the way we create and consume content online.",
      date: "May 3, 2023",
      imageUrl:
        "https://images.unsplash.com/photo-1677442135136-760c813028c4?w=600&q=80",
      category: "Technology",
    },
    {
      id: "3",
      title: "Designing for Accessibility: A Comprehensive Guide",
      excerpt:
        "Why accessibility matters and how to implement inclusive design principles in your next project.",
      date: "June 12, 2023",
      imageUrl:
        "https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=600&q=80",
      category: "Design",
    },
    {
      id: "4",
      title: "Optimizing React Performance: Tips and Tricks",
      excerpt:
        "Advanced techniques to make your React applications faster and more efficient.",
      date: "July 8, 2023",
      imageUrl:
        "https://images.unsplash.com/photo-1633356122102-3fe601e05bd2?w=600&q=80",
      category: "Web Development",
    },
    {
      id: "5",
      title: "The Psychology of User Experience",
      excerpt:
        "Understanding how human psychology influences user behavior and decision-making in digital products.",
      date: "August 21, 2023",
      imageUrl:
        "https://images.unsplash.com/photo-1581287053822-fd7bf4f4bfec?w=600&q=80",
      category: "UX Design",
    },
    {
      id: "6",
      title: "Building a Serverless Backend for Your Blog",
      excerpt:
        "Step-by-step guide to creating a scalable and cost-effective backend using serverless technologies.",
      date: "September 5, 2023",
      imageUrl:
        "https://images.unsplash.com/photo-1607799279861-4dd421887fb3?w=600&q=80",
      category: "Backend",
    },
  ];

  // Categories for navigation and filtering
  const categories = [
    "All",
    "Web Development",
    "Technology",
    "Design",
    "UX Design",
    "Backend",
    "Architecture",
    "Lifestyle",
    "Travel",
    "Health",
  ];

  // Event handlers
  const handlePostClick = (postId: string) => {
    console.log(`Navigating to post with ID: ${postId}`);
    // Navigate to the post detail page
    navigate(`/post/${postId}`);
  };

  const handleFeaturedPostClick = () => {
    console.log("Navigating to featured post");
    // Navigate to the featured post detail page
    navigate(`/post/7`);
  };

  const handleSearch = (query: string) => {
    console.log(`Searching for: ${query}`);
    // Update URL with search query
    const params = new URLSearchParams();
    if (query.trim() !== "") {
      params.set("q", query);
      navigate({ search: params.toString() });
      setSearchQuery(query);
    } else {
      navigate({ search: "" });
      setSearchQuery("");
    }
  };

  const handleCategorySelect = (category: string) => {
    console.log(`Selected category: ${category}`);
    // In a real app, this would filter posts by category
    // This is now handled in the PostGrid component
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* SEO */}
      <SEO
        title="BlogHub - Modern Blog Platform"
        description="A clean, responsive blogging platform with a focus on readability and content discovery. Explore our articles on web development, technology, design and more."
        keywords="blog, articles, web development, technology, design, UX design, backend, architecture"
        ogImage="https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=1200&q=80"
      />

      {/* Header */}
      <Header
        categories={categories.filter((cat) => cat !== "All")}
        onSearch={handleSearch}
        onCategorySelect={handleCategorySelect}
        posts={blogPosts}
      />

      <main className="flex-grow">
        {/* Only show featured post if not searching */}
        {!searchQuery && (
          <FeaturedPost {...featuredPost} onClick={handleFeaturedPostClick} />
        )}

        {/* Post Grid Section */}
        <PostGrid
          posts={blogPosts}
          categories={categories}
          onPostClick={handlePostClick}
        />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Home;
