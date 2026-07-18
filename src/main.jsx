import { StrictMode } from "react";
import { createRoot } from "react-dom/client";


import { Toaster } from "sonner";

import App from "./App";
import "./index.css";

import { QueryClient } from "@tanstack/react-query";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 5,
    },
  },
});

createRoot(document.getElementById("root")).render(
  <>

    <App />

    <Toaster
      position="top-right"
      richColors
      closeButton
    />
  </>



);