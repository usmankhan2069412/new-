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
import { Search, Download, Trash2 } from "lucide-react";
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

interface Subscriber {
  id: string;
  email: string;
  date: string;
  source: string;
}

const SubscribersList = () => {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredSubscribers, setFilteredSubscribers] = useState<Subscriber[]>(
    [],
  );

  useEffect(() => {
    // Load subscribers from localStorage
    const loadSubscribers = () => {
      try {
        const savedSubscribers = JSON.parse(
          localStorage.getItem("newsletter_subscribers") || "[]",
        );
        setSubscribers(savedSubscribers);
        setFilteredSubscribers(savedSubscribers);
      } catch (err) {
        console.error("Error loading subscribers:", err);
        setSubscribers([]);
        setFilteredSubscribers([]);
      } finally {
        setLoading(false);
      }
    };

    loadSubscribers();
  }, []);

  useEffect(() => {
    // Filter subscribers based on search query
    if (searchQuery.trim() === "") {
      setFilteredSubscribers(subscribers);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = subscribers.filter(
      (subscriber) =>
        subscriber.email.toLowerCase().includes(query) ||
        subscriber.source.toLowerCase().includes(query),
    );

    setFilteredSubscribers(filtered);
  }, [searchQuery, subscribers]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleDeleteSubscriber = (id: string) => {
    const updatedSubscribers = subscribers.filter(
      (subscriber) => subscriber.id !== id,
    );
    setSubscribers(updatedSubscribers);
    localStorage.setItem(
      "newsletter_subscribers",
      JSON.stringify(updatedSubscribers),
    );
  };

  const handleExportCSV = () => {
    // Create CSV content
    const headers = ["Email", "Date", "Source"];
    const csvRows = [
      headers.join(","),
      ...subscribers.map((subscriber) =>
        [subscriber.email, subscriber.date, subscriber.source].join(","),
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
      `newsletter_subscribers_${new Date().toISOString().split("T")[0]}.csv`,
    );
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
        <h1 className="text-2xl md:text-3xl font-bold">
          Newsletter Subscribers
        </h1>
        <Button onClick={handleExportCSV}>
          <Download className="mr-2 h-4 w-4" /> Export CSV
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Total Subscribers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{subscribers.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Blog Post Subscribers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {subscribers.filter((s) => s.source.includes("blog")).length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Homepage Subscribers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {subscribers.filter((s) => s.source.includes("home")).length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and filter section */}
      <div className="mb-6">
        <div className="relative w-full md:w-64">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search subscribers..."
            className="pl-8 w-full"
            value={searchQuery}
            onChange={handleSearch}
          />
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Manage Subscribers</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Email</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Source</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSubscribers.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={4}
                      className="text-center py-8 text-muted-foreground"
                    >
                      {searchQuery
                        ? "No subscribers match your search criteria."
                        : "No subscribers found."}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredSubscribers.map((subscriber) => (
                    <TableRow key={subscriber.id}>
                      <TableCell className="font-medium">
                        {subscriber.email}
                      </TableCell>
                      <TableCell>{subscriber.date}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{subscriber.source}</Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-destructive hover:text-destructive/90"
                              title="Delete subscriber"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This action cannot be undone. This will
                                permanently remove the subscriber with email "
                                {subscriber.email}" from your subscriber list.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() =>
                                  handleDeleteSubscriber(subscriber.id)
                                }
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
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

export default SubscribersList;
