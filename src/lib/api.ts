import { supabase } from "./supabase";
import { Tables } from "@/types/supabase";
import {
  fetchPosts,
  fetchPost,
  createNewPost,
  updateExistingPost,
  deleteExistingPost,
} from "./api-client";

export type Post = Tables<"posts">;

// Legacy direct database access functions
export async function getPosts() {
  try {
    const result = await fetchPosts({ page: 1, limit: 100 });
    return result.posts || [];
  } catch (error) {
    console.error("Error fetching posts:", error);
    // Fallback to direct database access if edge function fails
    const { data, error: dbError } = await supabase
      .from("posts")
      .select("*")
      .order("date", { ascending: false });

    if (dbError) {
      console.error("Error fetching posts from database:", dbError);
      return [];
    }

    return data || [];
  }
}

export async function getPost(id: string) {
  try {
    const result = await fetchPost(id);
    return result.post || null;
  } catch (error) {
    console.error("Error fetching post:", error);
    // Fallback to direct database access if edge function fails
    const { data, error: dbError } = await supabase
      .from("posts")
      .select("*")
      .eq("id", id)
      .single();

    if (dbError) {
      console.error("Error fetching post from database:", dbError);
      return null;
    }

    return data;
  }
}

export async function createPost(
  post: Omit<Post, "id" | "created_at" | "updated_at">,
) {
  try {
    const result = await createNewPost({
      title: post.title,
      excerpt: post.excerpt,
      content: post.content,
      category: post.category,
      image_url: post.image_url,
    });
    return result.post;
  } catch (error) {
    console.error("Error creating post with edge function:", error);
    // Fallback to direct database access if edge function fails
    // Calculate read time based on content length (rough estimate)
    const wordCount = post.content.split(/\s+/).length;
    const readTime = Math.max(1, Math.ceil(wordCount / 200)) + " min read";

    const { data, error: dbError } = await supabase
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

    if (dbError) {
      console.error("Error creating post in database:", dbError);
      throw new Error(dbError.message);
    }

    return data;
  }
}

export async function updatePost(id: string, post: Partial<Post>) {
  try {
    const result = await updateExistingPost(id, post);
    return result.post;
  } catch (error) {
    console.error("Error updating post with edge function:", error);
    // Fallback to direct database access if edge function fails
    const { data, error: dbError } = await supabase
      .from("posts")
      .update({
        ...post,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single();

    if (dbError) {
      console.error("Error updating post in database:", dbError);
      throw new Error(dbError.message);
    }

    return data;
  }
}

export async function deletePost(id: string) {
  try {
    await deleteExistingPost(id);
    return true;
  } catch (error) {
    console.error("Error deleting post with edge function:", error);
    // Fallback to direct database access if edge function fails
    const { error: dbError } = await supabase
      .from("posts")
      .delete()
      .eq("id", id);

    if (dbError) {
      console.error("Error deleting post from database:", dbError);
      throw new Error(dbError.message);
    }

    return true;
  }
}

// New functions for advanced features
export async function getPostsByCategory(
  category: string,
  page = 1,
  limit = 10,
) {
  try {
    return await fetchPosts({ category, page, limit });
  } catch (error) {
    console.error("Error fetching posts by category:", error);
    throw error;
  }
}

export async function searchPosts(query: string, page = 1, limit = 10) {
  try {
    return await fetchPosts({ search: query, page, limit });
  } catch (error) {
    console.error("Error searching posts:", error);
    throw error;
  }
}
