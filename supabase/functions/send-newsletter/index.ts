import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { SmtpClient } from "https://deno.land/x/smtp@v0.7.0/mod.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // Create a Supabase client with the Auth context of the logged in user
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      {
        global: {
          headers: { Authorization: req.headers.get("Authorization")! },
        },
      },
    );

    // Get the post ID from the request
    const { postId } = await req.json();

    if (!postId) {
      throw new Error("Post ID is required");
    }

    // Get post details
    const { data: post, error: postError } = await supabaseClient
      .from("posts")
      .select("*")
      .eq("id", postId)
      .single();

    if (postError) throw postError;
    if (!post) throw new Error("Post not found");

    // Get all subscribers
    const { data: subscribers, error: subscribersError } = await supabaseClient
      .from("newsletter_subscribers")
      .select("*");

    if (subscribersError) throw subscribersError;

    // Configure SMTP client
    const client = new SmtpClient();

    // Use environment variables for SMTP configuration
    const SMTP_HOST = Deno.env.get("SMTP_HOST") || "smtp.example.com";
    const SMTP_PORT = parseInt(Deno.env.get("SMTP_PORT") || "587");
    const SMTP_USERNAME = Deno.env.get("SMTP_USERNAME") || "user@example.com";
    const SMTP_PASSWORD = Deno.env.get("SMTP_PASSWORD") || "password";
    const FROM_EMAIL = Deno.env.get("FROM_EMAIL") || "noreply@bloghub.com";

    await client.connectTLS({
      hostname: SMTP_HOST,
      port: SMTP_PORT,
      username: SMTP_USERNAME,
      password: SMTP_PASSWORD,
    });

    // Create email content
    const emailSubject = `New Blog Post: ${post.title}`;
    const baseUrl = Deno.env.get("SITE_URL") || "https://bloghub.com";
    const postUrl = `${baseUrl}/post/${post.id}`;

    // Send email to each subscriber
    const emailPromises = subscribers.map(async (subscriber) => {
      const emailContent = `
        <html>
          <head>
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
              h1 { color: #2563eb; }
              .post-image { max-width: 100%; height: auto; border-radius: 8px; }
              .button { display: inline-block; background-color: #2563eb; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px; margin-top: 15px; }
              .footer { margin-top: 30px; font-size: 12px; color: #666; border-top: 1px solid #eee; padding-top: 10px; }
              .unsubscribe { color: #666; text-decoration: underline; }
            </style>
          </head>
          <body>
            <h1>New Blog Post: ${post.title}</h1>
            <p>Hello,</p>
            <p>We've just published a new blog post that we thought you might enjoy:</p>
            <img src="${post.image_url}" alt="${post.title}" class="post-image" />
            <h2>${post.title}</h2>
            <p>${post.excerpt}</p>
            <a href="${postUrl}" class="button">Read Full Article</a>
            <div class="footer">
              <p>You're receiving this email because you subscribed to our newsletter.</p>
              <p><a href="${baseUrl}/unsubscribe?email=${encodeURIComponent(subscriber.email)}" class="unsubscribe">Unsubscribe</a></p>
            </div>
          </body>
        </html>
      `;

      await client.send({
        from: FROM_EMAIL,
        to: subscriber.email,
        subject: emailSubject,
        content: emailContent,
        html: emailContent,
      });

      return subscriber.email;
    });

    // Wait for all emails to be sent
    const sentEmails = await Promise.all(emailPromises);

    // Close the connection
    await client.close();

    return new Response(
      JSON.stringify({
        success: true,
        message: `Newsletter sent to ${sentEmails.length} subscribers`,
        recipients: sentEmails,
      }),
      {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      },
    );
  } catch (error) {
    console.error("Error sending newsletter:", error);
    return new Response(
      JSON.stringify({
        error: error.message || "Failed to send newsletter",
      }),
      {
        status: 400,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      },
    );
  }
});
