import "server-only";

import { cookies } from "next/headers";
import { getApiBase } from "@/lib/api/apiBase";

type ServerFetchOptions = Omit<RequestInit, "headers"> & {
  headers?: HeadersInit;
};

export async function serverFetch(
  path: string,
  options: ServerFetchOptions = {},
) {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore.toString();
  const headers: HeadersInit = {
    ...options.headers,
    ...(cookieHeader ? { Cookie: cookieHeader } : {}),
  };

  return fetch(`${getApiBase()}${path}`, {
    ...options,
    headers,
    cache: options.cache ?? "no-store",
  });
}

