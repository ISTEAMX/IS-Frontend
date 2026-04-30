import api from "@/api/axiosInstance";

export function reportError(error: unknown, source = "unknown") {
  try {
    const message =
      error instanceof Error ? error.message : String(error);
    const stack =
      error instanceof Error ? error.stack ?? "" : "";

    api.post(
      "/monitoring/error",
      {
        message,
        stack: stack.substring(0, 2000),
        source,
        url: window.location.href,
      }
    ).catch(() => {});
  } catch {
    void 0;
  }
}
