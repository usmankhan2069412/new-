import { supabase } from "./supabase";
import { Post } from "./api";

// Base URL for Supabase Edge Functions
const EDGE_FUNCTION_URL = import.meta.env.VITE_SUPABASE_URL + "/functions/v1";

// Helper function to get auth header
const getAuthHeader = async () => {
  const { data } = await supabase.auth.getSession();
  return {
    Authorization: `Bearer ${data.session?.access_token || ""}`,
  };
};

// Get all posts with pagination, filtering, and search
export async function fetchPosts(params) {
  const page = params.page || 1;
  const limit = params.limit || 10;
  const category = params.category;
  const search = params.search;

  try {
    let url = `${EDGE_FUNCTION_URL}/get-posts?page=${page}&limit=${limit}`;
    if (category) url += `&category=${encodeURIComponent(category)}`;
    if (search) url += `&search=${encodeURIComponent(search)}`;

    const headers = await getAuthHeader();
    const response = await fetch(url, { headers });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to fetch posts");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching posts:", error);
    throw error;
  }
}

// Get a single post by ID with comments and related posts
export async function fetchPost(id) {
  try {
    const url = `${EDGE_FUNCTION_URL}/get-post?id=${id}`;
    const headers = await getAuthHeader();
    const response = await fetch(url, { headers });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to fetch post");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching post:", error);
    throw error;
  }
}

// Create a new post
export async function createNewPost(postData) {
  try {
    const url = `${EDGE_FUNCTION_URL}/create-post`;
    const headers = {
      ...(await getAuthHeader()),
      "Content-Type": "application/json",
    };

    const response = await fetch(url, {
      method: "POST",
      headers,
      body: JSON.stringify(postData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to create post");
    }

    return await response.json();
  } catch (error) {
    console.error("Error creating post:", error);
    throw error;
  }
}

// Update an existing post
export async function updateExistingPost(id, postData) {
  try {
    const url = `${EDGE_FUNCTION_URL}/update-post`;
    const headers = {
      ...(await getAuthHeader()),
      "Content-Type": "application/json",
    };

    const response = await fetch(url, {
      method: "POST",
      headers,
      body: JSON.stringify({ id, ...postData }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to update post");
    }

    return await response.json();
  } catch (error) {
    console.error("Error updating post:", error);
    throw error;
  }
}

// Delete a post
export async function deleteExistingPost(id) {
  try {
    const url = `${EDGE_FUNCTION_URL}/delete-post?id=${id}`;
    const headers = await getAuthHeader();

    const response = await fetch(url, {
      method: "DELETE",
      headers,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to delete post");
    }

    return await response.json();
  } catch (error) {
    console.error("Error deleting post:", error);
    throw error;
  }
}
