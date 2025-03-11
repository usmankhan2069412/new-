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
import { useToast } from "./ui/use-toast";

const CreatePost = () => {
  const navigate = useNavigate();
  const { postId } = useParams<{ postId: string }>();
  const { toast } = useToast();
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
      name: "Technology Review",
      title: "The Future of AI in Content Creation: 2024 Trends",
      excerpt:
        "Discover how artificial intelligence is revolutionizing content creation and what trends to watch for in the coming year.",
      content: `<h2>Introduction</h2>
<p>Artificial intelligence has rapidly transformed how we create, edit, and distribute content. In this article, we'll explore the latest AI trends in content creation and what they mean for creators, marketers, and businesses.</p>

<h2>Current State of AI in Content</h2>
<p>Today's AI tools can generate articles, create images, edit videos, and even compose music with minimal human input. Let's examine the current landscape:</p>

<h3>Text Generation</h3>
<p>Large language models like GPT-4 and Claude have become increasingly sophisticated at generating human-like text across various formats and styles...</p>

<h3>Image and Video Creation</h3>
<p>Tools like DALL-E, Midjourney, and Runway ML are revolutionizing visual content creation with their ability to generate and edit images and videos from text prompts...</p>

<h2>Emerging Trends for 2024</h2>
<p>As we look ahead, several key trends are emerging that will shape the future of AI-powered content creation:</p>

<h3>1. Multimodal AI Systems</h3>
<p>The integration of text, image, audio, and video capabilities into unified AI systems is creating more versatile content creation tools...</p>

<h3>2. Personalization at Scale</h3>
<p>AI is enabling hyper-personalized content tailored to individual preferences and behaviors...</p>

<h3>3. Ethical AI and Authenticity</h3>
<p>As AI-generated content becomes more prevalent, there's growing emphasis on transparency, attribution, and ethical use...</p>

<h2>Challenges and Considerations</h2>
<p>Despite the exciting possibilities, several challenges remain:</p>
<ul>
<li>Copyright and intellectual property concerns</li>
<li>Potential for misinformation and deepfakes</li>
<li>Impact on creative professions</li>
<li>Quality control and fact-checking</li>
</ul>

<h2>Conclusion</h2>
<p>AI is not replacing human creativity but rather augmenting it in powerful new ways. The most successful content strategies will blend AI efficiency with human creativity, emotional intelligence, and ethical judgment.</p>`,
      category: "Technology",
      imageUrl:
        "https://images.unsplash.com/photo-1677442135136-760c813028c4?w=1200&q=80",
    },
    {
      name: "Design Case Study",
      title: "Redesigning a Financial App for Better User Engagement",
      excerpt:
        "How we transformed a complex financial application into an intuitive, engaging experience that increased user retention by 45%.",
      content: `<h2>Project Overview</h2>
<p>Our client, a fintech startup offering personal finance management tools, was struggling with user engagement and retention. This case study details our approach to redesigning their mobile application.</p>

<h2>The Challenge</h2>
<p>The client faced several challenges:</p>
<ul>
<li>High drop-off rate during onboarding (67%)</li>
<li>Low feature discovery and usage</li>
<li>Poor user satisfaction scores (NPS of 12)</li>
<li>Complex information architecture</li>
</ul>

<h2>Research Phase</h2>
<p>We conducted comprehensive user research including:</p>
<ul>
<li>User interviews with 24 current and former users</li>
<li>Competitive analysis of 8 similar applications</li>
<li>Heatmap and session recording analysis</li>
<li>Survey of 500+ target users</li>
</ul>

<h2>Key Insights</h2>
<p>Our research revealed several critical insights:</p>
<ul>
<li>Users were overwhelmed by data visualization without clear context</li>
<li>Financial terminology created barriers to understanding</li>
<li>Users wanted personalized insights, not just raw data</li>
<li>The value proposition wasn't clear during onboarding</li>
</ul>

<h2>Design Solutions</h2>
<p>Based on our research, we implemented the following changes:</p>
<ul>
<li>Simplified onboarding with clear value communication</li>
<li>Redesigned dashboard with progressive disclosure of information</li>
<li>Added contextual education throughout the experience</li>
<li>Implemented personalized insights and recommendations</li>
<li>Created a consistent visual language for financial data</li>
</ul>

<h2>Results</h2>
<p>After launching the redesigned application:</p>
<ul>
<li>User retention increased by 45%</li>
<li>Onboarding completion rate improved from 33% to 78%</li>
<li>Feature engagement increased by 60%</li>
<li>NPS score rose from 12 to 48</li>
<li>Average session duration increased by 3.5 minutes</li>
</ul>

<h2>Conclusion</h2>
<p>This project demonstrates how user-centered design thinking can transform complex financial tools into engaging, valuable experiences that users return to regularly.</p>`,
      category: "Design",
      imageUrl:
        "https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=1200&q=80",
    },
    {
      name: "UX Research",
      title: "The Psychology of Color in Digital Interfaces",
      excerpt:
        "An evidence-based exploration of how color choices impact user perception, emotion, and behavior in digital products.",
      content: `<h2>Introduction</h2>
<p>Color is one of the most powerful tools in a designer's toolkit, influencing user perception, emotion, and behavior in subtle but significant ways. This article explores the psychological impact of color in digital interfaces and how to leverage this knowledge in UX design.</p>

<h2>The Science of Color Perception</h2>
<p>Before diving into applications, it's important to understand how humans perceive and process color:</p>
<ul>
<li>Color perception is both physiological and psychological</li>
<li>Cultural and personal experiences shape color associations</li>
<li>Color can affect cognitive load and information processing</li>
<li>Accessibility considerations are essential for inclusive design</li>
</ul>

<h2>Emotional Impact of Colors</h2>
<p>Research has consistently shown that colors evoke emotional responses, though these can vary by culture and context:</p>

<h3>Blue: Trust and Calm</h3>
<p>Blue is widely used in financial and healthcare applications due to its associations with trust, reliability, and calmness. Studies show that blue interfaces can reduce perceived wait times and anxiety...</p>

<h3>Red: Urgency and Importance</h3>
<p>Red captures attention and creates a sense of urgency. It's effective for error states, notifications, and calls-to-action that require immediate attention...</p>

<h3>Green: Success and Growth</h3>
<p>Green signals safety, success, and permission to proceed. It's commonly used for confirmation messages, progress indicators, and positive feedback...</p>

<h2>Color in Decision-Making</h2>
<p>Color influences not just how users feel, but how they act:</p>
<ul>
<li>A/B testing shows that button color can significantly impact conversion rates</li>
<li>Color contrast affects perceived importance of information</li>
<li>Color coding can reduce cognitive load when processing complex information</li>
<li>Strategic use of accent colors can guide user attention through an interface</li>
</ul>

<h2>Practical Applications</h2>
<p>Based on research findings, here are evidence-based strategies for using color in UX design:</p>

<h3>Creating Color Hierarchies</h3>
<p>Use color to establish clear visual hierarchies that guide users through interfaces in the intended order...</p>

<h3>Designing for Accessibility</h3>
<p>Ensure sufficient color contrast and never rely solely on color to communicate important information...</p>

<h3>Building Consistent Color Systems</h3>
<p>Develop systematic approaches to color that create predictable patterns for users...</p>

<h2>Conclusion</h2>
<p>Color is far more than decoration in digital interfaces—it's a powerful communication tool that affects how users perceive, feel about, and interact with digital products. By understanding the psychological principles behind color perception, designers can make more informed decisions that enhance usability and user satisfaction.</p>`,
      category: "UX Design",
      imageUrl:
        "https://images.unsplash.com/photo-1581287053822-fd7bf4f4bfec?w=1200&q=80",
    },
    {
      name: "Architecture Guide",
      title: "Microservices vs. Monoliths: Choosing the Right Architecture",
      excerpt:
        "A comprehensive guide to evaluating when microservices make sense and when a monolithic architecture might be the better choice.",
      content: `<h2>Introduction</h2>
<p>The debate between microservices and monolithic architectures continues to be a central discussion in software design. This article provides a framework for making this critical architectural decision based on your specific context and requirements.</p>

<h2>Understanding the Architectures</h2>

<h3>Monolithic Architecture</h3>
<p>A monolithic architecture is a unified codebase where all components of an application are interconnected and interdependent:</p>
<ul>
<li>Single deployment unit</li>
<li>Shared database</li>
<li>Tightly coupled components</li>
<li>Simpler development workflow</li>
</ul>

<h3>Microservices Architecture</h3>
<p>Microservices architecture breaks an application into smaller, independent services that communicate via APIs:</p>
<ul>
<li>Multiple deployment units</li>
<li>Decentralized data management</li>
<li>Loosely coupled services</li>
<li>Complex orchestration</li>
</ul>

<h2>Decision Framework</h2>
<p>Consider these factors when choosing between architectures:</p>

<h3>Team Structure and Size</h3>
<p>Small teams often benefit from the simplicity of monoliths, while larger organizations can leverage microservices to enable parallel development across multiple teams...</p>

<h3>Business Domain Complexity</h3>
<p>Complex domains with clear bounded contexts are good candidates for microservices, while simpler domains may not justify the overhead...</p>

<h3>Scalability Requirements</h3>
<p>If different components of your application have vastly different scaling needs, microservices allow for targeted scaling...</p>

<h3>Deployment and Release Frequency</h3>
<p>Microservices excel when you need to update specific components frequently without disrupting the entire system...</p>

<h2>Common Pitfalls</h2>

<h3>Premature Microservices</h3>
<p>One of the most common mistakes is adopting microservices too early, before domain boundaries are well understood...</p>

<h3>Distributed Monoliths</h3>
<p>Creating microservices that are still tightly coupled results in the worst of both worlds: the complexity of distribution without the benefits of independence...</p>

<h2>Migration Strategies</h2>
<p>If you're considering transitioning from a monolith to microservices:</p>
<ul>
<li>Start with the strangler pattern to gradually replace functionality</li>
<li>Identify clear domain boundaries before extracting services</li>
<li>Build a solid DevOps foundation first</li>
<li>Consider the modular monolith as an intermediate step</li>
</ul>

<h2>Conclusion</h2>
<p>There is no universally correct choice between microservices and monoliths. The right architecture depends on your specific context, team structure, business domain, and operational capabilities. By carefully evaluating these factors, you can make an informed decision that sets your project up for success.</p>`,
      category: "Architecture",
      imageUrl:
        "https://images.unsplash.com/photo-1607799279861-4dd421887fb3?w=1200&q=80",
    },
    {
      name: "Health Guide",
      title: "Digital Wellness: Managing Screen Time for Better Health",
      excerpt:
        "Evidence-based strategies to maintain physical and mental wellbeing in an increasingly digital world.",
      content: `<h2>Introduction</h2>
<p>As digital devices become increasingly central to our work and personal lives, finding a healthy balance has become essential for wellbeing. This article explores research-backed approaches to managing screen time and mitigating its potential negative effects.</p>

<h2>Understanding Digital Impact on Health</h2>
<p>Extended screen time has been associated with several health concerns:</p>
<ul>
<li>Digital eye strain and disrupted sleep patterns</li>
<li>Sedentary behavior and associated physical health issues</li>
<li>Potential impacts on mental health and attention</li>
<li>Effects on social connections and relationships</li>
</ul>

<h2>Physical Wellness Strategies</h2>

<h3>The 20-20-20 Rule</h3>
<p>Ophthalmologists recommend that for every 20 minutes of screen time, look at something 20 feet away for 20 seconds. This simple practice can significantly reduce eye strain...</p>

<h3>Ergonomic Considerations</h3>
<p>Proper posture and workspace setup are crucial for preventing musculoskeletal problems associated with device use...</p>

<h3>Movement Integration</h3>
<p>Incorporating regular movement breaks can counteract the negative effects of prolonged sitting...</p>

<h2>Mental Wellness Approaches</h2>

<h3>Digital Boundaries</h3>
<p>Creating clear boundaries between work and personal digital use helps maintain mental clarity and reduce burnout...</p>

<h3>Mindful Technology Use</h3>
<p>Practicing mindfulness about how and why we use technology can transform our relationship with digital tools...</p>

<h3>Digital Sabbaticals</h3>
<p>Regular periods of disconnection, from brief daily breaks to longer digital detoxes, provide mental space for recovery...</p>

<h2>Practical Implementation</h2>

<h3>Technology-Assisted Moderation</h3>
<p>Ironically, technology itself offers solutions for healthier technology use:</p>
<ul>
<li>Screen time tracking apps provide awareness of usage patterns</li>
<li>Blue light filters and night mode settings protect sleep quality</li>
<li>Focus apps and notification management reduce digital distractions</li>
<li>Automation tools can reduce unnecessary screen time</li>
</ul>

<h3>Creating a Sustainable Plan</h3>
<p>Rather than attempting dramatic changes, consider these approaches for lasting habits:</p>
<ul>
<li>Start with small, consistent changes to build momentum</li>
<li>Design your environment to support healthier digital habits</li>
<li>Develop replacement activities for excessive screen time</li>
<li>Use social accountability to maintain new habits</li>
</ul>

<h2>Conclusion</h2>
<p>Digital wellness isn't about rejecting technology, but rather developing a thoughtful, intentional relationship with our devices. By implementing these evidence-based strategies, we can enjoy the benefits of our digital tools while protecting our physical and mental wellbeing.</p>`,
      category: "Health",
      imageUrl:
        "https://images.unsplash.com/photo-1545205597-3d9d02c29597?w=1200&q=80",
    },
    {
      name: "Soft Skills",
      title:
        "Effective Communication in Remote Teams: Bridging the Digital Divide",
      excerpt:
        "Strategies and best practices for maintaining clear, empathetic communication in distributed work environments.",
      content: `<h2>Introduction</h2>
<p>Remote work has transformed from an occasional perk to a standard operating model for many organizations. While this shift offers numerous benefits, it also presents unique communication challenges. This article explores evidence-based strategies for effective communication in remote and hybrid teams.</p>

<h2>The Remote Communication Challenge</h2>
<p>Remote work environments introduce several communication hurdles:</p>
<ul>
<li>Absence of non-verbal cues and body language</li>
<li>Asynchronous communication across time zones</li>
<li>Reduced spontaneous interaction</li>
<li>Technology barriers and digital fatigue</li>
<li>Cultural and contextual differences</li>
</ul>

<h2>Building Communication Foundations</h2>

<h3>Establishing Communication Norms</h3>
<p>Clear team agreements about communication channels and expectations create a foundation for effective collaboration:</p>
<ul>
<li>Which channels to use for different types of communication</li>
<li>Expected response times for various message types</li>
<li>Meeting protocols and participation guidelines</li>
<li>Documentation standards and knowledge sharing practices</li>
</ul>

<h3>Choosing the Right Medium</h3>
<p>Different communication needs require different channels:</p>
<ul>
<li>Synchronous vs. asynchronous communication</li>
<li>Text-based vs. audio vs. video communication</li>
<li>Public vs. private communication</li>
<li>Formal vs. informal communication</li>
</ul>

<h2>Communication Skills for Remote Work</h2>

<h3>Writing with Clarity and Empathy</h3>
<p>In remote environments, written communication carries more weight:</p>
<ul>
<li>Be concise but complete</li>
<li>Structure messages for scanability</li>
<li>Consider tone and emotional context</li>
<li>Use formatting to enhance understanding</li>
</ul>

<h3>Active Listening in Digital Spaces</h3>
<p>Digital active listening requires intentional practices:</p>
<ul>
<li>Acknowledge messages promptly even if full response will come later</li>
<li>Ask clarifying questions</li>
<li>Summarize and reflect understanding</li>
<li>Pay attention to digital body language</li>
</ul>

<h3>Facilitating Effective Remote Meetings</h3>
<p>Remote meetings require more structure and facilitation than in-person gatherings:</p>
<ul>
<li>Clear agendas with pre-work when appropriate</li>
<li>Designated facilitators and timekeepers</li>
<li>Techniques for inclusive participation</li>
<li>Methods for capturing decisions and action items</li>
</ul>

<h2>Building Connection and Trust</h2>

<h3>Creating Psychological Safety</h3>
<p>Psychological safety becomes even more critical in remote environments where uncertainty is higher...</p>

<h3>Intentional Relationship Building</h3>
<p>Without organic water cooler moments, relationship building must become deliberate...</p>

<h2>Conclusion</h2>
<p>Effective remote communication doesn't happen by accident—it requires intentional design, consistent practice, and ongoing adaptation. By implementing these strategies, remote teams can overcome the digital divide to build strong, collaborative relationships that drive both performance and wellbeing.</p>`,
      category: "Soft Skills",
      imageUrl:
        "https://images.unsplash.com/photo-1552664730-d307ca884978?w=1200&q=80",
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
      name: "UX Design",
      url: "https://images.unsplash.com/photo-1581287053822-fd7bf4f4bfec?w=1200&q=80",
    },
    {
      name: "Architecture",
      url: "https://images.unsplash.com/photo-1607799279861-4dd421887fb3?w=1200&q=80",
    },
    {
      name: "Health",
      url: "https://images.unsplash.com/photo-1545205597-3d9d02c29597?w=1200&q=80",
    },
    {
      name: "Soft Skills",
      url: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=1200&q=80",
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

  const [categories, setCategories] = useState([
    "Web Development",
    "Technology",
    "Design",
    "UX Design",
    "Backend",
    "Architecture",
    "Lifestyle",
    "Travel",
    "Health",
  ]);

  // Load categories from localStorage
  useEffect(() => {
    try {
      const savedCategories = JSON.parse(
        localStorage.getItem("blog_categories") || "[]",
      );
      if (savedCategories.length > 0) {
        setCategories(savedCategories.map((cat) => cat.name));
      }
    } catch (err) {
      console.error("Error loading categories:", err);
    }
  }, []);

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
        toast({
          title: "Post Updated",
          description: "Your post has been updated successfully!",
          className: "bg-green-600 text-white",
        });
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
          // Check if supabase is available before trying to invoke the function
          const { supabase } = await import("@/lib/supabase");
          if (supabase && supabase.functions) {
            try {
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
            } catch (invokeErr) {
              console.error("Failed to invoke newsletter function:", invokeErr);
              // Don't block the post creation if newsletter fails
            }
          } else {
            console.log(
              "Supabase functions not available, skipping newsletter",
            );
          }
        } catch (newsletterErr) {
          console.error("Failed to send newsletter:", newsletterErr);
          // Don't block the post creation if newsletter fails
        }

        toast({
          title: "Post Published",
          description:
            "Your post has been published and newsletter sent to subscribers!",
          className: "bg-green-600 text-white",
        });
      }

      // Only navigate if there was no error
      navigate("/admin");
    } catch (err) {
      console.error("Error creating post:", err);
      setError("Failed to publish post. Please try again.");
      setIsSubmitting(false);
      return; // Don't navigate if there was an error
    }

    // Set submitting to false only if everything was successful
    setIsSubmitting(false);
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
