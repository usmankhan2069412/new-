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

    // Get the current user
    const {
      data: { user },
      error: userError,
    } = await supabaseClient.auth.getUser();

    if (userError || !user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      });
    }

    // Get the user's role
    const { data: userData, error: roleError } = await supabaseClient
      .from("users")
      .select("role")
      .eq("id", user.id)
      .single();

    if (roleError) throw roleError;

    // Check if user is admin
    if (userData.role !== "admin") {
      return new Response(
        JSON.stringify({ error: "Only admins can create posts" }),
        {
          status: 403,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        },
      );
    }

    // Parse request body
    const { title, excerpt, content, category, image_url } = await req.json();

    // Validate required fields
    if (!title || !excerpt || !content || !category || !image_url) {
      throw new Error("Missing required fields");
    }

    // Calculate read time based on content length (rough estimate)
    const wordCount = content.split(/\s+/).length;
    const readTime = Math.max(1, Math.ceil(wordCount / 200)) + " min read";

    // Insert post
    const { data: post, error: insertError } = await supabaseClient
      .from("posts")
      .insert([
        {
          title,
          excerpt,
          content,
          category,
          image_url,
          author: user.id,
          read_time: readTime,
          date: new Date().toISOString(),
        },
      ])
      .select()
      .single();

    if (insertError) throw insertError;

    return new Response(JSON.stringify({ post }), {
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json",
      },
    });
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
