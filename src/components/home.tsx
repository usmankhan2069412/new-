import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Header from "./Header";
import FeaturedPost from "./FeaturedPost";
import PostGrid from "./PostGrid";
import SEO from "./SEO.jsx";
import Footer from "./Footer";
import { getPosts } from "@/lib/api";
import { Post } from "@/lib/api";
import { Button } from "./ui/button";
import { Input as InputComponent } from "./ui/input";
import { useAuth } from "./auth/AuthContext";
import { useToast } from "./ui/use-toast";
import { ToastAction } from "./ui/toast";

const Home = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");

  // State for blog posts from database
  const [blogPosts, setBlogPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch posts from database
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const posts = await getPosts();
        setBlogPosts(posts);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching posts:", error);
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

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
        {/* Only show featured post if not searching and we have posts */}
        {!searchQuery && !loading && blogPosts.length > 0 && (
          <FeaturedPost
            title={blogPosts[0]?.title || featuredPost.title}
            excerpt={blogPosts[0]?.excerpt || featuredPost.excerpt}
            date={
              blogPosts[0]?.date
                ? new Date(blogPosts[0].date).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })
                : featuredPost.date
            }
            readTime={blogPosts[0]?.read_time || featuredPost.readTime}
            imageUrl={blogPosts[0]?.image_url || featuredPost.imageUrl}
            category={blogPosts[0]?.category || featuredPost.category}
            onClick={() => handlePostClick(blogPosts[0]?.id || "1")}
          />
        )}

        {/* Post Grid Section */}
        {loading ? (
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex justify-center">
            <div className="animate-pulse space-y-8 w-full">
              <div className="h-8 bg-muted rounded w-1/3 mx-auto"></div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="bg-card rounded-lg overflow-hidden">
                    <div className="h-48 bg-muted"></div>
                    <div className="p-4 space-y-3">
                      <div className="h-6 bg-muted rounded w-3/4"></div>
                      <div className="h-4 bg-muted rounded w-full"></div>
                      <div className="h-4 bg-muted rounded w-full"></div>
                      <div className="h-4 bg-muted rounded w-1/2"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : blogPosts.length > 0 ? (
          <PostGrid
            posts={blogPosts}
            categories={categories}
            onPostClick={handlePostClick}
          />
        ) : (
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
            <h2 className="text-2xl font-bold mb-4">No posts found</h2>
            <p className="text-muted-foreground mb-6">
              There are no blog posts available yet.
            </p>
            {user?.role === "admin" && (
              <Button onClick={() => navigate("/create")}>
                Create Your First Post
              </Button>
            )}
          </div>
        )}
      </main>

      {/* Newsletter Section */}
      <section className="w-full bg-primary/5 py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4 text-foreground">
            Subscribe to Our Newsletter
          </h2>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            Stay updated with our latest articles, tutorials, and resources.
            We'll send you a weekly digest of the best content straight to your
            inbox.
          </p>
          <form
            className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
            onSubmit={(e) => {
              e.preventDefault();
              const form = e.target as HTMLFormElement;
              const emailInput = form.querySelector(
                'input[type="email"]',
              ) as HTMLInputElement;
              const email = emailInput.value.trim();

              if (!email) return;

              // Save to localStorage
              try {
                const subscribers = JSON.parse(
                  localStorage.getItem("newsletter_subscribers") || "[]",
                );
                const existingSubscriber = subscribers.find(
                  (s) => s.email === email,
                );

                if (!existingSubscriber) {
                  subscribers.push({
                    id: Date.now().toString(),
                    email,
                    date: new Date().toLocaleDateString(),
                    source: "homepage",
                  });
                  localStorage.setItem(
                    "newsletter_subscribers",
                    JSON.stringify(subscribers),
                  );
                  toast({
                    title: "Subscription Successful!",
                    description: "Thank you for subscribing to our newsletter!",
                    variant: "default",
                    className: "bg-green-600 text-white",
                  });
                  emailInput.value = "";
                } else {
                  toast({
                    title: "Already Subscribed",
                    description:
                      "You are already subscribed to our newsletter.",
                    variant: "default",
                    className: "bg-blue-600 text-white",
                  });
                }
              } catch (err) {
                console.error("Error saving subscriber:", err);
                toast({
                  title: "Subscription Error",
                  description:
                    "There was an error processing your subscription. Please try again.",
                  variant: "destructive",
                  action: (
                    <ToastAction altText="Try again">Try again</ToastAction>
                  ),
                });
              }
            }}
          >
            <InputComponent
              type="email"
              placeholder="Your email address"
              className="flex-grow"
              required
            />
            <Button type="submit" className="px-8">
              Subscribe
            </Button>
          </form>
          <p className="text-xs text-muted-foreground mt-4">
            We respect your privacy. Unsubscribe at any time.
          </p>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Home;
