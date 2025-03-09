import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

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

    // This function will be triggered by a database webhook when a new post is created
    const { record } = await req.json();

    if (!record || !record.id) {
      throw new Error("Invalid post data");
    }

    // Call the send-newsletter function with the new post ID
    const sendNewsletterUrl = `${Deno.env.get("SUPABASE_URL")}/functions/v1/send-newsletter`;
    const response = await fetch(sendNewsletterUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: req.headers.get("Authorization")!,
      },
      body: JSON.stringify({ postId: record.id }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        `Failed to send newsletter: ${errorData.error || response.statusText}`,
      );
    }

    const result = await response.json();

    return new Response(
      JSON.stringify({
        success: true,
        message: "Auto newsletter sent successfully",
        details: result,
      }),
      {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      },
    );
  } catch (error) {
    console.error("Error in auto-newsletter:", error);
    return new Response(
      JSON.stringify({
        error: error.message || "Failed to process auto newsletter",
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
