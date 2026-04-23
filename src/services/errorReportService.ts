import axios from "axios";

const baseURL = import.meta.env.VITE_API_URL
  ? `${import.meta.env.VITE_API_URL}/api`
  : "/api";

export function reportError(error: unknown, source = "unknown") {
  try {
    const message =
      error instanceof Error ? error.message : String(error);
    const stack =
      error instanceof Error ? error.stack ?? "" : "";

    axios.post(
      `${baseURL}/monitoring/error`,
      {
        message,
        stack: stack.substring(0, 2000),
        source,
        url: window.location.href,
      }
    ).catch(() => {});
  } catch {
  }
}



