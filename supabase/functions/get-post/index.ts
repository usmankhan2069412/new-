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

    // Get post ID from URL
    const url = new URL(req.url);
    const postId = url.searchParams.get("id");

    if (!postId) {
      throw new Error("Post ID is required");
    }

    // Get post data
    const { data: post, error } = await supabaseClient
      .from("posts")
      .select(
        `
        *,
        users!inner(*),
        comments(*, users(*))
      `,
      )
      .eq("id", postId)
      .single();

    if (error) throw error;

    if (!post) {
      return new Response(JSON.stringify({ error: "Post not found" }), {
        status: 404,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      });
    }

    // Get related posts
    const { data: relatedPosts, error: relatedError } = await supabaseClient
      .from("posts")
      .select("id, title, excerpt, image_url, category, date")
      .eq("category", post.category)
      .neq("id", postId)
      .limit(3);

    if (relatedError) throw relatedError;

    // Return the post with related posts
    return new Response(
      JSON.stringify({
        post,
        relatedPosts,
      }),
      {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      },
    );
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json",
      },
    });
  }
});
