"use client";
import { useState } from "react";
import { clientFetch } from "@/lib/api/clientFetch";

type LoginResponse = {
  message?: string;
  userId?: number;
};

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage("");
    try {
      const res = await clientFetch("/auth/dev-login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
      const data: LoginResponse = await res.json();
      if (!res.ok) {
        setMessage(data.message ?? "ログインに失敗しました");
        return;
      }
      setMessage(data.message ?? "ログイン成功");
    } catch (error) {
      console.error(error);
      setMessage("通信エラーが発生しました");
    }
  };

  return (
    <main>
      <h1>ログイン</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email">メールアドレス</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="password">パスワード</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type="submit">ログイン</button>
      </form>
      {message && <p>{message}</p>}
    </main>
  );
}
