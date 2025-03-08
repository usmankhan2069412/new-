import { Suspense } from "react";
import { useRoutes, Routes, Route } from "react-router-dom";
import Home from "./components/home";
import CreatePost from "./components/CreatePost";
import BlogDetail from "./components/BlogDetail";
import ContactUs from "./components/ContactUs";
import LoginForm from "./components/auth/LoginForm";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import { AuthProvider } from "./components/auth/AuthContext";
import routes from "./tempo-routes";

function App() {
  // Use Tempo routes
  const tempoRoutes =
    import.meta.env.VITE_TEMPO === "true" ? useRoutes(routes) : null;

  return (
    <AuthProvider>
      <Suspense fallback={<p>Loading...</p>}>
        {tempoRoutes}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<LoginForm />} />
          <Route
            path="/create"
            element={
              <ProtectedRoute adminOnly={true}>
                <CreatePost />
              </ProtectedRoute>
            }
          />
          <Route path="/post/:postId" element={<BlogDetail />} />
          <Route path="/contact" element={<ContactUs />} />
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
