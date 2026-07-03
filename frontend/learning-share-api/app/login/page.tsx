"use client";
import { useState } from "react";
import { clientFetch } from "@/lib/api/clientFetch";
import { useRouter } from "next/navigation";

type AuthResponse = {
  message?: string;
  userId?: number;
};

type ErrorResponse = {
  message?: string;
};

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [registerName, setRegisterName] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage("");
    try {
      const res = await clientFetch("/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
      const data: AuthResponse = await res.json();
      if (!res.ok) {
        setMessage(data.message ?? "ログインに失敗しました");
        return;
      }
      setMessage(data.message ?? "ログイン成功");
      router.push("/logs");
    } catch (error) {
      console.error(error);
      setMessage("通信エラーが発生しました");
    }
  };

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage("");
    try {
      const res = await clientFetch("/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: registerName,
          email: registerEmail,
          password: registerPassword,
        }),
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
      <h1>ログイン画面(改修予定)</h1>

      <section>
        <h2>ログイン</h2>
        <form onSubmit={handleLogin}>
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
      </section>

      <section>
        <h2>新規登録</h2>
        <form onSubmit={handleRegister}>
          <div>
            <label htmlFor="register-name">名前</label>
            <input
              id="register-name"
              type="text"
              value={registerName}
              onChange={(e) => setRegisterName(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="register-email">メールアドレス</label>
            <input
              id="register-email"
              type="email"
              value={registerEmail}
              onChange={(e) => setRegisterEmail(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="register-password">パスワード</label>
            <input
              id="register-password"
              type="password"
              value={registerPassword}
              onChange={(e) => setRegisterPassword(e.target.value)}
            />
          </div>
          <button type="submit">新規登録</button>
        </form>
      </section>

      {message && <p>{message}</p>}
    </main>
  );
}
