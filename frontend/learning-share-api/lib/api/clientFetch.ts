import { getApiBase } from "@/lib/api/apiBase";

type ClientFetchOptions = Omit<RequestInit, "headers"> & {
  headers?: HeadersInit;
};

export async function clientFetch(
  path: string,
  options: ClientFetchOptions = {},
) {
  return fetch(`${getApiBase()}${path}`, {
    ...options,
    credentials: options.credentials ?? "include",
  });
}

