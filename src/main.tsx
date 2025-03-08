import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";

// Import the dev tools and initialize them
import { TempoDevtools } from "tempo-devtools";
TempoDevtools.init();

const basename = import.meta.env.BASE_URL;

// Initialize theme from localStorage
const initializeTheme = () => {
  try {
    const savedTheme = localStorage.getItem("theme") || "light";
    document.documentElement.setAttribute("data-theme", savedTheme);
    document.documentElement.classList.toggle("dark", savedTheme === "dark");

    // Force repaint to apply theme
    document.body.style.display = "none";
    document.body.offsetHeight; // Trigger a reflow
    document.body.style.display = "";
  } catch (error) {
    console.error("Error initializing theme:", error);
    // Fallback to light theme
    document.documentElement.setAttribute("data-theme", "light");
  }
};

// Call the function before rendering
initializeTheme();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter basename={basename}>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
);
