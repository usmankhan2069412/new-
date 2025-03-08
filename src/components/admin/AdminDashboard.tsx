import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { PenSquare, Trash2, Plus, BarChart, Eye } from "lucide-react";
import { useAuth } from "../auth/AuthContext";
import { getPosts, deletePost } from "@/lib/api";
import { Post } from "@/lib/api";
import { format } from "date-fns";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog";
import { Badge } from "../ui/badge";
import { Input } from "../ui/input";
import { Search } from "lucide-react";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const data = await getPosts();
        setPosts(data);
        setFilteredPosts(data);
      } catch (err) {
        setError("Failed to load posts");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  useEffect(() => {
    // Filter posts based on search query and category
    let result = [...posts];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (post) =>
          post.title.toLowerCase().includes(query) ||
          post.excerpt.toLowerCase().includes(query) ||
          post.category.toLowerCase().includes(query),
      );
    }

    if (categoryFilter) {
      result = result.filter((post) => post.category === categoryFilter);
    }

    setFilteredPosts(result);
  }, [searchQuery, categoryFilter, posts]);

  const handleEdit = (postId: string) => {
    navigate(`/admin/edit/${postId}`);
  };

  const handleView = (postId: string) => {
    navigate(`/post/${postId}`);
  };

  const handleDelete = async (postId: string) => {
    try {
      setDeleteLoading(postId);
      await deletePost(postId);
      setPosts(posts.filter((post) => post.id !== postId));
      setError(null);
    } catch (err) {
      console.error("Error deleting post:", err);
      setError("Failed to delete post");
    } finally {
      setDeleteLoading(null);
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleCategoryFilter = (category: string | null) => {
    setCategoryFilter(category === categoryFilter ? null : category);
  };

  // Get unique categories from posts
  const categories = Array.from(new Set(posts.map((post) => post.category)));

  if (loading) {
    return (
      <div className="p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-10 bg-muted rounded w-1/4"></div>
          <div className="h-64 bg-muted rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 bg-background min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <h1 className="text-2xl md:text-3xl font-bold">Admin Dashboard</h1>
        <Button onClick={() => navigate("/create")}>
          <Plus className="mr-2 h-4 w-4" /> New Post
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Posts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{posts.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{categories.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Latest Post</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-md font-medium truncate">
              {posts.length > 0 ? posts[0].title : "No posts yet"}
            </div>
            <div className="text-xs text-muted-foreground">
              {posts.length > 0 && posts[0].date
                ? format(new Date(posts[0].date), "MMM d, yyyy")
                : ""}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and filter section */}
      <div className="mb-6 space-y-4">
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search posts..."
              className="pl-8 w-full"
              value={searchQuery}
              onChange={handleSearch}
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Badge
                key={category}
                variant={categoryFilter === category ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => handleCategoryFilter(category)}
              >
                {category}
              </Badge>
            ))}
            {categoryFilter && (
              <Badge
                variant="secondary"
                className="cursor-pointer"
                onClick={() => setCategoryFilter(null)}
              >
                Clear filters
              </Badge>
            )}
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-destructive/15 text-destructive p-4 rounded-md mb-6">
          {error}
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Manage Posts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPosts.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={4}
                      className="text-center py-8 text-muted-foreground"
                    >
                      {searchQuery || categoryFilter
                        ? "No posts match your search criteria."
                        : "No posts found. Create your first post to get started."}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredPosts.map((post) => (
                    <TableRow key={post.id}>
                      <TableCell className="font-medium max-w-md truncate">
                        {post.title}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{post.category}</Badge>
                      </TableCell>
                      <TableCell>
                        {post.date
                          ? format(new Date(post.date), "MMM d, yyyy")
                          : "Unknown"}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleView(post.id)}
                            title="View post"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEdit(post.id)}
                            title="Edit post"
                          >
                            <PenSquare className="h-4 w-4" />
                          </Button>

                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="text-destructive hover:text-destructive/90"
                                title="Delete post"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>
                                  Are you sure?
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                  This action cannot be undone. This will
                                  permanently delete the post titled "
                                  {post.title}" and remove it from our servers.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDelete(post.id)}
                                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                  disabled={deleteLoading === post.id}
                                >
                                  {deleteLoading === post.id
                                    ? "Deleting..."
                                    : "Delete"}
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;
