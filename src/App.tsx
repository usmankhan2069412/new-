import { Suspense } from "react";
import { useRoutes, Routes, Route } from "react-router-dom";
import Home from "./components/home";
import CreatePost from "./components/CreatePost";
import BlogDetail from "./components/BlogDetail";
import ContactUs from "./components/ContactUs";
import LoginForm from "./components/auth/LoginForm";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import { AuthProvider } from "./components/auth/AuthContext";
import AdminDashboard from "./components/admin/AdminDashboard";
import AdminLayout from "./components/admin/AdminLayout";
import SubscribersList from "./components/admin/SubscribersList";
import ContactSubmissions from "./components/admin/ContactSubmissions";
import UnsubscribePage from "./components/UnsubscribePage";
import { ToastProvider } from "./components/ui/toast-provider";
import routes from "./tempo-routes";

function App() {
  // Use Tempo routes
  const tempoRoutes =
    import.meta.env.VITE_TEMPO === "true" ? useRoutes(routes) : null;

  return (
    <AuthProvider>
      <ToastProvider />
      <Suspense
        fallback={
          <div className="flex items-center justify-center min-h-screen">
            Loading...
          </div>
        }
      >
        {tempoRoutes}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/post/:postId" element={<BlogDetail />} />
          <Route path="/contact" element={<ContactUs />} />

          {/* Admin routes with layout */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute adminOnly={true}>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<AdminDashboard />} />
            <Route path="edit/:postId" element={<CreatePost />} />
            <Route path="subscribers" element={<SubscribersList />} />
            <Route path="contacts" element={<ContactSubmissions />} />
          </Route>

          {/* Keep create post outside the layout for full-screen editing */}
          <Route
            path="/create"
            element={
              <ProtectedRoute adminOnly={true}>
                <CreatePost />
              </ProtectedRoute>
            }
          />

          {/* Unsubscribe page */}
          <Route path="/unsubscribe" element={<UnsubscribePage />} />

          {/* Add this before any catchall route */}
          {import.meta.env.VITE_TEMPO === "true" && (
            <Route path="/tempobook/*" />
          )}
        </Routes>
      </Suspense>
    </AuthProvider>
  );
}

export default App;
