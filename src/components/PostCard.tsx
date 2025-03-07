import React from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";
import { Calendar, Clock } from "lucide-react";
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
  return (
    <Card
      className="overflow-hidden flex flex-col h-full transition-all duration-200 hover:shadow-lg bg-white cursor-pointer"
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
          className="text-xs p-0 h-auto hover:bg-transparent hover:text-primary"
        >
          Read more
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PostCard;
