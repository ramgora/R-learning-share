"use client";

import { clientFetch } from "@/lib/api/clientFetch";
import { useRouter } from "next/navigation";

export function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      const res = await clientFetch("/auth/logout", { method: "POST" });
      if (!res.ok) {
        console.error("ログアウトに失敗しました");
        return;
      }
      router.push("/login");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <button
      type="button"
      onClick={handleLogout}
      className="rounded-xl border border-slate-200 px-4 py-2 text-sm text-slate-700 transition hover:bg-slate-50"
    >
      ログアウト
    </button>
  );
}
