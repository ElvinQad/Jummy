import React from "react";
import { createRoot } from "react-dom/client";
import { AnimatePresence } from "framer-motion";
import AppRouter from "./Router";
import { Toaster } from "./components/ui/toaster";

import "./style.css";
import { GoogleOAuthProvider } from "@react-oauth/google";
import ErrorBoundary from "./components/ErrorBoundary";
import ErrorFallback from "./components/ErrorFallback";
import useAuthSync from "./components/auth/useAuthSync";

const root = createRoot(document.getElementById("root") as HTMLElement);
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

function App() {
  useAuthSync();
  return (
    <React.Suspense fallback={<div>Loading...</div>}>
      <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
        <AnimatePresence mode="wait">
          <AppRouter />
        </AnimatePresence>
        <Toaster />
      </GoogleOAuthProvider>
    </React.Suspense>
  );
}

root.render(
  <React.StrictMode>
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);
