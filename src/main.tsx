import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { BrowserRouter } from "react-router-dom";
import { reportError } from "./services/errorReportService";
import "./index.css";

window.addEventListener("error", (event) => {
  reportError(event.error ?? event.message, "window.onerror");
});

window.addEventListener("unhandledrejection", (event) => {
  reportError(event.reason, "unhandledrejection");
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
);
