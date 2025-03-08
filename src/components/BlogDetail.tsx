import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { Calendar, Clock, ArrowLeft, Share2 } from "lucide-react";
import Header from "./Header";
import PostSEO from "./PostSEO.jsx";
import { Badge } from "./ui/badge";

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
  const [post, setPost] = React.useState<BlogPost | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  // Mock data for blog posts - in a real app, this would come from an API
  const blogPosts: BlogPost[] = [
    {
      id: "1",
      title: "How to Build a Modern Blog with React and Tailwind",
      excerpt:
        "Learn the best practices for creating a responsive and accessible blog using the latest web technologies.",
      content: `<p>Building a modern blog requires a combination of the right technologies and design principles. React provides the perfect foundation for creating interactive UI components, while Tailwind CSS offers a utility-first approach to styling that makes it easy to create a consistent, responsive design.</p>

<h2>Setting Up Your Project</h2>
<p>Start by creating a new React project using Create React App or Vite, then install Tailwind CSS and configure it according to the official documentation. This will give you a solid foundation to build upon.</p>

<pre><code>npm create vite@latest my-blog -- --template react-ts
cd my-blog
npm install
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p</code></pre>

<h2>Creating Reusable Components</h2>
<p>One of the key advantages of React is the ability to create reusable components. For a blog, you might want to create components for:</p>
<ul>
<li>Header and navigation</li>
<li>Blog post cards</li>
<li>Featured post section</li>
<li>Category filters</li>
<li>Search functionality</li>
<li>Pagination</li>
</ul>

<p>By breaking your UI into these smaller, reusable pieces, you'll make your code more maintainable and easier to update in the future.</p>

<h2>Responsive Design Principles</h2>
<p>When designing your blog, it's important to consider how it will look on different devices. Tailwind makes this easy with its responsive utility classes. Here are some tips:</p>
<ul>
<li>Use a mobile-first approach</li>
<li>Implement a flexible grid system</li>
<li>Optimize images for different screen sizes</li>
<li>Ensure text is readable on all devices</li>
</ul>

<h2>Accessibility Considerations</h2>
<p>Making your blog accessible to all users is not just good practice—it's essential. Here are some ways to improve accessibility:</p>
<ul>
<li>Use semantic HTML elements</li>
<li>Add proper alt text to images</li>
<li>Ensure sufficient color contrast</li>
<li>Make your site keyboard navigable</li>
<li>Test with screen readers</li>
</ul>

<h2>Performance Optimization</h2>
<p>A fast-loading blog provides a better user experience and can improve your search engine rankings. Consider these optimization techniques:</p>
<ul>
<li>Lazy load images and components</li>
<li>Implement code splitting</li>
<li>Minimize HTTP requests</li>
<li>Use a content delivery network (CDN)</li>
<li>Optimize your build for production</li>
</ul>

<p>By following these best practices, you'll be well on your way to creating a modern, responsive, and accessible blog using React and Tailwind CSS.</p>`,
      date: "April 15, 2023",
      readTime: "8 min read",
      imageUrl:
        "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&q=80",
      category: "Web Development",
      author: "Alex Johnson",
      authorAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex",
    },
    {
      id: "2",
      title: "The Future of AI in Content Creation",
      excerpt:
        "Explore how artificial intelligence is transforming the way we create and consume content online.",
      content: `<p>Artificial Intelligence is revolutionizing content creation in ways we couldn't have imagined just a few years ago. From automated writing assistants to AI-generated images and videos, the landscape of digital content is rapidly evolving.</p>

<h2>AI Writing Tools</h2>
<p>AI writing tools like GPT-4 are becoming increasingly sophisticated, capable of generating human-like text across a variety of styles and formats. These tools can help content creators:</p>
<ul>
<li>Generate ideas and outlines</li>
<li>Overcome writer's block</li>
<li>Create first drafts quickly</li>
<li>Optimize content for SEO</li>
<li>Translate content into multiple languages</li>
</ul>

<p>While these tools won't replace human creativity, they can significantly enhance productivity and help creators focus on higher-level tasks.</p>

<h2>AI-Generated Images and Graphics</h2>
<p>Tools like DALL-E, Midjourney, and Stable Diffusion have made it possible to generate stunning images from text descriptions. This technology is being used to:</p>
<ul>
<li>Create unique illustrations for articles</li>
<li>Design custom graphics for social media</li>
<li>Generate product mockups</li>
<li>Visualize concepts quickly</li>
</ul>

<p>These tools are democratizing visual content creation, allowing those without traditional design skills to bring their ideas to life.</p>

<h2>Video Generation and Editing</h2>
<p>AI is also making inroads in video content creation. New tools can:</p>
<ul>
<li>Generate video from text prompts</li>
<li>Automate editing processes</li>
<li>Create realistic avatars and presenters</li>
<li>Enhance video quality and resolution</li>
</ul>

<p>As these technologies mature, we can expect even more sophisticated video content creation tools to emerge.</p>

<h2>Personalized Content Experiences</h2>
<p>AI isn't just changing how content is created—it's also transforming how it's consumed. Recommendation algorithms can:</p>
<ul>
<li>Deliver highly personalized content feeds</li>
<li>Suggest relevant articles based on reading history</li>
<li>Adapt content presentation to individual preferences</li>
<li>Create dynamic content that changes based on user behavior</li>
</ul>

<h2>Ethical Considerations</h2>
<p>With these powerful new tools come important ethical questions:</p>
<ul>
<li>How do we attribute AI-generated content?</li>
<li>What happens to creative professionals whose work might be automated?</li>
<li>How do we prevent the spread of AI-generated misinformation?</li>
<li>Who owns the rights to content created with AI assistance?</li>
</ul>

<p>As we navigate this new frontier, it will be crucial to develop ethical frameworks and best practices for AI in content creation.</p>

<h2>The Human Element</h2>
<p>Despite these advances, the human element remains irreplaceable in content creation. AI tools work best when they enhance human creativity rather than replace it. The most successful content creators will be those who learn to collaborate effectively with AI, using it to amplify their unique voice and perspective.</p>

<p>The future of content creation is neither purely human nor purely artificial—it's a collaborative partnership that combines the best of both worlds.</p>`,
      date: "May 3, 2023",
      readTime: "10 min read",
      imageUrl:
        "https://images.unsplash.com/photo-1677442135136-760c813028c4?w=1200&q=80",
      category: "Technology",
      author: "Samantha Lee",
      authorAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Samantha",
    },
    {
      id: "3",
      title: "Designing for Accessibility: A Comprehensive Guide",
      excerpt:
        "Why accessibility matters and how to implement inclusive design principles in your next project.",
      content: `<p>Designing for accessibility isn't just about compliance with regulations—it's about creating products and experiences that can be used and enjoyed by everyone, regardless of their abilities or circumstances.</p>

<h2>Why Accessibility Matters</h2>
<p>Accessibility is important for several reasons:</p>
<ul>
<li>It ensures equal access to information and functionality</li>
<li>It improves usability for all users, not just those with disabilities</li>
<li>It expands your potential audience</li>
<li>It's often required by law in many countries</li>
<li>It's the right thing to do from an ethical standpoint</li>
</ul>

<h2>Understanding Different Types of Disabilities</h2>
<p>To design inclusively, it's important to understand the various types of disabilities and how they affect user interaction:</p>

<h3>Visual Impairments</h3>
<p>This includes blindness, low vision, and color blindness. Users with visual impairments may rely on screen readers, need high contrast text, or have difficulty distinguishing certain color combinations.</p>

<h3>Hearing Impairments</h3>
<p>Users who are deaf or hard of hearing need alternatives to audio content, such as captions for videos or transcripts for podcasts.</p>

<h3>Motor Disabilities</h3>
<p>People with limited mobility or dexterity may use keyboard navigation instead of a mouse, or may use specialized input devices. They benefit from larger click targets and keyboard-accessible interfaces.</p>

<h3>Cognitive Disabilities</h3>
<p>This broad category includes conditions like ADHD, dyslexia, and autism spectrum disorders. Clear, simple layouts, consistent navigation, and avoiding time constraints can help these users.</p>

<h2>Implementing Accessible Design</h2>

<h3>Semantic HTML</h3>
<p>Using the right HTML elements for their intended purpose provides built-in accessibility benefits:</p>
<ul>
<li>Use heading tags (h1-h6) to create a logical document structure</li>
<li>Use button elements for interactive controls</li>
<li>Use form labels properly associated with inputs</li>
<li>Use alt text for images</li>
</ul>

<h3>Keyboard Navigation</h3>
<p>Ensure that all functionality can be accessed using only a keyboard:</p>
<ul>
<li>Make sure focus states are visible</li>
<li>Maintain a logical tab order</li>
<li>Provide skip links to bypass repetitive navigation</li>
<li>Ensure custom components are keyboard accessible</li>
</ul>

<h3>Color and Contrast</h3>
<p>Color should never be the only way to convey information:</p>
<ul>
<li>Maintain sufficient contrast ratios (4.5:1 for normal text, 3:1 for large text)</li>
<li>Use additional indicators beyond color (icons, patterns, text)</li>
<li>Test your designs with color blindness simulators</li>
</ul>

<h3>Responsive Design</h3>
<p>Ensure your design works well at different zoom levels and on different devices:</p>
<ul>
<li>Use relative units (em, rem) instead of fixed pixel values</li>
<li>Test at 200% zoom</li>
<li>Ensure text remains readable when the viewport is resized</li>
</ul>

<h2>Testing for Accessibility</h2>
<p>Accessibility testing should be integrated throughout your design and development process:</p>
<ul>
<li>Use automated tools like Lighthouse or axe</li>
<li>Conduct keyboard-only testing</li>
<li>Test with screen readers</li>
<li>Involve users with disabilities in user testing</li>
</ul>

<h2>Beyond Compliance: Inclusive Design</h2>
<p>While meeting WCAG guidelines is important, truly inclusive design goes beyond compliance. It considers the full range of human diversity and creates experiences that can adapt to different needs and preferences.</p>

<p>By embracing accessibility as a core design principle rather than an afterthought, you can create products that not only meet legal requirements but also provide a better experience for all users.</p>`,
      date: "June 12, 2023",
      readTime: "12 min read",
      imageUrl:
        "https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=1200&q=80",
      category: "Design",
      author: "Marcus Chen",
      authorAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Marcus",
    },
    {
      id: "4",
      title: "Optimizing React Performance: Tips and Tricks",
      excerpt:
        "Advanced techniques to make your React applications faster and more efficient.",
      content: `<p>React is known for its virtual DOM and efficient rendering, but as applications grow in complexity, performance can become an issue. This article explores advanced techniques to optimize your React applications for speed and efficiency.</p>

<h2>Understanding React's Rendering Process</h2>
<p>Before diving into optimization techniques, it's important to understand how React renders components:</p>
<ol>
<li>When state or props change, React creates a new virtual DOM representation</li>
<li>React compares this new virtual DOM with the previous one (diffing)</li>
<li>React updates only the parts of the actual DOM that have changed</li>
</ol>
<p>Many performance issues stem from unnecessary re-renders, where this process happens more often than needed.</p>

<h2>Identifying Performance Issues</h2>
<p>Before optimizing, identify where the bottlenecks are:</p>
<ul>
<li>Use React DevTools Profiler to record and analyze component renders</li>
<li>Look for components that render frequently or take a long time to render</li>
<li>Check for cascading renders where one component update triggers many others</li>
</ul>

<h2>Preventing Unnecessary Re-renders</h2>

<h3>React.memo for Function Components</h3>
<p>Use React.memo to prevent re-rendering when props haven't changed:</p>
<pre><code>const MyComponent = React.memo(function MyComponent(props) {
  // Your component logic
});</code></pre>

<h3>shouldComponentUpdate and PureComponent for Class Components</h3>
<p>For class components, extend PureComponent instead of Component to get a shallow prop and state comparison:</p>
<pre><code>class MyComponent extends React.PureComponent {
  // Your component logic
}</code></pre>
<p>Or implement shouldComponentUpdate for more control:</p>
<pre><code>shouldComponentUpdate(nextProps, nextState) {
  // Return true if you want it to update
  return nextProps.value !== this.props.value;
}</code></pre>

<h3>Using the useCallback Hook</h3>
<p>Prevent function recreations with useCallback:</p>
<pre><code>const memoizedCallback = useCallback(
  () => {
    doSomething(a, b);
  },
  [a, b],
);</code></pre>

<h3>Using the useMemo Hook</h3>
<p>Cache expensive calculations with useMemo:</p>
<pre><code>const memoizedValue = useMemo(() => computeExpensiveValue(a, b), [a, b]);</code></pre>

<h2>State Management Optimization</h2>

<h3>Avoid State in Parent Components When Possible</h3>
<p>Keep state as close as possible to where it's used to prevent cascading renders.</p>

<h3>Use Context API Wisely</h3>
<p>Split your context into smaller, more focused contexts to prevent unnecessary renders when one part of the context changes.</p>

<h3>Consider State Management Libraries</h3>
<p>For complex applications, libraries like Redux, Zustand, or Jotai can help with more efficient state updates.</p>

<h2>Code Splitting and Lazy Loading</h2>
<p>Reduce your initial bundle size with code splitting:</p>
<pre><code>const LazyComponent = React.lazy(() => import('./LazyComponent'));

function MyComponent() {
  return (
    <React.Suspense fallback={<div>Loading...</div>}>
      <LazyComponent />
    </React.Suspense>
  );
}</code></pre>

<h2>Virtualization for Long Lists</h2>
<p>When rendering long lists, use virtualization libraries like react-window or react-virtualized to only render items that are currently visible:</p>
<pre><code>import { FixedSizeList } from 'react-window';

function MyList({ items }) {
  const Row = ({ index, style }) => (
    <div style={style}>{items[index]}</div>
  );

  return (
    <FixedSizeList
      height={500}
      width={300}
      itemCount={items.length}
      itemSize={35}
    >
      {Row}
    </FixedSizeList>
  );
}</code></pre>

<h2>Web Worker for CPU-Intensive Tasks</h2>
<p>Move CPU-intensive operations off the main thread using Web Workers:</p>
<pre><code>// In your component
const [result, setResult] = useState(null);

useEffect(() => {
  const worker = new Worker('./worker.js');
  worker.postMessage(data);
  worker.onmessage = (e) => {
    setResult(e.data);
    worker.terminate();
  };
  return () => worker.terminate();
}, [data]);</code></pre>

<h2>Production Build Optimizations</h2>
<p>Ensure you're using production builds which have optimizations enabled:</p>
<ul>
<li>Minification and dead code elimination</li>
<li>Tree shaking to remove unused code</li>
<li>Code splitting and lazy loading</li>
<li>Compression (gzip or brotli)</li>
</ul>

<h2>Measuring Impact</h2>
<p>After implementing optimizations, measure their impact:</p>
<ul>
<li>Use Lighthouse for overall performance metrics</li>
<li>Compare before and after profiles in React DevTools</li>
<li>Monitor real user metrics if possible</li>
</ul>

<p>Remember that premature optimization can lead to more complex, harder-to-maintain code. Always measure first, then optimize where it matters most.</p>`,
      date: "July 8, 2023",
      readTime: "15 min read",
      imageUrl:
        "https://images.unsplash.com/photo-1633356122102-3fe601e05bd2?w=1200&q=80",
      category: "Web Development",
      author: "Rachel Kim",
      authorAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Rachel",
    },
    {
      id: "5",
      title: "The Psychology of User Experience",
      excerpt:
        "Understanding how human psychology influences user behavior and decision-making in digital products.",
      content: `<p>User experience design isn't just about creating interfaces that look good—it's about understanding how people think, feel, and behave. By applying principles from psychology, designers can create more intuitive, engaging, and effective digital experiences.</p>

<h2>Cognitive Load Theory</h2>
<p>Cognitive load refers to the mental effort required to process information. Our working memory has limited capacity, so good UX design aims to reduce unnecessary cognitive load:</p>
<ul>
<li>Break complex tasks into smaller steps</li>
<li>Use progressive disclosure to reveal information as needed</li>
<li>Group related information visually</li>
<li>Use familiar patterns and conventions</li>
<li>Eliminate unnecessary elements and information</li>
</ul>

<h2>Gestalt Principles</h2>
<p>Gestalt psychology explains how we perceive and organize visual information. Key principles include:</p>

<h3>Proximity</h3>
<p>Elements placed close together are perceived as related. Use this to create logical groupings in your interfaces.</p>

<h3>Similarity</h3>
<p>Elements that look similar are perceived as related or having the same function. Use consistent styling for similar actions.</p>

<h3>Continuity</h3>
<p>Our eyes naturally follow lines or curves. Use this to guide users through a process or form.</p>

<h3>Closure</h3>
<p>We tend to perceive incomplete shapes as complete. This allows for more minimalist designs where users can "fill in the gaps."</p>

<h3>Figure-Ground</h3>
<p>We distinguish objects (figures) from their background. Use this to create clear hierarchies and focal points.</p>

<h2>Hick's Law</h2>
<p>Hick's Law states that the time it takes to make a decision increases with the number and complexity of choices. To apply this:</p>
<ul>
<li>Limit options to prevent choice paralysis</li>
<li>Use progressive disclosure for complex interfaces</li>
<li>Categorize options logically</li>
<li>Highlight recommended or popular choices</li>
</ul>

<h2>The Von Restorff Effect (Isolation Effect)</h2>
<p>The Von Restorff Effect states that items that stand out are more likely to be remembered. Use this to:</p>
<ul>
<li>Highlight important actions with contrasting colors</li>
<li>Make primary buttons visually distinct</li>
<li>Use animation sparingly to draw attention to key elements</li>
</ul>

<h2>The Serial Position Effect</h2>
<p>People tend to remember items at the beginning (primacy effect) and end (recency effect) of a list better than those in the middle. To leverage this:</p>
<ul>
<li>Place the most important information at the beginning or end of content</li>
<li>Put critical navigation items at the extremes of navigation bars</li>
<li>Consider the order of steps in multi-step processes</li>
</ul>

<h2>Social Proof</h2>
<p>We look to others for guidance on how to behave, especially in uncertain situations. Incorporate social proof by:</p>
<ul>
<li>Showing ratings and reviews</li>
<li>Displaying usage statistics ("10,000+ customers")</li>
<li>Featuring testimonials from satisfied users</li>
<li>Showing real-time activity ("15 people are viewing this now")</li>
</ul>

<h2>Loss Aversion</h2>
<p>People feel the pain of loss more strongly than the pleasure of gain. Apply this by:</p>
<ul>
<li>Framing benefits in terms of what users might lose by not taking action</li>
<li>Offering free trials that users won't want to give up</li>
<li>Using limited-time offers to create a sense of urgency</li>
</ul>

<h2>The Endowed Progress Effect</h2>
<p>People are more likely to complete a task if they feel they've already made progress. Use this by:</p>
<ul>
<li>Showing progress bars for multi-step processes</li>
<li>Pre-filling information when possible</li>
<li>Giving users a "head start" on loyalty programs</li>
</ul>

<h2>The Peak-End Rule</h2>
<p>People judge an experience based primarily on how they felt at its peak (most intense point) and its end. To create positive experiences:</p>
<ul>
<li>Design delightful moments at key points in the user journey</li>
<li>Ensure the completion of tasks ends on a positive note</li>
<li>Address pain points to prevent negative peaks</li>
</ul>

<h2>Ethical Considerations</h2>
<p>While understanding psychology can help create better user experiences, it's important to use these principles ethically:</p>
<ul>
<li>Design to help users achieve their goals, not just to drive business metrics</li>
<li>Be transparent about how you're using psychological principles</li>
<li>Avoid dark patterns that manipulate users against their best interests</li>
<li>Consider the potential impact on vulnerable populations</li>
</ul>

<p>By understanding the psychological principles that drive user behavior, designers can create experiences that feel intuitive and satisfying while helping users accomplish their goals more effectively.</p>`,
      date: "August 21, 2023",
      readTime: "14 min read",
      imageUrl:
        "https://images.unsplash.com/photo-1581287053822-fd7bf4f4bfec?w=1200&q=80",
      category: "UX Design",
      author: "David Patel",
      authorAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=David",
    },
    {
      id: "6",
      title: "Building a Serverless Backend for Your Blog",
      excerpt:
        "Step-by-step guide to creating a scalable and cost-effective backend using serverless technologies.",
      content: `<p>Serverless architecture has revolutionized how we build and deploy backend services. For content-heavy applications like blogs, serverless can provide scalability, cost-efficiency, and simplified operations. This guide will walk you through creating a serverless backend for your blog.</p>

<h2>Understanding Serverless Architecture</h2>
<p>Despite the name, serverless doesn't mean there are no servers—it means you don't have to manage them. Key benefits include:</p>
<ul>
<li>No server management or maintenance</li>
<li>Pay-per-use pricing model (only pay for what you use)</li>
<li>Automatic scaling based on demand</li>
<li>Reduced operational complexity</li>
<li>Built-in high availability</li>
</ul>

<h2>Choosing Your Serverless Platform</h2>
<p>Several cloud providers offer serverless platforms:</p>
<ul>
<li>AWS Lambda with API Gateway</li>
<li>Azure Functions</li>
<li>Google Cloud Functions</li>
<li>Cloudflare Workers</li>
<li>Vercel Functions</li>
<li>Netlify Functions</li>
</ul>
<p>For this guide, we'll focus on AWS, but the concepts apply across platforms.</p>

<h2>Designing Your Blog's Data Model</h2>
<p>Before building, plan your data model. A typical blog might include:</p>
<ul>
<li>Posts (title, content, author, date, tags, etc.)</li>
<li>Authors (name, bio, avatar, etc.)</li>
<li>Comments (content, author, date, etc.)</li>
<li>Categories/Tags</li>
</ul>

<h2>Setting Up Your Database</h2>
<p>For serverless applications, consider these database options:</p>

<h3>DynamoDB (AWS)</h3>
<p>A fully managed NoSQL database that pairs well with Lambda:</p>
<pre><code>// Example DynamoDB schema for blog posts
const params = {
  TableName: 'BlogPosts',
  KeySchema: [
    { AttributeName: 'id', KeyType: 'HASH' },  // Partition key
    { AttributeName: 'publishDate', KeyType: 'RANGE' }  // Sort key
  ],
  AttributeDefinitions: [
    { AttributeName: 'id', AttributeType: 'S' },
    { AttributeName: 'publishDate', AttributeType: 'S' },
    { AttributeName: 'author', AttributeType: 'S' }
  ],
  GlobalSecondaryIndexes: [
    {
      IndexName: 'AuthorIndex',
      KeySchema: [
        { AttributeName: 'author', KeyType: 'HASH' },
        { AttributeName: 'publishDate', KeyType: 'RANGE' }
      ],
      Projection: { ProjectionType: 'ALL' },
      ProvisionedThroughput: {
        ReadCapacityUnits: 5,
        WriteCapacityUnits: 5
      }
    }
  ],
  ProvisionedThroughput: {
    ReadCapacityUnits: 5,
    WriteCapacityUnits: 5
  }
};</code></pre>

<h3>Firestore (Google Cloud)</h3>
<p>A flexible, scalable NoSQL database:</p>
<pre><code>// Example Firestore structure
/posts/{postId}
  title: string
  content: string
  author: reference to /authors/{authorId}
  publishDate: timestamp
  tags: array

/authors/{authorId}
  name: string
  bio: string
  avatar: string

/comments/{commentId}
  postId: string
  content: string
  author: string
  date: timestamp</code></pre>

<h3>FaunaDB</h3>
<p>A serverless database with a GraphQL interface:</p>
<pre><code>// Example FaunaDB schema
type Post {
  title: String!
  content: String!
  author: Author!
  publishDate: Time!
  tags: [String!]
}

type Author {
  name: String!
  bio: String
  avatar: String
  posts: [Post!] @relation
}

type Comment {
  post: Post!
  content: String!
  author: String!
  date: Time!
}</code></pre>

<h2>Creating API Endpoints with Lambda Functions</h2>
<p>Now, create Lambda functions to handle CRUD operations:</p>

<h3>Get All Posts</h3>
<pre><code>// AWS Lambda function to get all posts
exports.handler = async (event) => {
  const AWS = require('aws-sdk');
  const docClient = new AWS.DynamoDB.DocumentClient();
  
  const params = {
    TableName: 'BlogPosts',
    // Add pagination if needed
    Limit: 10
  };
  
  try {
    const data = await docClient.scan(params).promise();
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data.Items)
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message })
    };
  }
};</code></pre>

<h3>Get Single Post</h3>
<pre><code>// AWS Lambda function to get a single post
exports.handler = async (event) => {
  const AWS = require('aws-sdk');
  const docClient = new AWS.DynamoDB.DocumentClient();
  
  const postId = event.pathParameters.id;
  
  const params = {
    TableName: 'BlogPosts',
    Key: { id: postId }
  };
  
  try {
    const data = await docClient.get(params).promise();
    if (!data.Item) {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: 'Post not found' })
      };
    }
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data.Item)
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message })
    };
  }
};</code></pre>

<h3>Create Post</h3>
<pre><code>// AWS Lambda function to create a post
exports.handler = async (event) => {
  const AWS = require('aws-sdk');
  const { v4: uuidv4 } = require('uuid');
  const docClient = new AWS.DynamoDB.DocumentClient();
  
  const body = JSON.parse(event.body);
  const postId = uuidv4();
  const timestamp = new Date().toISOString();
  
  const params = {
    TableName: 'BlogPosts',
    Item: {
      id: postId,
      title: body.title,
      content: body.content,
      author: body.author,
      publishDate: timestamp,
      tags: body.tags || []
    }
  };
  
  try {
    await docClient.put(params).promise();
    return {
      statusCode: 201,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params.Item)
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message })
    };
  }
};</code></pre>

<h2>Setting Up API Gateway</h2>
<p>Connect your Lambda functions to HTTP endpoints using API Gateway:</p>
<ol>
<li>Create a new REST API in API Gateway</li>
<li>Create resources for /posts, /posts/{id}, etc.</li>
<li>Set up methods (GET, POST, PUT, DELETE) and connect to Lambda functions</li>
<li>Configure CORS if your frontend is hosted separately</li>
<li>Deploy your API to a stage (e.g., prod, dev)</li>
</ol>

<h2>Handling File Uploads</h2>
<p>For blog images and attachments, use S3:</p>
<ol>
<li>Create an S3 bucket for your media files</li>
<li>Set up appropriate CORS configuration</li>
<li>Create a Lambda function to generate pre-signed URLs for secure uploads</li>
</ol>
<pre><code>// Lambda function to generate pre-signed URL for S3 upload
exports.handler = async (event) => {
  const AWS = require('aws-sdk');
  const s3 = new AWS.S3();
  
  const body = JSON.parse(event.body);
  const fileName = body.fileName;
  const fileType = body.fileType;
  
  const s3Params = {
    Bucket: 'your-blog-media-bucket',
    Key: Date.now() + '-' + fileName,
    ContentType: fileType,
    Expires: 60 * 5 // URL expires in 5 minutes
  };
  
  try {
    const uploadURL = await s3.getSignedUrlPromise('putObject', s3Params);
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        uploadURL,
        key: s3Params.Key
      })
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message })
    };
  }
};</code></pre>

<h2>Authentication and Authorization</h2>
<p>Secure your API with Amazon Cognito or Auth0:</p>
<ol>
<li>Set up a user pool in Cognito or a tenant in Auth0</li>
<li>Configure API Gateway to use a Cognito User Pool Authorizer or Lambda Authorizer</li>
<li>Implement role-based access control for different user types (admin, author, reader)</li>
</ol>

<h2>Implementing a Content Delivery Network (CDN)</h2>
<p>Use CloudFront to cache and deliver your content globally:</p>
<ol>
<li>Create a CloudFront distribution pointing to your API Gateway and S3 bucket</li>
<li>Configure cache behaviors based on content types</li>
<li>Set up appropriate TTLs (Time To Live) for different resources</li>
</ol>

<h2>Monitoring and Logging</h2>
<p>Set up monitoring using CloudWatch:</p>
<ol>
<li>Configure CloudWatch Logs for your Lambda functions</li>
<li>Create CloudWatch Alarms for error rates and performance metrics</li>
<li>Set up a dashboard to monitor your serverless application</li>
</ol>

<h2>Deployment and CI/CD</h2>
<p>Automate deployment using the Serverless Framework, AWS SAM, or AWS CDK:</p>
<pre><code># Example serverless.yml for Serverless Framework
service: serverless-blog

provider:
  name: aws
  runtime: nodejs14.x
  region: us-east-1
  environment:
    POSTS_TABLE: BlogPosts
  iamRoleStatements:
    - Effect: Allow
      Action:
        - dynamodb:Query
        - dynamodb:Scan
        - dynamodb:GetItem
        - dynamodb:PutItem
        - dynamodb:UpdateItem
        - dynamodb:DeleteItem
      Resource: !GetAtt BlogPostsTable.Arn

functions:
  getAllPosts:
    handler: src/handlers/getAllPosts.handler
    events:
      - http:
          path: /posts
          method: get
          cors: true
  getPost:
    handler: src/handlers/getPost.handler
    events:
      - http:
          path: /posts/{id}
          method: get
          cors: true
  createPost:
    handler: src/handlers/createPost.handler
    events:
      - http:
          path: /posts
          method: post
          cors: true
          authorizer: aws_iam

resources:
  Resources:
    BlogPostsTable:
      Type: AWS::DynamoDB::Table
      Properties:
        TableName: BlogPosts
        BillingMode: PAY_PER_REQUEST
        AttributeDefinitions:
          - AttributeName: id
            AttributeType: S
          - AttributeName: publishDate
            AttributeType: S
        KeySchema:
          - AttributeName: id
            KeyType: HASH</code></pre>

<h2>Cost Optimization</h2>
<p>Keep costs under control with these strategies:</p>
<ul>
<li>Use provisioned concurrency for frequently accessed Lambda functions</li>
<li>Implement caching at the API Gateway level</li>
<li>Choose the right database pricing model (on-demand vs. provisioned)</li>
<li>Set up CloudWatch Alarms to alert on unexpected usage spikes</li>
</ul>

<h2>Conclusion</h2>
<p>A serverless backend for your blog offers scalability, cost-efficiency, and reduced operational overhead. By following this guide, you can create a robust, maintainable backend that grows with your audience without requiring constant server management.</p>

<p>As your blog grows, you can easily extend this architecture to include features like comment moderation, newsletter subscriptions, or even a custom CMS—all while maintaining the benefits of the serverless approach.</p>`,
      date: "September 5, 2023",
      readTime: "18 min read",
      imageUrl:
        "https://images.unsplash.com/photo-1607799279861-4dd421887fb3?w=1200&q=80",
      category: "Backend",
      author: "Jordan Taylor",
      authorAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jordan",
    },
  ];

  // Find the post by ID
  React.useEffect(() => {
    if (postId) {
      setLoading(true);
      // Simulate API call with timeout
      setTimeout(() => {
        const foundPost = blogPosts.find((post) => post.id === postId);
        if (foundPost) {
          setPost(foundPost);
          setLoading(false);
        } else {
          setError("Post not found");
          setLoading(false);
        }
      }, 500);
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
      alert("Link copied to clipboard!");
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
        <div className="relative h-[50vh] md:h-[60vh] w-full overflow-hidden">
          <img
            src={post.imageUrl}
            alt={post.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-6 md:p-12">
            <Badge className="mb-4 self-start bg-primary hover:bg-primary/90 text-white">
              {post.category}
            </Badge>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 max-w-4xl">
              {post.title}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-white/80">
              <div className="flex items-center gap-2">
                <img
                  src={post.authorAvatar}
                  alt={post.author}
                  className="w-8 h-8 rounded-full bg-primary/20"
                />
                <span>{post.author}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4" />
                <span>{post.date}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="h-4 w-4" />
                <span>{post.readTime}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Article Content */}
        <article className="max-w-4xl mx-auto px-4 py-12">
          <div className="prose prose-lg dark:prose-invert max-w-none">
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              {post.excerpt}
            </p>
            <div dangerouslySetInnerHTML={{ __html: post.content }} />
          </div>

          {/* Article Footer */}
          <div className="mt-12 pt-6 border-t flex flex-wrap justify-between items-center">
            <div className="flex items-center gap-4">
              <img
                src={post.authorAvatar}
                alt={post.author}
                className="w-12 h-12 rounded-full bg-primary/20"
              />
              <div>
                <p className="font-medium">{post.author}</p>
                <p className="text-sm text-muted-foreground">Author</p>
              </div>
            </div>
            <div className="flex gap-2 mt-4 sm:mt-0">
              <Button variant="outline" onClick={handleShare}>
                <Share2 className="mr-2 h-4 w-4" /> Share
              </Button>
              <Button onClick={() => navigate("/")}>
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to Articles
              </Button>
            </div>
          </div>
        </article>
      </main>

      {/* Footer */}
      <footer className="bg-muted py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <h3 className="text-xl font-bold mb-4">BlogHub</h3>
              <p className="text-muted-foreground mb-4">
                A modern blogging platform focused on clean design and
                exceptional reading experience.
              </p>
              <p className="text-sm text-muted-foreground">
                © {new Date().getFullYear()} BlogHub. All rights reserved.
              </p>
            </div>

            <div>
              <h4 className="font-medium mb-4">Categories</h4>
              <ul className="space-y-2">
                {[
                  "Web Development",
                  "Technology",
                  "Design",
                  "UX Design",
                  "Backend",
                  "Architecture",
                ].map((category) => (
                  <li key={category}>
                    <a
                      href={`#${category.toLowerCase()}`}
                      className="text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                      {category}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-medium mb-4">Links</h4>
              <ul className="space-y-2">
                <li>
                  <a
                    href="#"
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    About Us
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    Contact
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    Terms of Service
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default BlogDetail;
