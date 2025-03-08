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

    // Get query parameters
    const url = new URL(req.url);
    const page = parseInt(url.searchParams.get("page") || "1");
    const limit = parseInt(url.searchParams.get("limit") || "10");
    const category = url.searchParams.get("category");
    const search = url.searchParams.get("search");

    // Calculate offset
    const offset = (page - 1) * limit;

    // Build query
    let query = supabaseClient
      .from("posts")
      .select("*, users!inner(*)")
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    // Add category filter if provided
    if (category) {
      query = query.eq("category", category);
    }

    // Add search filter if provided
    if (search) {
      query = query.or(
        `title.ilike.%${search}%,content.ilike.%${search}%,excerpt.ilike.%${search}%`,
      );
    }

    // Execute query
    const { data: posts, error, count } = await query;

    if (error) throw error;

    // Get total count for pagination
    const { count: totalCount, error: countError } = await supabaseClient
      .from("posts")
      .select("*", { count: "exact", head: true });

    if (countError) throw countError;

    // Return the posts
    return new Response(
      JSON.stringify({
        posts,
        pagination: {
          page,
          limit,
          total: totalCount,
          pages: Math.ceil(totalCount / limit),
        },
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
