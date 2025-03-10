import React from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { Button } from "../ui/button";
import {
  PenSquare,
  LayoutDashboard,
  Settings,
  LogOut,
  Mail,
  MessageSquare,
} from "lucide-react";

const AdminLayout = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="border-b bg-card">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center">
            <Link to="/" className="text-2xl font-bold text-primary mr-8">
              BlogHub
            </Link>
            <nav className="hidden md:flex items-center space-x-4">
              <Link to="/admin">
                <Button
                  variant={isActive("/admin") ? "default" : "ghost"}
                  className="flex items-center gap-2"
                >
                  <LayoutDashboard className="h-4 w-4" />
                  Dashboard
                </Button>
              </Link>
              <Link to="/create">
                <Button
                  variant={isActive("/create") ? "default" : "ghost"}
                  className="flex items-center gap-2"
                >
                  <PenSquare className="h-4 w-4" />
                  New Post
                </Button>
              </Link>
              <Link to="/admin/subscribers">
                <Button
                  variant={isActive("/admin/subscribers") ? "default" : "ghost"}
                  className="flex items-center gap-2"
                >
                  <Mail className="h-4 w-4" />
                  Subscribers
                </Button>
              </Link>
              <Link to="/admin/contacts">
                <Button
                  variant={isActive("/admin/contacts") ? "default" : "ghost"}
                  className="flex items-center gap-2"
                >
                  <MessageSquare className="h-4 w-4" />
                  Contact Messages
                </Button>
              </Link>
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2">
              <span className="text-sm font-medium">
                {user?.name || "Admin"}
              </span>
            </div>
            <Button variant="outline" size="sm" onClick={logout}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
