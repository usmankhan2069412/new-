import React from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";
import { Calendar, Clock, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface PostCardProps {
  title?: string;
  excerpt?: string;
  date?: string;
  imageUrl?: string;
  category?: string;
  onClick?: () => void;
}

const PostCard = ({
  title = "How to Build a Modern Blog with React and Tailwind",
  excerpt = "Learn the best practices for creating a responsive and accessible blog using the latest web technologies.",
  date = "April 15, 2023",
  imageUrl = "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&q=80",
  category = "Web Development",
  onClick = () => console.log("Post card clicked"),
}: PostCardProps) => {
  // Use navigate for routing
  const navigate = React.useCallback(() => {
    if (onClick) onClick();
  }, [onClick]);
  // Get list view state from props instead of DOM
  const [isListView, setIsListView] = React.useState(false);

  React.useEffect(() => {
    // Listen for view mode changes
    const handleViewModeChange = (event: CustomEvent) => {
      setIsListView(!event.detail.isGridView);
    };

    window.addEventListener(
      "viewModeChange",
      handleViewModeChange as EventListener,
    );

    // Check localStorage for initial view
    try {
      const savedViewMode = localStorage.getItem("viewMode");
      if (savedViewMode !== null) {
        setIsListView(savedViewMode === "list");
      }
    } catch (error) {
      console.error("Error reading view mode:", error);
    }

    // Also check the DOM for current view mode
    const container = document.getElementById("post-container");
    if (container) {
      setIsListView(container.getAttribute("data-view-mode") === "list");
    }

    return () => {
      window.removeEventListener(
        "viewModeChange",
        handleViewModeChange as EventListener,
      );
    };
  }, []);

  if (isListView) {
    return (
      <Card
        className="overflow-hidden flex flex-col sm:flex-row h-auto sm:h-48 transition-all duration-200 hover:shadow-lg bg-card cursor-pointer"
        onClick={onClick}
      >
        <div className="relative h-48 sm:h-full w-full sm:w-1/3 overflow-hidden">
          <img
            src={imageUrl}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          />
          <div className="absolute top-4 left-4">
            <span className="bg-primary text-primary-foreground text-xs font-medium px-2.5 py-1 rounded-full">
              {category}
            </span>
          </div>
        </div>

        <div className="flex flex-col w-full sm:w-2/3 p-4">
          <CardHeader className="pb-2 px-0 pt-0">
            <CardTitle className="text-xl font-bold line-clamp-2 hover:text-primary transition-colors">
              {title}
            </CardTitle>
          </CardHeader>

          <CardContent className="flex-grow p-0">
            <p className="text-muted-foreground text-sm line-clamp-3">
              {excerpt}
            </p>
          </CardContent>

          <CardFooter className="pt-2 border-t flex justify-between items-center text-xs text-muted-foreground p-0 mt-auto">
            <div className="flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5" />
              <span>{date}</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="text-xs p-0 h-auto hover:bg-transparent hover:text-primary flex items-center gap-1"
            >
              Read more <ArrowRight className="h-3 w-3 ml-1" />
            </Button>
          </CardFooter>
        </div>
      </Card>
    );
  }

  // Default grid view
  return (
    <Card
      className="overflow-hidden flex flex-col h-full transition-all duration-200 hover:shadow-lg bg-card cursor-pointer"
      onClick={onClick}
    >
      <div className="relative h-48 w-full overflow-hidden">
        <img
          src={imageUrl}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
        />
        <div className="absolute top-4 left-4">
          <span className="bg-primary text-primary-foreground text-xs font-medium px-2.5 py-1 rounded-full">
            {category}
          </span>
        </div>
      </div>

      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-bold line-clamp-2 hover:text-primary transition-colors">
          {title}
        </CardTitle>
      </CardHeader>

      <CardContent className="flex-grow">
        <p className="text-muted-foreground text-sm line-clamp-3">{excerpt}</p>
      </CardContent>

      <CardFooter className="pt-2 border-t flex justify-between items-center text-xs text-muted-foreground">
        <div className="flex items-center gap-1">
          <Calendar className="h-3.5 w-3.5" />
          <span>{date}</span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="text-xs p-0 h-auto hover:bg-transparent hover:text-primary flex items-center gap-1"
        >
          Read more <ArrowRight className="h-3 w-3 ml-1" />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PostCard;
