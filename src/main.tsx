import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

// #region agent log
fetch("http://127.0.0.1:7243/ingest/907c7da4-4382-484e-ac88-3f2d2913f847", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    location: "main.tsx:4",
    message: "Script started",
    data: { userAgent: navigator.userAgent },
    timestamp: Date.now(),
    sessionId: "debug-session",
    runId: "run1",
    hypothesisId: "B",
  }),
}).catch(() => {});
// #endregion

import "./index.css";

// #region agent log
fetch("http://127.0.0.1:7243/ingest/907c7da4-4382-484e-ac88-3f2d2913f847", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    location: "main.tsx:9",
    message: "CSS imported successfully",
    data: {},
    timestamp: Date.now(),
    sessionId: "debug-session",
    runId: "run1",
    hypothesisId: "A",
  }),
}).catch(() => {});
// #endregion

import App from "./App.tsx";

// #region agent log
fetch("http://127.0.0.1:7243/ingest/907c7da4-4382-484e-ac88-3f2d2913f847", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    location: "main.tsx:14",
    message: "App imported",
    data: {},
    timestamp: Date.now(),
    sessionId: "debug-session",
    runId: "run1",
    hypothesisId: "C",
  }),
}).catch(() => {});
// #endregion

const rootElement = document.getElementById("root");
// #region agent log
fetch("http://127.0.0.1:7243/ingest/907c7da4-4382-484e-ac88-3f2d2913f847", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    location: "main.tsx:19",
    message: "Root element check",
    data: { found: !!rootElement },
    timestamp: Date.now(),
    sessionId: "debug-session",
    runId: "run1",
    hypothesisId: "E",
  }),
}).catch(() => {});
// #endregion

if (rootElement) {
  createRoot(rootElement).render(
    <StrictMode>
      <App />
    </StrictMode>
  );
  // #region agent log
  fetch("http://127.0.0.1:7243/ingest/907c7da4-4382-484e-ac88-3f2d2913f847", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      location: "main.tsx:30",
      message: "React render called",
      data: {},
      timestamp: Date.now(),
      sessionId: "debug-session",
      runId: "run1",
      hypothesisId: "E",
    }),
  }).catch(() => {});
  // #endregion
}

// #region agent log
window.addEventListener("error", (e) => {
  fetch("http://127.0.0.1:7243/ingest/907c7da4-4382-484e-ac88-3f2d2913f847", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      location: "main.tsx:error",
      message: "Global error caught",
      data: {
        error: e.message,
        filename: e.filename,
        lineno: e.lineno,
        colno: e.colno,
      },
      timestamp: Date.now(),
      sessionId: "debug-session",
      runId: "run1",
      hypothesisId: "B",
    }),
  }).catch(() => {});
});
window.addEventListener("unhandledrejection", (e) => {
  fetch("http://127.0.0.1:7243/ingest/907c7da4-4382-484e-ac88-3f2d2913f847", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      location: "main.tsx:promise-error",
      message: "Unhandled promise rejection",
      data: { reason: String(e.reason) },
      timestamp: Date.now(),
      sessionId: "debug-session",
      runId: "run1",
      hypothesisId: "B",
    }),
  }).catch(() => {});
});
// #endregion
