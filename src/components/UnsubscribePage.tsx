import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "./ui/card";
import Header from "./Header";
import Footer from "./Footer";
import { supabase } from "@/lib/supabase";
import { useToast } from "./ui/use-toast";

const UnsubscribePage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const emailParam = searchParams.get("email");
    if (emailParam) {
      setEmail(emailParam);
    }
  }, [searchParams]);

  const handleUnsubscribe = async () => {
    if (!email) {
      setError("Email is required");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // First check if the email exists in the subscribers list
      const { data: subscribers, error: fetchError } = await supabase
        .from("newsletter_subscribers")
        .select("*")
        .eq("email", email);

      if (fetchError) throw fetchError;

      if (!subscribers || subscribers.length === 0) {
        setError("This email is not subscribed to our newsletter.");
        return;
      }

      // Delete the subscriber
      const { error: deleteError } = await supabase
        .from("newsletter_subscribers")
        .delete()
        .eq("email", email);

      if (deleteError) throw deleteError;

      setSuccess(true);
      toast({
        title: "Unsubscribed",
        description:
          "You have been successfully unsubscribed from our newsletter",
        className: "bg-slate-700 text-white",
      });
    } catch (err) {
      console.error("Error unsubscribing:", err);
      setError("Failed to unsubscribe. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-grow flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">
              Unsubscribe from Newsletter
            </CardTitle>
            <CardDescription>
              We're sorry to see you go. Please confirm your email address to
              unsubscribe.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {success ? (
              <div className="text-center py-6">
                <div className="text-green-500 text-xl mb-4">✓</div>
                <h3 className="text-xl font-medium mb-2">
                  Successfully Unsubscribed
                </h3>
                <p className="text-muted-foreground mb-4">
                  You have been successfully unsubscribed from our newsletter.
                </p>
                <Button onClick={() => navigate("/")} variant="outline">
                  Return to Homepage
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="email" className="block text-sm font-medium">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
                    placeholder="your@email.com"
                    required
                  />
                </div>

                {error && (
                  <div className="text-destructive text-sm">{error}</div>
                )}
              </div>
            )}
          </CardContent>
          {!success && (
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={() => navigate("/")}>
                Cancel
              </Button>
              <Button onClick={handleUnsubscribe} disabled={loading}>
                {loading ? "Processing..." : "Unsubscribe"}
              </Button>
            </CardFooter>
          )}
        </Card>
      </main>

      <Footer />
    </div>
  );
};

export default UnsubscribePage;
