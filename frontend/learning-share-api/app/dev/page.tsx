"use client";

import { useState } from "react";

type ApiResult = Record<string, unknown>;
type Method = "GET" | "POST";

export default function DevPage() {
  const [result, setResult] = useState<ApiResult | null>(null);

  const call = async (path: string, method: Method, contents?: unknown) => {
    const options: RequestInit = {
      method,
      credentials: "include",
    };

    // contents がある = ボディ付きのリクエスト（主にPOST/PATCH）
    if (contents !== undefined) {
      options.headers = { "Content-Type": "application/json" };
      options.body = JSON.stringify(contents);
    }

    const res = await fetch(`http://localhost:8080${path}`, options);

    const data = await res.json().catch(() => ({}));
    setResult({ status: res.status, data });
  };

  return (
    <main style={{ padding: 24 }}>
      <h1>/dev（認証の動作確認）</h1>

      <div style={{ display: "flex", gap: 12, marginTop: 16 }}>
        <button onClick={() => call("/api/auth/dev-login", "POST")}>
          dev-login（POST）
        </button>

        <button onClick={() => call("/api/auth/me", "GET")}>me（GET）</button>

        <button
          onClick={() =>
            call("/api/logs", "POST", {
              title: "Day5",
              content: "DTOとController",
              minutes: 30,
              tags: ["spring"],
              visibility: "LINK",
            })
          }
        >
          POST /api/logs
        </button>

        <button onClick={() => call("/api/auth/logout", "POST")}>
          logout（POST）
        </button>
      </div>

      <pre style={{ marginTop: 16 }}>
        {result ? JSON.stringify(result, null, 2) : "結果がここに出ます"}
      </pre>
    </main>
  );
}
