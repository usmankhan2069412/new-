import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "./auth/AuthContext";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import {
  Search,
  Menu,
  X,
  PenSquare,
  Sun,
  Moon,
  LayoutGrid,
} from "lucide-react";
import { Sheet, SheetContent, SheetTrigger, SheetClose } from "./ui/sheet";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "./ui/navigation-menu";
import { cn } from "@/lib/utils";
import ThemeSwitcher from "./ThemeSwitcher";
import { Switch } from "./ui/switch";
import { Label } from "./ui/label";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";

interface HeaderProps {
  logo?: string;
  categories?: string[];
  onSearch?: (query: string) => void;
  onCategorySelect?: (category: string) => void;
  posts?: any[];
}

const Header = ({
  logo = "BlogHub",
  categories = [
    "Technology",
    "Design",
    "Business",
    "Lifestyle",
    "Travel",
    "Health",
  ],
  onSearch = (query) => console.log(`Searching for: ${query}`),
  onCategorySelect = (category) =>
    console.log(`Selected category: ${category}`),
  posts = [],
}: HeaderProps) => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isGridView, setIsGridView] = useState(true);
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);

  // Initialize view mode from localStorage
  useEffect(() => {
    try {
      const savedViewMode = localStorage.getItem("viewMode");
      if (savedViewMode !== null) {
        setIsGridView(savedViewMode === "grid");
      }
    } catch (error) {
      console.error("Error reading view mode from localStorage:", error);
    }
  }, []);

  // Get all posts from home component
  const allPosts =
    posts.length > 0
      ? posts
      : [
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

  // Initialize theme from localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "light";
    setIsDarkMode(savedTheme === "dark");
    document.documentElement.setAttribute("data-theme", savedTheme);
  }, []);

  // Toggle dark mode
  const toggleDarkMode = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    const theme = newMode ? "dark" : "light";
    localStorage.setItem("theme", theme);
    document.documentElement.setAttribute("data-theme", theme);
    document.documentElement.classList.toggle("dark", newMode);
  };

  // Toggle grid/list view
  const toggleGridView = () => {
    const newGridView = !isGridView;
    setIsGridView(newGridView);

    // Save preference to localStorage
    try {
      localStorage.setItem("viewMode", newGridView ? "grid" : "list");
    } catch (error) {
      console.error("Error saving view mode to localStorage:", error);
    }

    // Dispatch a custom event that PostGrid and PostCard can listen for
    try {
      window.dispatchEvent(
        new CustomEvent("viewModeChange", {
          detail: { isGridView: newGridView },
        }),
      );

      // Force update of post container class
      const container = document.getElementById("post-container");
      if (container) {
        container.className = newGridView
          ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10"
          : "flex flex-col space-y-6 mb-10";
        container.setAttribute("data-view-mode", newGridView ? "grid" : "list");
      }
    } catch (error) {
      console.error("Error dispatching view mode event:", error);
    }
  };

  // Real-time search functionality
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (query.trim() === "") {
      setSearchResults([]);
      setShowSearchResults(false);
      return;
    }

    // Search in titles, excerpts, and categories
    const results = allPosts.filter(
      (post) =>
        post.title.toLowerCase().includes(query.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(query.toLowerCase()) ||
        post.category.toLowerCase().includes(query.toLowerCase()),
    );

    setSearchResults(results);
    setShowSearchResults(true);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim() !== "") {
      onSearch(searchQuery);
      // Navigate to search results page or filter current page
      // For now, we'll just close the search results dropdown
      setShowSearchResults(false);
    }
  };

  const handleSearchResultClick = (postId: string) => {
    setShowSearchResults(false);
    setSearchQuery("");
    // Navigate to the post detail page
    // For now, we'll just log it
    console.log(`Navigating to post with ID: ${postId}`);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 sm:h-20 items-center justify-between">
        {/* Logo */}
        <div className="flex items-center">
          <a href="/" className="text-2xl font-bold text-primary">
            {logo}
          </a>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-6">
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger className="bg-transparent">
                  Categories
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                    {categories.map((category) => (
                      <li key={category}>
                        <NavigationMenuLink asChild>
                          <a
                            href={`#${category.toLowerCase()}`}
                            onClick={() => onCategorySelect(category)}
                            className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                          >
                            <div className="text-sm font-medium leading-none">
                              {category}
                            </div>
                          </a>
                        </NavigationMenuLink>
                      </li>
                    ))}
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link
                  to="/contact"
                  className="flex items-center px-4 py-2 text-sm font-medium"
                >
                  Contact
                </Link>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>

          {user ? (
            <div className="flex items-center gap-4">
              <Link to="/create">
                <Button className="flex items-center gap-2">
                  <PenSquare className="h-4 w-4" />
                  Write Post
                </Button>
              </Link>
              <Button variant="outline" onClick={logout}>
                Logout
              </Button>
            </div>
          ) : (
            <Link to="/login">
              <Button className="flex items-center gap-2">
                <PenSquare className="h-4 w-4" />
                Admin Login
              </Button>
            </Link>
          )}

          {/* Toggle Buttons */}
          <div className="flex items-center space-x-4">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={toggleDarkMode}
                    className="h-10 w-10"
                  >
                    {isDarkMode ? (
                      <Sun className="h-5 w-5" />
                    ) : (
                      <Moon className="h-5 w-5" />
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>
                    {isDarkMode
                      ? "Switch to light mode"
                      : "Switch to dark mode"}
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={toggleGridView}
                    className="h-10 w-10"
                  >
                    <LayoutGrid className="h-5 w-5" />
                    <span className="sr-only">
                      {isGridView
                        ? "Switch to list view"
                        : "Switch to grid view"}
                    </span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>
                    {isGridView ? "Switch to list view" : "Switch to grid view"}
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

          {/* Search Form */}
          <div className="relative">
            <form
              onSubmit={handleSearch}
              className="flex w-full max-w-sm items-center space-x-2"
            >
              <Input
                type="search"
                placeholder="Search articles..."
                className="w-64"
                value={searchQuery}
                onChange={handleSearchChange}
                onFocus={() =>
                  searchQuery.trim() !== "" && setShowSearchResults(true)
                }
              />
              <Button type="submit" size="icon" variant="ghost">
                <Search className="h-4 w-4" />
              </Button>
            </form>

            {/* Search Results Dropdown */}
            {showSearchResults && searchResults.length > 0 && (
              <div className="absolute top-full mt-2 w-full bg-background border rounded-md shadow-lg z-50 max-h-[400px] overflow-y-auto">
                <ul className="py-2">
                  {searchResults.map((post) => (
                    <li
                      key={post.id}
                      className="px-4 py-2 hover:bg-accent cursor-pointer"
                      onClick={() => handleSearchResultClick(post.id)}
                    >
                      <div className="font-medium">{post.title}</div>
                      <div className="text-xs text-muted-foreground">
                        {post.category}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="h-10 w-10">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <div className="flex flex-col h-full">
                <div className="flex justify-between items-center py-4">
                  <span className="text-lg font-semibold">Menu</span>
                  <SheetClose asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <X className="h-4 w-4" />
                    </Button>
                  </SheetClose>
                </div>

                {/* Mobile Search */}
                <div className="relative mb-6">
                  <form
                    onSubmit={handleSearch}
                    className="flex items-center space-x-2"
                  >
                    <Input
                      type="search"
                      placeholder="Search articles..."
                      className="flex-1"
                      value={searchQuery}
                      onChange={handleSearchChange}
                      onFocus={() =>
                        searchQuery.trim() !== "" && setShowSearchResults(true)
                      }
                    />
                    <Button type="submit" size="icon" variant="ghost">
                      <Search className="h-4 w-4" />
                    </Button>
                  </form>

                  {/* Mobile Search Results */}
                  {showSearchResults && searchResults.length > 0 && (
                    <div className="absolute top-full mt-2 w-full bg-background border rounded-md shadow-lg z-50 max-h-[300px] overflow-y-auto">
                      <ul className="py-2">
                        {searchResults.map((post) => (
                          <li
                            key={post.id}
                            className="px-4 py-2 hover:bg-accent cursor-pointer"
                            onClick={() => handleSearchResultClick(post.id)}
                          >
                            <div className="font-medium">{post.title}</div>
                            <div className="text-xs text-muted-foreground">
                              {post.category}
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                {/* Mobile Toggle Options */}
                <div className="space-y-4 mb-6">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="dark-mode" className="text-sm font-medium">
                      Dark Mode
                    </Label>
                    <Switch
                      id="dark-mode"
                      checked={isDarkMode}
                      onCheckedChange={toggleDarkMode}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="grid-view" className="text-sm font-medium">
                      Grid View
                    </Label>
                    <Switch
                      id="grid-view"
                      checked={isGridView}
                      onCheckedChange={toggleGridView}
                    />
                  </div>
                </div>

                {/* Mobile Categories */}
                <div className="space-y-4">
                  <h3 className="text-sm font-medium">Categories</h3>
                  <nav className="flex flex-col space-y-2">
                    {categories.map((category) => (
                      <SheetClose asChild key={category}>
                        <a
                          href={`#${category.toLowerCase()}`}
                          onClick={() => onCategorySelect(category)}
                          className="px-2 py-1.5 text-sm rounded-md hover:bg-accent"
                        >
                          {category}
                        </a>
                      </SheetClose>
                    ))}
                    <SheetClose asChild>
                      <Link
                        to="/contact"
                        className="px-2 py-1.5 text-sm rounded-md hover:bg-accent"
                      >
                        Contact Us
                      </Link>
                    </SheetClose>
                  </nav>
                </div>

                <div className="mt-6 space-y-4">
                  {user ? (
                    <>
                      <SheetClose asChild>
                        <Link to="/create">
                          <Button className="w-full flex items-center justify-center gap-2">
                            <PenSquare className="h-4 w-4" />
                            Write Post
                          </Button>
                        </Link>
                      </SheetClose>
                      <SheetClose asChild>
                        <Button
                          variant="outline"
                          className="w-full"
                          onClick={logout}
                        >
                          Logout
                        </Button>
                      </SheetClose>
                    </>
                  ) : (
                    <SheetClose asChild>
                      <Link to="/login">
                        <Button className="w-full flex items-center justify-center gap-2">
                          <PenSquare className="h-4 w-4" />
                          Admin Login
                        </Button>
                      </Link>
                    </SheetClose>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default Header;
