import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Plus, Edit2, Trash2, Save, X } from "lucide-react";
import { Badge } from "../ui/badge";
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
import { useToast } from "../ui/use-toast";

interface Category {
  id: string;
  name: string;
  slug: string;
  postCount: number;
}

const CategoryManager = () => {
  const { toast } = useToast();
  const [categories, setCategories] = useState<Category[]>([]);
  const [newCategory, setNewCategory] = useState("");
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load categories from localStorage
    const loadCategories = () => {
      try {
        const savedCategories = JSON.parse(
          localStorage.getItem("blog_categories") || "[]",
        );
        if (savedCategories.length === 0) {
          // Add default categories if none exist
          const defaultCategories = [
            {
              id: "1",
              name: "Web Development",
              slug: "web-development",
              postCount: 2,
            },
            { id: "2", name: "Technology", slug: "technology", postCount: 1 },
            { id: "3", name: "Design", slug: "design", postCount: 1 },
            { id: "4", name: "UX Design", slug: "ux-design", postCount: 1 },
            { id: "5", name: "Backend", slug: "backend", postCount: 1 },
            {
              id: "6",
              name: "Architecture",
              slug: "architecture",
              postCount: 0,
            },
          ];
          setCategories(defaultCategories);
          localStorage.setItem(
            "blog_categories",
            JSON.stringify(defaultCategories),
          );
        } else {
          setCategories(savedCategories);
        }
      } catch (err) {
        console.error("Error loading categories:", err);
        setCategories([]);
      } finally {
        setLoading(false);
      }
    };

    loadCategories();
  }, []);

  const saveCategories = (updatedCategories: Category[]) => {
    try {
      localStorage.setItem(
        "blog_categories",
        JSON.stringify(updatedCategories),
      );
    } catch (err) {
      console.error("Error saving categories:", err);
      toast({
        title: "Error",
        description: "Failed to save categories",
        variant: "destructive",
      });
    }
  };

  const createSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "");
  };

  const handleAddCategory = () => {
    if (!newCategory.trim()) return;

    const categoryExists = categories.some(
      (cat) => cat.name.toLowerCase() === newCategory.toLowerCase(),
    );

    if (categoryExists) {
      toast({
        title: "Category Exists",
        description: "A category with this name already exists",
        variant: "destructive",
      });
      return;
    }

    const newCategoryObj = {
      id: Date.now().toString(),
      name: newCategory.trim(),
      slug: createSlug(newCategory),
      postCount: 0,
    };

    const updatedCategories = [...categories, newCategoryObj];
    setCategories(updatedCategories);
    saveCategories(updatedCategories);
    setNewCategory("");

    // Dispatch a custom event to notify other components about the category change
    window.dispatchEvent(
      new CustomEvent("categoriesUpdated", {
        detail: { categories: updatedCategories },
      }),
    );

    // Also dispatch an event specifically for the filter bar in PostGrid
    window.dispatchEvent(
      new CustomEvent("categoryFilterUpdate", {
        detail: { action: "add", category: newCategoryObj.name },
      }),
    );

    toast({
      title: "Category Added",
      description: `Category "${newCategoryObj.name}" has been added successfully`,
      className: "bg-green-600 text-white",
    });
  };

  const handleEditCategory = (category: Category) => {
    setEditingCategory({ ...category });
  };

  const handleSaveEdit = () => {
    if (!editingCategory) return;

    const categoryExists = categories.some(
      (cat) =>
        cat.id !== editingCategory.id &&
        cat.name.toLowerCase() === editingCategory.name.toLowerCase(),
    );

    if (categoryExists) {
      toast({
        title: "Category Exists",
        description: "A category with this name already exists",
        variant: "destructive",
      });
      return;
    }

    // Find the original category to get the old name
    const originalCategory = categories.find(
      (cat) => cat.id === editingCategory.id,
    );
    const oldCategoryName = originalCategory ? originalCategory.name : "";

    const updatedCategories = categories.map((cat) =>
      cat.id === editingCategory.id
        ? {
            ...editingCategory,
            slug: createSlug(editingCategory.name),
          }
        : cat,
    );

    setCategories(updatedCategories);
    saveCategories(updatedCategories);
    setEditingCategory(null);

    // Dispatch a custom event to notify other components about the category change
    window.dispatchEvent(
      new CustomEvent("categoriesUpdated", {
        detail: { categories: updatedCategories },
      }),
    );

    // Also dispatch an event specifically for the filter bar in PostGrid
    window.dispatchEvent(
      new CustomEvent("categoryFilterUpdate", {
        detail: {
          action: "edit",
          oldName: oldCategoryName,
          newName: editingCategory.name,
        },
      }),
    );

    toast({
      title: "Category Updated",
      description: `Category has been updated successfully`,
      className: "bg-green-600 text-white",
    });
  };

  const handleCancelEdit = () => {
    setEditingCategory(null);
  };

  const handleDeleteCategory = (categoryId: string) => {
    // Find the category to be deleted to get its name
    const categoryToDelete = categories.find((cat) => cat.id === categoryId);
    const categoryName = categoryToDelete ? categoryToDelete.name : "";

    const updatedCategories = categories.filter((cat) => cat.id !== categoryId);
    setCategories(updatedCategories);
    saveCategories(updatedCategories);

    // Dispatch a custom event to notify other components about the category change
    window.dispatchEvent(
      new CustomEvent("categoriesUpdated", {
        detail: { categories: updatedCategories },
      }),
    );

    // Also dispatch an event specifically for the filter bar in PostGrid
    window.dispatchEvent(
      new CustomEvent("categoryFilterUpdate", {
        detail: { action: "delete", category: categoryName },
      }),
    );

    toast({
      title: "Category Deleted",
      description: "Category has been deleted successfully",
      className: "bg-slate-700 text-white",
    });
  };

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
    <div className="p-4 md:p-8 bg-background">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <h1 className="text-2xl md:text-3xl font-bold">Category Management</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Total Categories
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{categories.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Most Popular</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {categories.length > 0
                ? categories.reduce((prev, current) =>
                    prev.postCount > current.postCount ? prev : current,
                  ).name
                : "None"}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Unused Categories
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {categories.filter((cat) => cat.postCount === 0).length}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Add New Category</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Input
              placeholder="Enter category name"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              className="max-w-md"
            />
            <Button onClick={handleAddCategory}>
              <Plus className="mr-2 h-4 w-4" /> Add Category
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Manage Categories</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Slug</TableHead>
                  <TableHead>Posts</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {categories.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={4}
                      className="text-center py-8 text-muted-foreground"
                    >
                      No categories found. Add your first category to get
                      started.
                    </TableCell>
                  </TableRow>
                ) : (
                  categories.map((category) => (
                    <TableRow key={category.id}>
                      <TableCell>
                        {editingCategory?.id === category.id ? (
                          <Input
                            value={editingCategory.name}
                            onChange={(e) =>
                              setEditingCategory({
                                ...editingCategory,
                                name: e.target.value,
                              })
                            }
                            className="max-w-[200px]"
                          />
                        ) : (
                          <span className="font-medium">{category.name}</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{category.slug}</Badge>
                      </TableCell>
                      <TableCell>{category.postCount}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          {editingCategory?.id === category.id ? (
                            <>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={handleSaveEdit}
                                title="Save changes"
                              >
                                <Save className="h-4 w-4 text-green-500" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={handleCancelEdit}
                                title="Cancel"
                              >
                                <X className="h-4 w-4 text-red-500" />
                              </Button>
                            </>
                          ) : (
                            <>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleEditCategory(category)}
                                title="Edit category"
                              >
                                <Edit2 className="h-4 w-4" />
                              </Button>

                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="text-destructive hover:text-destructive/90"
                                    title="Delete category"
                                    disabled={category.postCount > 0}
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
                                      permanently delete the category "
                                      {category.name}".
                                      {category.postCount > 0 && (
                                        <p className="mt-2 text-destructive font-semibold">
                                          This category has {category.postCount}{" "}
                                          posts. You cannot delete it until you
                                          reassign or delete those posts.
                                        </p>
                                      )}
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>
                                      Cancel
                                    </AlertDialogCancel>
                                    <AlertDialogAction
                                      onClick={() =>
                                        handleDeleteCategory(category.id)
                                      }
                                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                      disabled={category.postCount > 0}
                                    >
                                      Delete
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </>
                          )}
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

export default CategoryManager;
