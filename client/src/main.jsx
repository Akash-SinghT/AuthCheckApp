import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./style.css";
import App from "./App.jsx";
import { Toaster } from "sonner"; // Import Toaster

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
    <Toaster position="top-right" richColors closeButton /> {/* Global toast */}
  </StrictMode>
);
