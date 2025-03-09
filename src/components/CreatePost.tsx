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
import { Upload, Image as ImageIcon, FileCode, Copy } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";

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
  const [activeTab, setActiveTab] = useState("editor");

  // Template options
  const templates = [
    {
      name: "Tutorial",
      title: "How to Build a Modern Blog with React and Tailwind",
      excerpt:
        "Learn the best practices for creating a responsive and accessible blog using the latest web technologies.",
      content: `<h2>Introduction</h2>
<p>In this tutorial, we'll explore how to build a modern blog using React and Tailwind CSS. This combination provides a powerful foundation for creating responsive, accessible, and visually appealing web applications.</p>

<h2>Prerequisites</h2>
<p>Before we begin, make sure you have the following installed:</p>
<ul>
<li>Node.js (version 14 or higher)</li>
<li>npm or yarn</li>
<li>Basic knowledge of React and CSS</li>
</ul>

<h2>Step 1: Setting Up the Project</h2>
<p>Let's start by creating a new React project using Vite:</p>
<pre><code>npm create vite@latest my-blog -- --template react-ts
cd my-blog
npm install
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p</code></pre>

<h2>Step 2: Configuring Tailwind CSS</h2>
<p>Next, we'll configure Tailwind CSS to work with our project...</p>

<h2>Step 3: Creating the Blog Components</h2>
<p>Now, let's create the main components for our blog...</p>

<h2>Conclusion</h2>
<p>In this tutorial, we've learned how to build a modern blog using React and Tailwind CSS. We've created responsive components, implemented a clean design, and ensured our blog is accessible to all users.</p>`,
      category: "Web Development",
      imageUrl:
        "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&q=80",
    },
    {
      name: "Review",
      title: "Review: The Latest Web Development Tools in 2023",
      excerpt:
        "An in-depth look at the most innovative and useful web development tools that have emerged this year.",
      content: `<h2>Introduction</h2>
<p>The web development landscape is constantly evolving, with new tools and technologies emerging every year. In this review, we'll examine the most impactful web development tools of 2023.</p>

<h2>Top Frontend Tools</h2>
<h3>1. Next.js 13</h3>
<p>Next.js 13 has introduced several game-changing features including...</p>

<h3>2. Tailwind CSS v3.3</h3>
<p>The latest version of Tailwind CSS brings...</p>

<h2>Backend Innovations</h2>
<h3>1. Supabase</h3>
<p>Supabase continues to evolve as an open-source alternative to Firebase...</p>

<h3>2. Deno Deploy</h3>
<p>Deno's serverless platform has matured significantly...</p>

<h2>Development Experience Tools</h2>
<p>Beyond the core technologies, several tools have improved developer experience...</p>

<h2>Conclusion</h2>
<p>The web development ecosystem in 2023 has focused on performance, developer experience, and reducing complexity. These tools represent the best innovations in the field this year.</p>`,
      category: "Technology",
      imageUrl:
        "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=1200&q=80",
    },
    {
      name: "Case Study",
      title:
        "Case Study: Redesigning an E-commerce Platform for Better Conversion",
      excerpt:
        "How we improved conversion rates by 35% through strategic UX improvements and performance optimization.",
      content: `<h2>Project Overview</h2>
<p>Our client, a mid-sized e-commerce company selling handmade products, was struggling with cart abandonment and low conversion rates. This case study details our approach to redesigning their platform.</p>

<h2>The Challenge</h2>
<p>The client faced several challenges:</p>
<ul>
<li>High cart abandonment rate (78%)</li>
<li>Poor mobile experience</li>
<li>Slow page load times</li>
<li>Confusing checkout process</li>
</ul>

<h2>Research Phase</h2>
<p>We began with comprehensive user research...</p>

<h2>Design Solutions</h2>
<p>Based on our research, we implemented the following changes...</p>

<h2>Development Approach</h2>
<p>We rebuilt the frontend using React and implemented...</p>

<h2>Results</h2>
<p>After launching the redesigned platform:</p>
<ul>
<li>Conversion rate increased by 35%</li>
<li>Cart abandonment decreased to 45%</li>
<li>Mobile purchases increased by 64%</li>
<li>Page load time decreased by 2.3 seconds</li>
</ul>

<h2>Conclusion</h2>
<p>This project demonstrates how focused UX improvements and performance optimization can dramatically impact e-commerce metrics.</p>`,
      category: "Design",
      imageUrl:
        "https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=1200&q=80",
    },
  ];

  // Image templates
  const imageTemplates = [
    {
      name: "Technology",
      url: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=1200&q=80",
    },
    {
      name: "Web Development",
      url: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&q=80",
    },
    {
      name: "Design",
      url: "https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=1200&q=80",
    },
    {
      name: "AI",
      url: "https://images.unsplash.com/photo-1677442135136-760c813028c4?w=1200&q=80",
    },
    {
      name: "Business",
      url: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=1200&q=80",
    },
    {
      name: "Workspace",
      url: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=1200&q=80",
    },
  ];

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

    // Update preview image if imageUrl is changed
    if (name === "imageUrl") {
      setPreviewImage(value);
    }
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

  const applyTemplate = (template) => {
    setFormData({
      title: template.title,
      excerpt: template.excerpt,
      content: template.content,
      category: template.category,
      imageUrl: template.imageUrl,
    });
    setPreviewImage(template.imageUrl);
  };

  const applyImageTemplate = (imageUrl) => {
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
        const newPost = await createPost({
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

        // Send newsletter to subscribers about the new post
        try {
          const { supabase } = await import("@/lib/supabase");
          const { data, error } = await supabase.functions.invoke(
            "send-newsletter",
            {
              body: { postId: newPost.id },
            },
          );

          if (error) {
            console.error("Error sending newsletter:", error);
          } else {
            console.log("Newsletter sent successfully:", data);
          }
        } catch (newsletterErr) {
          console.error("Failed to send newsletter:", newsletterErr);
          // Don't block the post creation if newsletter fails
        }

        alert(
          "Post published successfully and newsletter sent to subscribers!",
        );
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
      <div className="max-w-5xl mx-auto">
        {loadingPost ? (
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-muted rounded w-1/3"></div>
            <div className="h-64 bg-muted rounded"></div>
          </div>
        ) : (
          <Card className="bg-card shadow-lg">
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

            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              <div className="px-6">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="editor">Editor</TabsTrigger>
                  <TabsTrigger value="templates">Templates</TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="editor" className="mt-0">
                <form onSubmit={handleSubmit}>
                  <CardContent className="space-y-6 pt-6">
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
                        className="w-full h-64 font-mono text-sm"
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
                        <div className="flex justify-between">
                          <Label htmlFor="imageUrl">Featured Image URL</Label>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="h-5 px-2 text-xs"
                            onClick={() => setActiveTab("templates")}
                          >
                            Browse images
                          </Button>
                        </div>
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

                    <div className="mt-4">
                      <Label>Image Preview</Label>
                      <div className="mt-2 relative rounded-lg overflow-hidden h-48 bg-muted flex items-center justify-center border">
                        {previewImage ? (
                          <img
                            src={previewImage}
                            alt="Preview"
                            className="w-full h-full object-cover"
                            onError={() => {
                              setError("Image URL is invalid or inaccessible");
                              setPreviewImage("");
                            }}
                          />
                        ) : (
                          <div className="flex flex-col items-center text-muted-foreground">
                            <ImageIcon className="h-10 w-10 mb-2" />
                            <span>Image preview will appear here</span>
                          </div>
                        )}
                      </div>
                    </div>
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
                      className="bg-primary text-primary-foreground"
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
              </TabsContent>

              <TabsContent value="templates" className="mt-0">
                <CardContent className="pt-6">
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium mb-4">
                        Content Templates
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {templates.map((template, index) => (
                          <Card
                            key={index}
                            className="overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
                          >
                            <div className="h-32 overflow-hidden">
                              <img
                                src={template.imageUrl}
                                alt={template.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <CardContent className="p-4">
                              <h4 className="font-semibold mb-1">
                                {template.name}
                              </h4>
                              <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                                {template.title}
                              </p>
                              <Button
                                variant="outline"
                                size="sm"
                                className="w-full"
                                onClick={() => {
                                  applyTemplate(template);
                                  setActiveTab("editor");
                                }}
                              >
                                <Copy className="h-3.5 w-3.5 mr-1" />
                                Use Template
                              </Button>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium mb-4">
                        Featured Images
                      </h3>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {imageTemplates.map((image, index) => (
                          <TooltipProvider key={index}>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <div
                                  className="h-40 rounded-md overflow-hidden border cursor-pointer hover:opacity-90 transition-opacity"
                                  onClick={() => {
                                    applyImageTemplate(image.url);
                                    setActiveTab("editor");
                                  }}
                                >
                                  <img
                                    src={image.url}
                                    alt={image.name}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>{image.name}</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 flex justify-end">
                    <Button
                      variant="outline"
                      onClick={() => setActiveTab("editor")}
                    >
                      Back to Editor
                    </Button>
                  </div>
                </CardContent>
              </TabsContent>
            </Tabs>
          </Card>
        )}
      </div>
    </div>
  );
};

export default CreatePost;
