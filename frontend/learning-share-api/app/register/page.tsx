"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { clientFetch } from "@/lib/api/clientFetch";

type AuthResponse = {
  message?: string;
  userId?: number;
};

type ErrorResponse = {
  message?: string;
};

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage("");
    try {
      const res = await clientFetch("/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      });
      const data: AuthResponse & ErrorResponse = await res.json();
      if (!res.ok) {
        setMessage(data.message ?? "登録に失敗しました");
        return;
      }
      setMessage(data.message ?? "登録しました");
      router.push("/logs");
    } catch (error) {
      console.error(error);
      setMessage("通信エラーが発生しました");
    }
  };

  return (
    <main>
      <h1 className="text-center text-2xl font-bold">新規登録</h1>

      <section className="mx-auto max-w-md p-4">
        <form onSubmit={handleRegister}>
          <div>
            <label
              htmlFor="name"
              className="block text-2xl font-medium text-gray-700"
            >
              名前
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-md border-2 border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>
          <div>
            <label
              htmlFor="email"
              className="block text-2xl font-medium text-gray-700"
            >
              メールアドレス
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-md border-2 border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-2xl font-medium text-gray-700"
            >
              パスワード
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-md border-2 border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>
          <button
            type="submit"
            className="mt-4 w-full rounded-md bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700"
          >
            新規登録
          </button>
        </form>
      </section>

      <section className="mx-auto mt-4 max-w-md p-4">
        <Link
          href="/login"
          className="block w-full rounded-md border border-indigo-600 px-4 py-2 text-center text-indigo-600 hover:bg-indigo-50"
        >
          ログインへ戻る
        </Link>
      </section>

      {message && <p className="text-center">{message}</p>}
    </main>
  );
}
