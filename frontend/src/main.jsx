import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      stateTime: 1000 * 60 * 5,
    },
  },
});

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <App />
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: "#2d2d2d",
              color: "#e8e8e8",
              border: "1px solid #3d3d3d",
              borderRadius: "8px",
              fontSize: "14px",
            },
          }}
        />
      </QueryClientProvider>
    </BrowserRouter>
  </StrictMode>,
);
