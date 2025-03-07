import React from "react";
import Header from "./Header";
import FeaturedPost from "./FeaturedPost";
import PostGrid from "./PostGrid";

const Home = () => {
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
    // In a real app, this would navigate to the post detail page
  };

  const handleFeaturedPostClick = () => {
    console.log("Navigating to featured post");
    // In a real app, this would navigate to the featured post detail page
  };

  const handleSearch = (query: string) => {
    console.log(`Searching for: ${query}`);
    // In a real app, this would trigger a search and update the post list
  };

  const handleCategorySelect = (category: string) => {
    console.log(`Selected category: ${category}`);
    // In a real app, this would filter posts by category
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <Header
        categories={categories.filter((cat) => cat !== "All")}
        onSearch={handleSearch}
        onCategorySelect={handleCategorySelect}
      />

      <main className="flex-grow">
        {/* Featured Post Section */}
        <FeaturedPost {...featuredPost} onClick={handleFeaturedPostClick} />

        {/* Post Grid Section */}
        <PostGrid
          posts={blogPosts}
          categories={categories}
          onPostClick={handlePostClick}
        />
      </main>

      {/* Footer */}
      <footer className="bg-muted py-12 mt-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <h3 className="text-xl font-bold mb-4">BlogHub</h3>
              <p className="text-muted-foreground mb-4">
                A modern blogging platform focused on clean design and
                exceptional reading experience.
              </p>
              <p className="text-sm text-muted-foreground">
                © {new Date().getFullYear()} BlogHub. All rights reserved.
              </p>
            </div>

            <div>
              <h4 className="font-medium mb-4">Categories</h4>
              <ul className="space-y-2">
                {categories.slice(1, 7).map((category) => (
                  <li key={category}>
                    <a
                      href={`#${category.toLowerCase()}`}
                      className="text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                      {category}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-medium mb-4">Links</h4>
              <ul className="space-y-2">
                <li>
                  <a
                    href="#"
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    About Us
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    Contact
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    Terms of Service
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
