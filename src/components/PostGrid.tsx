import React, { useState, useEffect } from "react";
import PostCard from "./PostCard";
import { Button } from "./ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "./ui/carousel";

interface Post {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  imageUrl?: string;
  image_url?: string;
  category: string;
}

interface PostGridProps {
  posts?: Post[];
  categories?: string[];
  onPostClick?: (postId: string) => void;
}

const PostGrid = ({
  posts = [
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
  ],
  categories = [
    "All",
    "Web Development",
    "Technology",
    "Design",
    "UX Design",
    "Backend",
  ],
  onPostClick = (postId: string) => console.log(`Post ${postId} clicked`),
}: PostGridProps) => {
  const [activeCategory, setActiveCategory] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [isGridView, setIsGridView] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const postsPerPage = 6;
  const postLimitForSlider = 9; // Limit after which slider is shown

  // Listen for view mode changes from Header component
  useEffect(() => {
    const handleViewModeChange = (event: CustomEvent) => {
      setIsGridView(event.detail.isGridView);
    };

    // Add event listener
    window.addEventListener(
      "viewModeChange",
      handleViewModeChange as EventListener,
    );

    // Check for existing view mode in localStorage
    try {
      const savedViewMode = localStorage.getItem("viewMode");
      if (savedViewMode !== null) {
        setIsGridView(savedViewMode === "grid");
      }
    } catch (error) {
      console.error("Error reading view mode from localStorage:", error);
    }

    return () => {
      window.removeEventListener(
        "viewModeChange",
        handleViewModeChange as EventListener,
      );
    };
  }, []);

  // Listen for search query changes from URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const query = params.get("q");
    if (query) {
      setSearchQuery(query);
    }
  }, []);

  // Normalize posts to ensure they have imageUrl property
  const normalizedPosts = posts.map((post) => ({
    ...post,
    imageUrl: post.imageUrl || post.image_url,
  }));

  // Filter posts by category and search query
  const filteredPosts = normalizedPosts.filter((post) => {
    // First filter by category
    const matchesCategory =
      activeCategory === "All" || post.category === activeCategory;

    // Then filter by search query if it exists
    const matchesSearch = searchQuery
      ? post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.category.toLowerCase().includes(searchQuery.toLowerCase())
      : true;

    return matchesCategory && matchesSearch;
  });

  // Calculate pagination
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);
  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-12 bg-background">
      <div className="mb-8">
        <h2 className="text-3xl font-bold tracking-tight mb-6">
          {searchQuery
            ? `Search Results for "${searchQuery}"`
            : "Latest Articles"}
        </h2>

        {!searchQuery && (
          <Tabs defaultValue="All" className="w-full">
            <TabsList className="mb-8 flex flex-wrap gap-2">
              {categories.map((category) => (
                <TabsTrigger
                  key={category}
                  value={category}
                  onClick={() => {
                    setActiveCategory(category);
                    setCurrentPage(1);
                  }}
                  className="px-4 py-2"
                >
                  {category}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        )}

        {searchQuery && filteredPosts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-lg text-muted-foreground">
              No results found for "{searchQuery}"
            </p>
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => {
                setSearchQuery("");
                window.history.pushState({}, "", window.location.pathname);
              }}
            >
              Clear Search
            </Button>
          </div>
        )}
      </div>

      {filteredPosts.length > 0 && (
        <>
          {filteredPosts.length > postLimitForSlider ? (
            <div className="mb-10">
              <Carousel className="w-full">
                <CarouselContent>
                  {Array.from({
                    length: Math.ceil(currentPosts.length / 3),
                  }).map((_, index) => (
                    <CarouselItem key={index} className="basis-full">
                      <div
                        className={
                          isGridView
                            ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 transition-all duration-500 ease-in-out"
                            : "flex flex-col space-y-6 transition-all duration-500 ease-in-out"
                        }
                      >
                        {currentPosts
                          .slice(index * 3, (index + 1) * 3)
                          .map((post) => (
                            <PostCard
                              key={post.id}
                              title={post.title}
                              excerpt={post.excerpt}
                              date={post.date}
                              imageUrl={post.imageUrl}
                              category={post.category}
                              onClick={() => onPostClick(post.id)}
                            />
                          ))}
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <div className="flex justify-center mt-4">
                  <CarouselPrevious className="relative mr-2" />
                  <CarouselNext className="relative ml-2" />
                </div>
              </Carousel>
            </div>
          ) : (
            <div
              className={
                isGridView
                  ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10 transition-all duration-500 ease-in-out"
                  : "flex flex-col space-y-6 mb-10 transition-all duration-500 ease-in-out"
              }
              id="post-container"
              data-view-mode={isGridView ? "grid" : "list"}
            >
              {currentPosts.map((post) => (
                <PostCard
                  key={post.id}
                  title={post.title}
                  excerpt={post.excerpt}
                  date={post.date}
                  imageUrl={post.imageUrl}
                  category={post.category}
                  onClick={() => onPostClick(post.id)}
                />
              ))}
            </div>
          )}

          {/* Pagination - only show when not using slider */}
          {totalPages > 1 && filteredPosts.length <= postLimitForSlider && (
            <div className="flex justify-center items-center gap-2 mt-10">
              <Button
                variant="outline"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="h-10 w-10 p-0"
              >
                &lt;
              </Button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <Button
                    key={page}
                    variant={currentPage === page ? "default" : "outline"}
                    onClick={() => setCurrentPage(page)}
                    className="h-10 w-10 p-0"
                  >
                    {page}
                  </Button>
                ),
              )}

              <Button
                variant="outline"
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className="h-10 w-10 p-0"
              >
                &gt;
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default PostGrid;
