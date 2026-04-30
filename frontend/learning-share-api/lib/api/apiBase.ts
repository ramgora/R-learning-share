const DEFAULT_API_BASE = "http://localhost:8080/api";

export function getApiBase() {
  return (
    process.env.NEXT_PUBLIC_API_BASE ??
    process.env.API_BASE ??
    DEFAULT_API_BASE
  );
}

