"use client";

import { useEffect } from "react";

export function ErrorHandler() {
  useEffect(() => {
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      const rawReason = event.reason;
      const reason = rawReason === undefined ? "Unknown promise rejection reason" : rawReason;

      let normalizedReason: string;
      try {
        if (reason instanceof Error) {
          normalizedReason = reason.stack || reason.message || String(reason);
        } else if (typeof reason === "object" && reason !== null) {
          normalizedReason = JSON.stringify(reason, null, 2) ?? String(reason);
        } else if (typeof reason === "symbol") {
          normalizedReason = reason.toString();
        } else {
          normalizedReason = String(reason);
        }
      } catch (error) {
        normalizedReason = "Unknown promise rejection reason";
      }

      console.error("Unhandled promise rejection:", normalizedReason);
      // Prevent the default browser behavior (logging to console)
      event.preventDefault();
    };

    const handleUnhandledError = (event: ErrorEvent) => {
      console.error("Unhandled error:", event.error ?? "Unknown error");
      // Prevent the default browser behavior
      event.preventDefault();
    };

    window.addEventListener("unhandledrejection", handleUnhandledRejection);
    window.addEventListener("error", handleUnhandledError);

    return () => {
      window.removeEventListener("unhandledrejection", handleUnhandledRejection);
      window.removeEventListener("error", handleUnhandledError);
    };
  }, []);

  return null;
}