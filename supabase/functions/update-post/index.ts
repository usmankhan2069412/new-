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
        JSON.stringify({ error: "Only admins can update posts" }),
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
    const { id, title, excerpt, content, category, image_url } =
      await req.json();

    if (!id) {
      throw new Error("Post ID is required");
    }

    // Prepare update data
    const updateData: any = {};
    if (title) updateData.title = title;
    if (excerpt) updateData.excerpt = excerpt;
    if (content) {
      updateData.content = content;
      // Recalculate read time if content changed
      const wordCount = content.split(/\s+/).length;
      updateData.read_time =
        Math.max(1, Math.ceil(wordCount / 200)) + " min read";
    }
    if (category) updateData.category = category;
    if (image_url) updateData.image_url = image_url;
    updateData.updated_at = new Date().toISOString();

    // Update post
    const { data: post, error: updateError } = await supabaseClient
      .from("posts")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    if (updateError) throw updateError;

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
