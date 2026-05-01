import { Toaster } from "react-hot-toast";
import { Component, type ReactNode, type ErrorInfo } from "react";
import { reportError } from "./services/errorReportService";
import AppRouter from "./routes/AppRouter";
import { useBackendHealth } from "./hooks/useBackendHealth";
import OfflinePage from "./pages/offline/OfflinePage";

class ErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean }> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    reportError(error, `react:${info.componentStack ?? "unknown"}`);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: "2rem", textAlign: "center" }}>
          <h1>Something went wrong</h1>
          <p>An unexpected error occurred. Please refresh the page.</p>
          <button onClick={() => window.location.reload()}>Refresh</button>
        </div>
      );
    }
    return this.props.children;
  }
}

function App() {
  const { isBackendUp, checking, retry } = useBackendHealth();

  if (checking) return null; // brief initial check

  if (!isBackendUp) return <OfflinePage onRetry={retry} />;

  return (
    <ErrorBoundary>
      <Toaster />
      <AppRouter />
    </ErrorBoundary>
  );
}

export default App;
