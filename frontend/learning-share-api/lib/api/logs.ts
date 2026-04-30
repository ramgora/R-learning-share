import "server-only";

import type { LogSummary } from "@/app/types";
import { serverFetch } from "@/lib/api/serverFetch";

export async function getMyLogs(): Promise<LogSummary[]> {
  const res = await serverFetch("/logs/me", {
    method: "GET",
    credentials: "include",
  });

  if (res.status === 401) {
    throw new Error("UNAUTHORIZED");
  }

  if (!res.ok) {
    throw new Error("FAILED_TO_FETCH_LOGS");
  }

  return res.json();
}

