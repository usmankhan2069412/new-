import React from "react";
import { Badge } from "./ui/badge";
import { Calendar } from "lucide-react";
import { cn } from "@/lib/utils";

interface PostCardProps {
  title?: string;
  excerpt?: string;
  date?: string;
  imageUrl?: string;
  category?: string;
  onClick?: () => void;
  className?: string;
}

const PostCard = ({
  title = "How to Build a Modern Blog with React and Tailwind",
  excerpt = "Learn the best practices for creating a responsive and accessible blog using the latest web technologies.",
  date = "April 15, 2023",
  imageUrl = "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&q=80",
  category = "Web Development",
  onClick = () => console.log("Post card clicked"),
  className,
}: PostCardProps) => {
  // Check if we're in list or grid view
  const [isGridView, setIsGridView] = React.useState(true);

  // Listen for view mode changes
  React.useEffect(() => {
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

  // Format the date if it's an ISO string
  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    try {
      const date = new Date(dateString);
      // Check if date is valid
      if (isNaN(date.getTime())) return dateString;
      return date.toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      });
    } catch (e) {
      return dateString;
    }
  };

  // Ensure image URL is valid
  const safeImageUrl =
    imageUrl ||
    "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&q=80";

  return (
    <div
      className={cn(
        "group bg-card  rounded-lg overflow-hidden shadow-sm hover:shadow-md cursor-pointer",
        isGridView ? "flex flex-col" : "flex flex-row h-48",
        "transition-all duration-500 ease-in-out transform hover:scale-[1.02]",
        className,
      )}
      onClick={onClick}
    >
      <div
        className={cn(
          "overflow-hidden",
          isGridView ? "h-48" : "w-48 h-full flex-shrink-0",
          "transition-all duration-500 ease-in-out",
        )}
      >
        <img
          src={safeImageUrl}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>

      <div
        className={cn(
          "flex flex-col",
          isGridView ? "p-4" : "p-4 flex-grow justify-between",
          "transition-all duration-500 ease-in-out",
        )}
      >
        <div>
          <div className="flex items-center justify-between mb-2">
            <Badge
              variant="outline"
              className="text-xs font-normal px-2 py-0.5"
            >
              {category}
            </Badge>
            <div className="flex items-center text-xs text-muted-foreground">
              <Calendar className="h-3 w-3 mr-1" />
              <span>{formatDate(date)}</span>
            </div>
          </div>

          <h3
            className={cn(
              "font-semibold group-hover:text-primary transition-colors line-clamp-2",
              isGridView ? "text-lg mb-2" : "text-xl mb-1",
            )}
          >
            {title}
          </h3>

          <p
            className={cn(
              "text-muted-foreground text-sm",
              isGridView ? "line-clamp-2" : "line-clamp-1",
            )}
          >
            {excerpt}
          </p>
        </div>

        {!isGridView && (
          <div className="mt-2">
            <span className="text-xs text-primary font-medium">
              Read article →
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default PostCard;
