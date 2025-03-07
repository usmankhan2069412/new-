import React from "react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Calendar, Clock, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface FeaturedPostProps {
  title?: string;
  excerpt?: string;
  date?: string;
  readTime?: string;
  imageUrl?: string;
  category?: string;
  onClick?: () => void;
}

const FeaturedPost = ({
  title = "Building Scalable Web Applications with Modern Architecture",
  excerpt = "Discover the essential patterns and practices for creating robust, maintainable web applications that can grow with your business needs. This comprehensive guide covers everything from frontend frameworks to backend services and deployment strategies.",
  date = "May 12, 2023",
  readTime = "8 min read",
  imageUrl = "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1200&q=80",
  category = "Architecture",
  onClick = () => console.log("Featured post clicked"),
}: FeaturedPostProps) => {
  return (
    <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 bg-white">
      <div
        className="relative overflow-hidden rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer"
        onClick={onClick}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/40 z-10" />

        <div className="relative z-20 flex flex-col h-full justify-end p-6 sm:p-8 md:p-12 text-white">
          <div className="space-y-6 max-w-3xl">
            <Badge className="bg-primary hover:bg-primary/90 text-white text-xs px-3 py-1">
              {category}
            </Badge>

            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold leading-tight">
              {title}
            </h1>

            <p className="text-sm sm:text-base text-gray-200 line-clamp-3 md:line-clamp-4">
              {excerpt}
            </p>

            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-300">
              <div className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4" />
                <span>{date}</span>
              </div>

              <div className="flex items-center gap-1.5">
                <Clock className="h-4 w-4" />
                <span>{readTime}</span>
              </div>

              <Button
                variant="ghost"
                className="text-white hover:text-primary hover:bg-white/10 px-0 -ml-3"
              >
                Read article <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        <img
          src={imageUrl}
          alt={title}
          className="absolute inset-0 w-full h-full object-cover object-center"
          style={{ zIndex: 0 }}
        />
      </div>
    </section>
  );
};

export default FeaturedPost;
