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
import { Search, Download, Trash2, Mail, Check, X } from "lucide-react";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { format } from "date-fns";
import { supabase } from "@/lib/supabase";
import { useToast } from "../ui/use-toast";

interface ContactSubmission {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  message: string;
  status: "new" | "read" | "replied" | "archived";
  created_at: string;
}

const ContactSubmissions = () => {
  const { toast } = useToast();
  const [submissions, setSubmissions] = useState<ContactSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredSubmissions, setFilteredSubmissions] = useState<
    ContactSubmission[]
  >([]);
  const [selectedSubmission, setSelectedSubmission] =
    useState<ContactSubmission | null>(null);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");

  useEffect(() => {
    const loadSubmissions = async () => {
      try {
        // Try to load from Supabase first
        const { data, error } = await supabase
          .from("contact_submissions")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) throw error;

        if (data && data.length > 0) {
          setSubmissions(data as ContactSubmission[]);
        } else {
          // Fall back to localStorage if no data in Supabase
          const localSubmissions = JSON.parse(
            localStorage.getItem("contact_submissions") || "[]",
          );
          setSubmissions(localSubmissions);
        }
      } catch (err) {
        console.error("Error loading submissions:", err);
        // Fall back to localStorage if Supabase fails
        try {
          const localSubmissions = JSON.parse(
            localStorage.getItem("contact_submissions") || "[]",
          );
          setSubmissions(localSubmissions);
        } catch (localErr) {
          console.error("Error loading from localStorage:", localErr);
          setSubmissions([]);
        }
      } finally {
        setLoading(false);
      }
    };

    loadSubmissions();
  }, []);

  useEffect(() => {
    // Filter submissions based on search query and status filter
    if (searchQuery.trim() === "" && !statusFilter) {
      setFilteredSubmissions(submissions);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = submissions.filter((submission) => {
      const matchesSearch =
        query === "" ||
        submission.first_name.toLowerCase().includes(query) ||
        submission.last_name.toLowerCase().includes(query) ||
        submission.email.toLowerCase().includes(query) ||
        submission.message.toLowerCase().includes(query);

      const matchesStatus = !statusFilter || submission.status === statusFilter;

      return matchesSearch && matchesStatus;
    });

    setFilteredSubmissions(filtered);
  }, [searchQuery, statusFilter, submissions]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleStatusFilter = (status: string | null) => {
    setStatusFilter(status === statusFilter ? null : status);
  };

  const handleViewSubmission = (submission: ContactSubmission) => {
    setSelectedSubmission(submission);

    // If the submission is new, mark it as read
    if (submission.status === "new") {
      handleUpdateStatus(submission.id, "read");
    }
  };

  const handleUpdateStatus = async (
    id: string,
    status: "new" | "read" | "replied" | "archived",
  ) => {
    try {
      // Try to update in Supabase first
      try {
        const { error } = await supabase
          .from("contact_submissions")
          .update({ status })
          .eq("id", id);

        if (error) throw error;
      } catch (supabaseError) {
        console.error("Supabase update error:", supabaseError);
        // Fall back to localStorage if Supabase fails
        updateLocalStorage(id, status);
      }

      // Update state
      const updatedSubmissions = submissions.map((sub) =>
        sub.id === id ? { ...sub, status } : sub,
      );
      setSubmissions(updatedSubmissions);

      if (selectedSubmission?.id === id) {
        setSelectedSubmission({ ...selectedSubmission, status });
      }

      toast({
        title: "Status Updated",
        description: `Submission marked as ${status}`,
        className: "bg-green-600 text-white",
      });
    } catch (err) {
      console.error("Error updating status:", err);
      toast({
        title: "Update Failed",
        description: "Failed to update submission status",
        variant: "destructive",
      });
    }
  };

  const updateLocalStorage = (id: string, status: string) => {
    try {
      const localSubmissions = JSON.parse(
        localStorage.getItem("contact_submissions") || "[]",
      );
      const updated = localSubmissions.map((sub) =>
        sub.id === id ? { ...sub, status } : sub,
      );
      localStorage.setItem("contact_submissions", JSON.stringify(updated));
    } catch (err) {
      console.error("Error updating localStorage:", err);
    }
  };

  const handleDeleteSubmission = async (id: string) => {
    try {
      // Try to delete from Supabase first
      try {
        const { error } = await supabase
          .from("contact_submissions")
          .delete()
          .eq("id", id);

        if (error) throw error;
      } catch (supabaseError) {
        console.error("Supabase delete error:", supabaseError);
        // Fall back to localStorage if Supabase fails
        deleteFromLocalStorage(id);
      }

      // Update state
      const updatedSubmissions = submissions.filter((sub) => sub.id !== id);
      setSubmissions(updatedSubmissions);

      if (selectedSubmission?.id === id) {
        setSelectedSubmission(null);
      }

      toast({
        title: "Submission Deleted",
        description: "Contact submission has been deleted",
        className: "bg-slate-700 text-white",
      });
    } catch (err) {
      console.error("Error deleting submission:", err);
      toast({
        title: "Delete Failed",
        description: "Failed to delete submission",
        variant: "destructive",
      });
    }
  };

  const deleteFromLocalStorage = (id: string) => {
    try {
      const localSubmissions = JSON.parse(
        localStorage.getItem("contact_submissions") || "[]",
      );
      const updated = localSubmissions.filter((sub) => sub.id !== id);
      localStorage.setItem("contact_submissions", JSON.stringify(updated));
    } catch (err) {
      console.error("Error updating localStorage:", err);
    }
  };

  const handleSendReply = () => {
    if (!selectedSubmission || !replyText.trim()) return;

    // In a real app, this would send an email
    // For now, we'll just simulate it
    toast({
      title: "Reply Sent",
      description: `Your reply to ${selectedSubmission.first_name} has been sent`,
      className: "bg-green-600 text-white",
    });

    // Mark as replied
    handleUpdateStatus(selectedSubmission.id, "replied");
    setReplyText("");
  };

  const handleExportCSV = () => {
    // Create CSV content
    const headers = [
      "First Name",
      "Last Name",
      "Email",
      "Phone",
      "Message",
      "Status",
      "Date",
    ];
    const csvRows = [
      headers.join(","),
      ...submissions.map((submission) =>
        [
          `"${submission.first_name.replace(/"/g, '""')}"`,
          `"${submission.last_name.replace(/"/g, '""')}"`,
          `"${submission.email.replace(/"/g, '""')}"`,
          `"${submission.phone?.replace(/"/g, '""') || ""}"`,
          `"${submission.message.replace(/"/g, '""')}"`,
          `"${submission.status}"`,
          `"${format(new Date(submission.created_at), "yyyy-MM-dd HH:mm:ss")}"`,
        ].join(","),
      ),
    ];
    const csvContent = csvRows.join("\n");

    // Create and download the file
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `contact_submissions_${new Date().toISOString().split("T")[0]}.csv`,
    );
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "MMM d, yyyy h:mm a");
    } catch (e) {
      return dateString;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "new":
        return <Badge className="bg-blue-500">New</Badge>;
      case "read":
        return <Badge variant="outline">Read</Badge>;
      case "replied":
        return <Badge className="bg-green-500">Replied</Badge>;
      case "archived":
        return <Badge variant="secondary">Archived</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
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
        <h1 className="text-2xl md:text-3xl font-bold">Contact Submissions</h1>
        <Button onClick={handleExportCSV}>
          <Download className="mr-2 h-4 w-4" /> Export CSV
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Total Submissions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{submissions.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">New Messages</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {submissions.filter((s) => s.status === "new").length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Replied</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {submissions.filter((s) => s.status === "replied").length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Archived</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {submissions.filter((s) => s.status === "archived").length}
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
              placeholder="Search submissions..."
              className="pl-8 w-full"
              value={searchQuery}
              onChange={handleSearch}
            />
          </div>

          <div className="flex flex-wrap gap-2">
            <Badge
              variant={statusFilter === "new" ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => handleStatusFilter("new")}
            >
              New
            </Badge>
            <Badge
              variant={statusFilter === "read" ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => handleStatusFilter("read")}
            >
              Read
            </Badge>
            <Badge
              variant={statusFilter === "replied" ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => handleStatusFilter("replied")}
            >
              Replied
            </Badge>
            <Badge
              variant={statusFilter === "archived" ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => handleStatusFilter("archived")}
            >
              Archived
            </Badge>
            {statusFilter && (
              <Badge
                variant="secondary"
                className="cursor-pointer"
                onClick={() => setStatusFilter(null)}
              >
                Clear filters
              </Badge>
            )}
          </div>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Contact Messages</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSubmissions.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="text-center py-8 text-muted-foreground"
                    >
                      {searchQuery || statusFilter
                        ? "No submissions match your search criteria."
                        : "No contact submissions found."}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredSubmissions.map((submission) => (
                    <TableRow key={submission.id}>
                      <TableCell className="font-medium">
                        {submission.first_name} {submission.last_name}
                      </TableCell>
                      <TableCell>{submission.email}</TableCell>
                      <TableCell>{formatDate(submission.created_at)}</TableCell>
                      <TableCell>{getStatusBadge(submission.status)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleViewSubmission(submission)}
                                title="View message"
                              >
                                <Mail className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-md">
                              <DialogHeader>
                                <DialogTitle>Contact Message</DialogTitle>
                                <DialogDescription>
                                  From {submission.first_name}{" "}
                                  {submission.last_name} on{" "}
                                  {formatDate(submission.created_at)}
                                </DialogDescription>
                              </DialogHeader>
                              <div className="space-y-4 py-4">
                                <div className="grid grid-cols-4 gap-4">
                                  <div className="text-sm font-medium">
                                    Email:
                                  </div>
                                  <div className="col-span-3">
                                    <a
                                      href={`mailto:${submission.email}`}
                                      className="text-primary hover:underline"
                                    >
                                      {submission.email}
                                    </a>
                                  </div>
                                </div>
                                {submission.phone && (
                                  <div className="grid grid-cols-4 gap-4">
                                    <div className="text-sm font-medium">
                                      Phone:
                                    </div>
                                    <div className="col-span-3">
                                      <a
                                        href={`tel:${submission.phone}`}
                                        className="text-primary hover:underline"
                                      >
                                        {submission.phone}
                                      </a>
                                    </div>
                                  </div>
                                )}
                                <div className="grid grid-cols-4 gap-4">
                                  <div className="text-sm font-medium">
                                    Status:
                                  </div>
                                  <div className="col-span-3">
                                    {getStatusBadge(submission.status)}
                                  </div>
                                </div>
                                <div className="border-t pt-4">
                                  <div className="text-sm font-medium mb-2">
                                    Message:
                                  </div>
                                  <div className="bg-muted p-3 rounded-md whitespace-pre-wrap">
                                    {submission.message}
                                  </div>
                                </div>

                                <div className="border-t pt-4">
                                  <div className="text-sm font-medium mb-2">
                                    Reply:
                                  </div>
                                  <textarea
                                    className="w-full p-3 border rounded-md min-h-[100px] focus:outline-none focus:ring-2 focus:ring-primary/50"
                                    placeholder="Type your reply here..."
                                    value={replyText}
                                    onChange={(e) =>
                                      setReplyText(e.target.value)
                                    }
                                  />
                                </div>
                              </div>
                              <DialogFooter className="flex justify-between">
                                <div className="flex gap-2">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() =>
                                      handleUpdateStatus(
                                        submission.id,
                                        "archived",
                                      )
                                    }
                                    title="Archive message"
                                  >
                                    Archive
                                  </Button>
                                  <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        className="text-destructive hover:text-destructive/90"
                                        title="Delete message"
                                      >
                                        Delete
                                      </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                      <AlertDialogHeader>
                                        <AlertDialogTitle>
                                          Are you sure?
                                        </AlertDialogTitle>
                                        <AlertDialogDescription>
                                          This action cannot be undone. This
                                          will permanently delete this contact
                                          submission.
                                        </AlertDialogDescription>
                                      </AlertDialogHeader>
                                      <AlertDialogFooter>
                                        <AlertDialogCancel>
                                          Cancel
                                        </AlertDialogCancel>
                                        <AlertDialogAction
                                          onClick={() =>
                                            handleDeleteSubmission(
                                              submission.id,
                                            )
                                          }
                                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                        >
                                          Delete
                                        </AlertDialogAction>
                                      </AlertDialogFooter>
                                    </AlertDialogContent>
                                  </AlertDialog>
                                </div>
                                <Button
                                  onClick={handleSendReply}
                                  disabled={!replyText.trim()}
                                >
                                  Send Reply
                                </Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>

                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() =>
                              handleUpdateStatus(
                                submission.id,
                                submission.status === "new" ? "read" : "new",
                              )
                            }
                            title={
                              submission.status === "new"
                                ? "Mark as read"
                                : "Mark as unread"
                            }
                          >
                            {submission.status === "new" ? (
                              <Check className="h-4 w-4 text-green-500" />
                            ) : (
                              <X className="h-4 w-4" />
                            )}
                          </Button>

                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="text-destructive hover:text-destructive/90"
                                title="Delete submission"
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
                                  permanently delete the contact submission from{" "}
                                  {submission.first_name} {submission.last_name}
                                  .
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() =>
                                    handleDeleteSubmission(submission.id)
                                  }
                                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                >
                                  Delete
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

export default ContactSubmissions;
