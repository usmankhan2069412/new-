import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import {
  Calendar,
  Clock,
  ArrowLeft,
  Share2,
  Bookmark,
  ThumbsUp,
  MessageSquare,
  Eye,
} from "lucide-react";
import Header from "./Header";
import PostSEO from "./PostSEO";
import { Badge } from "./ui/badge";
import Footer from "./Footer";
import { getPost } from "@/lib/api";
import { Post } from "@/lib/api";
import { format } from "date-fns";
import { Card, CardContent } from "./ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Separator } from "./ui/separator";
import { useToast } from "./ui/use-toast";
import { ToastAction } from "./ui/toast";

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  readTime: string;
  imageUrl: string;
  category: string;
  author: string;
  authorAvatar: string;
}

const BlogDetail = () => {
  const { postId } = useParams<{ postId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<Post[]>([]);
  const [liked, setLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [viewCount, setViewCount] = useState(
    Math.floor(Math.random() * 1000) + 100,
  );
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [likedComments, setLikedComments] = useState<Record<string, boolean>>(
    {},
  );

  // Fetch post from database by ID
  useEffect(() => {
    if (postId) {
      setLoading(true);
      const fetchPost = async () => {
        try {
          const fetchedPost = await getPost(postId);
          if (fetchedPost) {
            setPost({
              id: fetchedPost.id,
              title: fetchedPost.title,
              excerpt: fetchedPost.excerpt,
              content: fetchedPost.content,
              date: fetchedPost.date || new Date().toISOString(),
              readTime: fetchedPost.read_time || "5 min read",
              imageUrl: fetchedPost.image_url,
              category: fetchedPost.category,
              author: fetchedPost.author || "Admin User",
              authorAvatar:
                fetchedPost.author_avatar ||
                "https://api.dicebear.com/7.x/avataaars/svg?seed=Admin",
            });

            // Get related posts (same category)
            try {
              const { getPosts } = await import("@/lib/api");
              const allPosts = await getPosts();
              // Filter posts by category and exclude current post
              const related = allPosts
                .filter(
                  (p) => p.id !== postId && p.category === fetchedPost.category,
                )
                .slice(0, 3);
              setRelatedPosts(related);
            } catch (relatedErr) {
              console.error("Error fetching related posts:", relatedErr);
            }
          } else {
            setError("Post not found");
          }
        } catch (err) {
          console.error("Error fetching post:", err);
          setError("Failed to load post");
        } finally {
          setLoading(false);
        }
      };

      fetchPost();

      // Load like and bookmark state from localStorage
      try {
        const likedPosts = JSON.parse(
          localStorage.getItem("likedPosts") || "{}",
        );
        const bookmarkedPosts = JSON.parse(
          localStorage.getItem("bookmarkedPosts") || "{}",
        );

        if (likedPosts[postId]) setLiked(true);
        if (bookmarkedPosts[postId]) setBookmarked(true);

        // Load comments from localStorage
        const savedComments = JSON.parse(
          localStorage.getItem(`comments_${postId}`) || "[]",
        );
        setComments(savedComments);
      } catch (err) {
        console.error("Error loading interaction state:", err);
      }
    }
  }, [postId]);

  // Handle share button click
  const handleShare = () => {
    if (navigator.share && post) {
      navigator
        .share({
          title: post.title,
          text: post.excerpt,
          url: window.location.href,
        })
        .catch((err) => {
          console.error("Error sharing: ", err);
        });
    } else {
      // Fallback - copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link Copied!",
        description: "Post link copied to clipboard",
        className: "bg-primary text-primary-foreground",
        duration: 2000,
      });
    }
  };

  const handleLike = () => {
    setLiked(!liked);
    // Save like state to localStorage
    if (!postId) return;
    const likedPosts = JSON.parse(localStorage.getItem("likedPosts") || "{}");
    likedPosts[postId] = !liked;
    localStorage.setItem("likedPosts", JSON.stringify(likedPosts));

    if (!liked) {
      toast({
        title: "Post Liked",
        description: "This post has been added to your liked posts",
        className: "bg-rose-500 text-white",
        duration: 1500,
      });
    }
  };

  const handleBookmark = () => {
    setBookmarked(!bookmarked);
    // Save bookmark state to localStorage
    if (!postId) return;
    const bookmarkedPosts = JSON.parse(
      localStorage.getItem("bookmarkedPosts") || "{}",
    );
    bookmarkedPosts[postId] = !bookmarked;
    localStorage.setItem("bookmarkedPosts", JSON.stringify(bookmarkedPosts));

    toast({
      title: !bookmarked ? "Post Saved" : "Post Unsaved",
      description: !bookmarked
        ? "This post has been saved to your bookmarks"
        : "This post has been removed from your bookmarks",
      className: !bookmarked
        ? "bg-green-600 text-white"
        : "bg-slate-700 text-white",
      duration: 1500,
    });
  };

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    const newCommentObj = {
      id: Date.now().toString(),
      author: "You",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=You",
      content: newComment,
      date: "Just now",
      likes: 0,
    };

    const updatedComments = [newCommentObj, ...comments];
    setComments(updatedComments);
    setNewComment("");

    // Save comments to localStorage
    if (postId) {
      localStorage.setItem(
        `comments_${postId}`,
        JSON.stringify(updatedComments),
      );
    }
  };

  const handleCommentLike = (commentId: string) => {
    setLikedComments((prev) => {
      const newState = { ...prev, [commentId]: !prev[commentId] };
      return newState;
    });

    const updatedComments = comments.map((comment) => {
      if (comment.id === commentId) {
        return {
          ...comment,
          likes: likedComments[commentId]
            ? comment.likes - 1
            : comment.likes + 1,
        };
      }
      return comment;
    });

    setComments(updatedComments);

    // Save updated comments to localStorage
    if (postId) {
      localStorage.setItem(
        `comments_${postId}`,
        JSON.stringify(updatedComments),
      );
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "MMMM d, yyyy");
    } catch (e) {
      return dateString;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <div className="flex-grow flex items-center justify-center">
          <div className="animate-pulse flex flex-col items-center">
            <div className="h-8 w-64 bg-muted rounded mb-4"></div>
            <div className="h-4 w-32 bg-muted rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <div className="flex-grow flex flex-col items-center justify-center p-4">
          <h1 className="text-2xl font-bold mb-4">
            {error || "Post not found"}
          </h1>
          <p className="text-muted-foreground mb-6">
            The post you're looking for doesn't exist or has been removed.
          </p>
          <Button onClick={() => navigate("/")}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* SEO */}
      <PostSEO
        title={post.title}
        excerpt={post.excerpt}
        category={post.category}
        date={post.date}
        imageUrl={post.imageUrl}
        author={post.author}
        slug={postId}
      />

      {/* Header */}
      <Header />

      <main className="flex-grow">
        {/* Hero Section */}
        <div className="relative h-[40vh] md:h-[50vh] max-h-[500px] w-full overflow-hidden">
          <img
            src={post.imageUrl}
            alt={post.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              // Fallback image if the original fails to load
              const target = e.target as HTMLImageElement;
              target.src =
                "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=1200&q=80";
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-6 md:p-12">
            <Badge className="mb-4 self-start bg-primary hover:bg-primary/90 text-primary-foreground">
              {post.category}
            </Badge>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 max-w-4xl">
              {post.title}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-white/90">
              <div className="flex items-center gap-2">
                <Avatar className="h-8 w-8 border-2 border-white">
                  <AvatarImage src={post.authorAvatar} alt={post.author} />
                  <AvatarFallback>{post.author.charAt(0)}</AvatarFallback>
                </Avatar>
                <span>{post.author}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4" />
                <span>{formatDate(post.date)}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="h-4 w-4" />
                <span>{post.readTime}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Eye className="h-4 w-4" />
                <span>{viewCount} views</span>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-8">
              {/* Article Content */}
              <article className="bg-card rounded-xl shadow-sm overflow-hidden">
                <div className="p-6 md:p-10">
                  <div className="prose prose-lg dark:prose-invert max-w-none">
                    <p className="text-xl text-muted-foreground mb-8 leading-relaxed font-medium">
                      {post.excerpt}
                    </p>
                    <div dangerouslySetInnerHTML={{ __html: post.content }} />
                  </div>

                  {/* Tags */}
                  <div className="mt-8 pt-6 border-t">
                    <h4 className="text-sm font-medium mb-3">Tags</h4>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="outline">{post.category}</Badge>
                      <Badge variant="outline">Blog</Badge>
                      <Badge variant="outline">Tutorial</Badge>
                      <Badge variant="outline">Web</Badge>
                    </div>
                  </div>

                  {/* Engagement */}
                  <div className="mt-8 pt-6 border-t flex flex-wrap justify-between items-center">
                    <div className="flex items-center gap-4">
                      <Button
                        variant={liked ? "default" : "outline"}
                        size="sm"
                        onClick={handleLike}
                        className={
                          liked ? "bg-primary text-primary-foreground" : ""
                        }
                      >
                        <ThumbsUp className="mr-2 h-4 w-4" />
                        {liked ? "Liked" : "Like"}
                      </Button>
                      <Button variant="outline" size="sm" onClick={handleShare}>
                        <Share2 className="mr-2 h-4 w-4" /> Share
                      </Button>
                      <Button
                        variant={bookmarked ? "default" : "outline"}
                        size="sm"
                        onClick={handleBookmark}
                        className={
                          bookmarked ? "bg-primary text-primary-foreground" : ""
                        }
                      >
                        <Bookmark className="mr-2 h-4 w-4" />
                        {bookmarked ? "Saved" : "Save"}
                      </Button>
                    </div>
                    <Button onClick={() => navigate("/")}>
                      <ArrowLeft className="mr-2 h-4 w-4" /> Back to Articles
                    </Button>
                  </div>
                </div>
              </article>

              {/* Author Bio */}
              <div className="mt-8 bg-card rounded-xl shadow-sm overflow-hidden">
                <div className="p-6 md:p-8">
                  <h3 className="text-lg font-semibold mb-4">
                    About the Author
                  </h3>
                  <div className="flex items-start gap-4">
                    <Avatar className="h-16 w-16">
                      <AvatarImage src={post.authorAvatar} alt={post.author} />
                      <AvatarFallback>{post.author.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h4 className="text-xl font-medium">{post.author}</h4>
                      <p className="text-muted-foreground mt-2">
                        Professional writer and web developer with over 5 years
                        of experience creating content for technology blogs and
                        publications. Passionate about making complex topics
                        accessible to everyone.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Comments Section */}
              <div className="mt-8 bg-card rounded-xl shadow-sm overflow-hidden">
                <div className="p-6 md:p-8">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold">Comments</h3>
                    <Badge variant="outline" className="text-xs">
                      <MessageSquare className="h-3 w-3 mr-1" />{" "}
                      {comments.length} comments
                    </Badge>
                  </div>

                  {/* Comment Form */}
                  <form onSubmit={handleCommentSubmit} className="mb-8">
                    <textarea
                      className="w-full p-3 border rounded-md bg-background resize-none min-h-[100px]"
                      placeholder="Leave a comment..."
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      required
                    ></textarea>
                    <div className="mt-2 flex justify-end">
                      <Button type="submit" size="sm">
                        <MessageSquare className="mr-2 h-4 w-4" /> Post Comment
                      </Button>
                    </div>
                  </form>

                  {/* Comments List */}
                  <div className="space-y-6">
                    {comments.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground">
                        <p>No comments yet. Be the first to comment!</p>
                      </div>
                    ) : (
                      comments.map((comment, index) => (
                        <div
                          key={comment.id}
                          className={
                            index < comments.length - 1 ? "border-b pb-6" : ""
                          }
                        >
                          <div className="flex items-start gap-3">
                            <Avatar className="h-10 w-10">
                              <AvatarImage
                                src={comment.avatar}
                                alt={comment.author}
                              />
                              <AvatarFallback>
                                {comment.author.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="flex items-center gap-2">
                                <h4 className="font-medium">
                                  {comment.author}
                                </h4>
                                <span className="text-xs text-muted-foreground">
                                  {comment.date}
                                </span>
                              </div>
                              <p className="mt-2">{comment.content}</p>
                              <div className="mt-2 flex items-center gap-4">
                                <button className="text-xs text-muted-foreground hover:text-foreground">
                                  Reply
                                </button>
                                <button
                                  className={`text-xs ${likedComments[comment.id] ? "text-primary" : "text-muted-foreground"} hover:text-foreground flex items-center gap-1`}
                                  onClick={() => handleCommentLike(comment.id)}
                                >
                                  <ThumbsUp className="h-3 w-3" />{" "}
                                  {comment.likes}
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-4">
              {/* Related Posts */}
              <div className="bg-card rounded-xl shadow-sm overflow-hidden sticky top-24">
                <div className="p-6">
                  <h3 className="text-lg font-semibold mb-4">
                    Related Articles
                  </h3>
                  <div className="space-y-4">
                    {relatedPosts.length > 0 ? (
                      relatedPosts.map((relatedPost) => (
                        <Card
                          key={relatedPost.id}
                          className="overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
                          onClick={() => navigate(`/post/${relatedPost.id}`)}
                        >
                          <div className="h-32 overflow-hidden">
                            <img
                              src={relatedPost.image_url}
                              alt={relatedPost.title}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                // Fallback image if the original fails to load
                                const target = e.target as HTMLImageElement;
                                target.src =
                                  "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=1200&q=80";
                              }}
                            />
                          </div>
                          <CardContent className="p-4">
                            <h4 className="font-medium line-clamp-2 hover:text-primary transition-colors">
                              {relatedPost.title}
                            </h4>
                            <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
                              <span>{relatedPost.category}</span>
                              <span>
                                {relatedPost.date
                                  ? formatDate(relatedPost.date)
                                  : ""}
                              </span>
                            </div>
                          </CardContent>
                        </Card>
                      ))
                    ) : (
                      <div className="text-center py-8 text-muted-foreground">
                        <p>No related articles found</p>
                      </div>
                    )}
                  </div>

                  {/* Newsletter Signup */}
                  <div className="mt-8 pt-6 border-t">
                    <h3 className="text-lg font-semibold mb-4">
                      Subscribe to Our Newsletter
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Get the latest articles and resources sent straight to
                      your inbox.
                    </p>
                    <form
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
                            localStorage.getItem("newsletter_subscribers") ||
                              "[]",
                          );
                          const existingSubscriber = subscribers.find(
                            (s) => s.email === email,
                          );

                          if (!existingSubscriber) {
                            subscribers.push({
                              id: Date.now().toString(),
                              email,
                              date: new Date().toLocaleDateString(),
                              source: `blog_post_${postId}`,
                            });
                            localStorage.setItem(
                              "newsletter_subscribers",
                              JSON.stringify(subscribers),
                            );
                            toast({
                              title: "Subscription Successful!",
                              description:
                                "Thank you for subscribing to our newsletter!",
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
                              <ToastAction altText="Try again">
                                Try again
                              </ToastAction>
                            ),
                          });
                        }
                      }}
                      className="space-y-2"
                    >
                      <input
                        type="email"
                        placeholder="Your email address"
                        className="w-full p-2 border rounded-md bg-background"
                        required
                      />
                      <Button type="submit" className="w-full">
                        Subscribe
                      </Button>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default BlogDetail;
