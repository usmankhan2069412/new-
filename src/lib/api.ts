import { supabase } from "./supabase";
import { Tables } from "@/types/supabase";

export type Post = Tables<"posts">;

export async function getPosts() {
  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .order("date", { ascending: false });

  if (error) {
    console.error("Error fetching posts:", error);
    return [];
  }

  return data || [];
}

export async function getPost(id: string) {
  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error fetching post:", error);
    return null;
  }

  return data;
}

export async function createPost(
  post: Omit<Post, "id" | "created_at" | "updated_at">,
) {
  // Calculate read time based on content length (rough estimate)
  const wordCount = post.content.split(/\s+/).length;
  const readTime = Math.max(1, Math.ceil(wordCount / 200)) + " min read";

  const { data, error } = await supabase
    .from("posts")
    .insert([
      {
        ...post,
        read_time: readTime,
        date: new Date().toISOString(),
      },
    ])
    .select()
    .single();

  if (error) {
    console.error("Error creating post:", error);
    throw new Error(error.message);
  }

  return data;
}

export async function updatePost(id: string, post: Partial<Post>) {
  const { data, error } = await supabase
    .from("posts")
    .update({
      ...post,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Error updating post:", error);
    throw new Error(error.message);
  }

  return data;
}

export async function deletePost(id: string) {
  const { error } = await supabase.from("posts").delete().eq("id", id);

  if (error) {
    console.error("Error deleting post:", error);
    throw new Error(error.message);
  }

  return true;
}
