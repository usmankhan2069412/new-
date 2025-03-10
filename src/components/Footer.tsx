import React from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Facebook,
  Github,
  Instagram,
  Twitter,
  Mail,
  MapPin,
  Phone,
  Rss,
} from "lucide-react";
import { Button } from "./ui/button";
import { useToast } from "./ui/use-toast";

const Footer = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubscribe = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const email = new FormData(form).get("email") as string;

    if (!email) return;

    // Save to localStorage
    try {
      const subscribers = JSON.parse(
        localStorage.getItem("newsletter_subscribers") || "[]",
      );
      const existingSubscriber = subscribers.find((s) => s.email === email);

      if (!existingSubscriber) {
        subscribers.push({
          id: Date.now().toString(),
          email,
          date: new Date().toLocaleDateString(),
          source: "footer",
        });
        localStorage.setItem(
          "newsletter_subscribers",
          JSON.stringify(subscribers),
        );
        toast({
          title: "Subscription Successful!",
          description: "Thank you for subscribing to our newsletter!",
          variant: "default",
          className: "bg-green-600 text-white",
        });
        form.reset();
      } else {
        toast({
          title: "Already Subscribed",
          description: "You are already subscribed to our newsletter.",
          variant: "default",
          className: "bg-blue-600 text-white",
        });
      }
    } catch (err) {
      console.error("Error saving subscriber:", err);
      toast({
        title: "Subscription Error",
        description: "There was an error processing your subscription.",
        variant: "destructive",
      });
    }
  };

  const handleSocialClick = (platform: string) => {
    toast({
      title: `${platform} Link Clicked`,
      description: `You would be redirected to our ${platform} page.`,
      className: "bg-primary text-primary-foreground",
    });
  };

  return (
    <footer className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 text-gray-300">
      {/* Newsletter Banner */}

      {/* Main Footer */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Logo and Tagline */}
          <div className="space-y-4">
            <Link to="/" className="inline-block">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 bg-primary rounded-full flex items-center justify-center">
                  <span className="text-white font-bold">B</span>
                </div>
                <span className="text-white text-xl font-bold">BlogHub</span>
              </div>
            </Link>
            <p className="text-sm leading-relaxed">
              Experience the future of blogging with AI-powered organization and
              collaboration. Share your ideas with the world through our modern
              blogging platform.
            </p>
            <div className="flex space-x-4">
              <button
                onClick={() => handleSocialClick("Facebook")}
                className="text-gray-400 hover:text-white transition-colors bg-gray-800 p-2 rounded-full"
                aria-label="Facebook"
              >
                <Facebook size={18} />
              </button>
              <button
                onClick={() => handleSocialClick("Twitter")}
                className="text-gray-400 hover:text-white transition-colors bg-gray-800 p-2 rounded-full"
                aria-label="Twitter"
              >
                <Twitter size={18} />
              </button>
              <button
                onClick={() => handleSocialClick("Instagram")}
                className="text-gray-400 hover:text-white transition-colors bg-gray-800 p-2 rounded-full"
                aria-label="Instagram"
              >
                <Instagram size={18} />
              </button>
              <button
                onClick={() => handleSocialClick("Github")}
                className="text-gray-400 hover:text-white transition-colors bg-gray-800 p-2 rounded-full"
                aria-label="Github"
              >
                <Github size={18} />
              </button>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-medium mb-4 text-lg">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <Link
                  to="/"
                  className="text-gray-400 hover:text-white transition-colors text-sm flex items-center gap-2"
                >
                  <span className="w-1.5 h-1.5 bg-primary rounded-full"></span>
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/"
                  className="text-gray-400 hover:text-white transition-colors text-sm flex items-center gap-2"
                >
                  <span className="w-1.5 h-1.5 bg-primary rounded-full"></span>
                  Featured Posts
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="text-gray-400 hover:text-white transition-colors text-sm flex items-center gap-2"
                >
                  <span className="w-1.5 h-1.5 bg-primary rounded-full"></span>
                  Contact Us
                </Link>
              </li>
              <li>
                <Link
                  to="/login"
                  className="text-gray-400 hover:text-white transition-colors text-sm flex items-center gap-2"
                >
                  <span className="w-1.5 h-1.5 bg-primary rounded-full"></span>
                  Admin Login
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-white font-medium mb-4 text-lg">Categories</h3>
            <ul className="space-y-3">
              <li>
                <Link
                  to="/?category=Web%20Development"
                  className="text-gray-400 hover:text-white transition-colors text-sm flex items-center gap-2"
                >
                  <span className="w-1.5 h-1.5 bg-primary rounded-full"></span>
                  Web Development
                </Link>
              </li>
              <li>
                <Link
                  to="/?category=Technology"
                  className="text-gray-400 hover:text-white transition-colors text-sm flex items-center gap-2"
                >
                  <span className="w-1.5 h-1.5 bg-primary rounded-full"></span>
                  Technology
                </Link>
              </li>
              <li>
                <Link
                  to="/?category=Design"
                  className="text-gray-400 hover:text-white transition-colors text-sm flex items-center gap-2"
                >
                  <span className="w-1.5 h-1.5 bg-primary rounded-full"></span>
                  Design
                </Link>
              </li>
              <li>
                <Link
                  to="/?category=Architecture"
                  className="text-gray-400 hover:text-white transition-colors text-sm flex items-center gap-2"
                >
                  <span className="w-1.5 h-1.5 bg-primary rounded-full"></span>
                  Architecture
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-white font-medium mb-4 text-lg">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <MapPin
                  size={18}
                  className="text-primary mt-0.5 flex-shrink-0"
                />
                <span className="text-gray-400 text-sm">
                  100 Smith Street, Collingwood VIC 3066, Australia
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={18} className="text-primary flex-shrink-0" />
                <a
                  href="tel:+61412345678"
                  className="text-gray-400 hover:text-white text-sm"
                >
                  +61 4 1234 5678
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={18} className="text-primary flex-shrink-0" />
                <a
                  href="mailto:info@bloghub.com"
                  className="text-gray-400 hover:text-white text-sm"
                >
                  info@bloghub.com
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Rss size={18} className="text-primary flex-shrink-0" />
                <a href="#" className="text-gray-400 hover:text-white text-sm">
                  RSS Feed
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-gray-500 mb-4 md:mb-0">
            © {new Date().getFullYear()} BlogHub. All rights reserved.
          </p>
          <div className="flex flex-wrap gap-4 md:gap-6 justify-center">
            <Link
              to="/"
              className="text-sm text-gray-500 hover:text-white transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              to="/"
              className="text-sm text-gray-500 hover:text-white transition-colors"
            >
              Terms of Service
            </Link>
            <Link
              to="/"
              className="text-sm text-gray-500 hover:text-white transition-colors"
            >
              Cookie Policy
            </Link>
            <Link
              to="/unsubscribe"
              className="text-sm text-gray-500 hover:text-white transition-colors"
            >
              Unsubscribe
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
