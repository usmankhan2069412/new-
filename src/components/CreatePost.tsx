import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";
import { createPost, getPost, updatePost } from "@/lib/api";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Upload, Image as ImageIcon } from "lucide-react";

const CreatePost = () => {
  const navigate = useNavigate();
  const { postId } = useParams<{ postId: string }>();
  const [formData, setFormData] = useState({
    title: "",
    excerpt: "",
    content: "",
    category: "",
    imageUrl: "",
  });
  const [previewImage, setPreviewImage] = useState("");
  const [isEditMode, setIsEditMode] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loadingPost, setLoadingPost] = useState(false);

  // Fetch post data if in edit mode
  useEffect(() => {
    if (postId) {
      setIsEditMode(true);
      setLoadingPost(true);
      const fetchPost = async () => {
        try {
          const post = await getPost(postId);
          if (post) {
            setFormData({
              title: post.title || "",
              excerpt: post.excerpt || "",
              content: post.content || "",
              category: post.category || "",
              imageUrl: post.image_url || "",
            });
            setPreviewImage(post.image_url || "");
          } else {
            setError("Post not found");
            navigate("/admin");
          }
        } catch (err) {
          console.error("Error fetching post:", err);
          setError("Failed to load post");
        } finally {
          setLoadingPost(false);
        }
      };
      fetchPost();
    }
  }, [postId, navigate]);

  const categories = [
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

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCategoryChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      category: value,
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const imageUrl = e.target.value;
    setFormData((prev) => ({
      ...prev,
      imageUrl,
    }));
    setPreviewImage(imageUrl);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      if (isEditMode && postId) {
        // Update existing post
        await updatePost(postId, {
          title: formData.title,
          excerpt: formData.excerpt,
          content: formData.content,
          category: formData.category,
          image_url: formData.imageUrl,
        });
        alert("Post updated successfully!");
      } else {
        // Create new post
        await createPost({
          title: formData.title,
          excerpt: formData.excerpt,
          content: formData.content,
          category: formData.category,
          image_url: formData.imageUrl,
          author: "Admin User",
          author_avatar:
            "https://api.dicebear.com/7.x/avataaars/svg?seed=Admin",
          read_time: "5 min read", // This will be calculated in the API
          date: new Date().toISOString(),
        });
        alert("Post published successfully!");
      }
      navigate("/admin");
    } catch (err) {
      console.error("Error creating post:", err);
      setError("Failed to publish post. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {loadingPost ? (
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-muted rounded w-1/3"></div>
            <div className="h-64 bg-muted rounded"></div>
          </div>
        ) : (
          <Card className="bg-white shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl font-bold">
                {isEditMode ? "Edit Blog Post" : "Create New Blog Post"}
              </CardTitle>
              <CardDescription>
                {isEditMode
                  ? "Update your blog post with the form below."
                  : "Fill out the form below to create a new blog post for your readers."}
              </CardDescription>
            </CardHeader>

            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    name="title"
                    placeholder="Enter a compelling title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                    className="w-full"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="excerpt">Excerpt</Label>
                  <Textarea
                    id="excerpt"
                    name="excerpt"
                    placeholder="Write a short summary of your post"
                    value={formData.excerpt}
                    onChange={handleChange}
                    required
                    className="w-full h-20"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="content">Content</Label>
                  <Textarea
                    id="content"
                    name="content"
                    placeholder="Write your blog post content here"
                    value={formData.content}
                    onChange={handleChange}
                    required
                    className="w-full h-64"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Select
                      value={formData.category}
                      onValueChange={handleCategoryChange}
                      required
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="imageUrl">Featured Image URL</Label>
                    <Input
                      id="imageUrl"
                      name="imageUrl"
                      type="url"
                      placeholder="https://example.com/image.jpg"
                      value={formData.imageUrl}
                      onChange={handleImageChange}
                      required
                      className="w-full"
                    />
                  </div>
                </div>

                {previewImage && (
                  <div className="mt-4">
                    <Label>Image Preview</Label>
                    <div className="mt-2 relative rounded-lg overflow-hidden h-48 bg-muted flex items-center justify-center">
                      {previewImage ? (
                        <img
                          src={previewImage}
                          alt="Preview"
                          className="w-full h-full object-cover"
                          onError={() => setPreviewImage("")}
                        />
                      ) : (
                        <div className="flex flex-col items-center text-muted-foreground">
                          <ImageIcon className="h-10 w-10 mb-2" />
                          <span>Image preview will appear here</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>

              <CardFooter className="flex justify-between border-t p-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/admin")}
                >
                  Cancel
                </Button>
                {error && (
                  <div className="text-destructive text-sm">{error}</div>
                )}
                <Button
                  type="submit"
                  className="bg-primary text-white"
                  disabled={isSubmitting}
                >
                  <Upload className="mr-2 h-4 w-4" />
                  {isSubmitting
                    ? isEditMode
                      ? "Updating..."
                      : "Publishing..."
                    : isEditMode
                      ? "Update Post"
                      : "Publish Post"}
                </Button>
              </CardFooter>
            </form>
          </Card>
        )}
      </div>
    </div>
  );
};

export default CreatePost;
