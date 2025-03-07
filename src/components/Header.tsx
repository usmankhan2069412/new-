import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Search, Menu, X, PenSquare } from "lucide-react";
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

interface HeaderProps {
  logo?: string;
  categories?: string[];
  onSearch?: (query: string) => void;
  onCategorySelect?: (category: string) => void;
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
}: HeaderProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-20 items-center justify-between">
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
            </NavigationMenuList>
          </NavigationMenu>

          <Link to="/create">
            <Button className="flex items-center gap-2">
              <PenSquare className="h-4 w-4" />
              Write Post
            </Button>
          </Link>

          <ThemeSwitcher />

          {/* Search Form */}
          <form
            onSubmit={handleSearch}
            className="flex w-full max-w-sm items-center space-x-2"
          >
            <Input
              type="search"
              placeholder="Search articles..."
              className="w-64"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Button type="submit" size="icon" variant="ghost">
              <Search className="h-4 w-4" />
            </Button>
          </form>
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
                <form
                  onSubmit={handleSearch}
                  className="flex items-center space-x-2 mb-6"
                >
                  <Input
                    type="search"
                    placeholder="Search articles..."
                    className="flex-1"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <Button type="submit" size="icon" variant="ghost">
                    <Search className="h-4 w-4" />
                  </Button>
                </form>

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
                  </nav>
                </div>

                <div className="mt-6">
                  <SheetClose asChild>
                    <Link to="/create">
                      <Button className="w-full flex items-center justify-center gap-2">
                        <PenSquare className="h-4 w-4" />
                        Write Post
                      </Button>
                    </Link>
                  </SheetClose>
                </div>

                <div className="mt-4 flex justify-center">
                  <ThemeSwitcher />
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
