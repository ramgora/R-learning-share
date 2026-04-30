import { PageHeader } from "@/components/common/PageHeader";
import LogCard from "@/components/logs/LogCard";
import { getMyLogs } from "@/lib/api/logs";
import type { LogSummary } from "@/app/types";
import Link from "next/link";

export default async function LogsPage() {
  let logs: LogSummary[] = [];
  let errorMessage = "";

  try {
    logs = await getMyLogs();
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      errorMessage = "ログインが必要です。";
    } else {
      errorMessage = "学習ログの取得に失敗しました。";
    }
  }

  return (
    <main className="mx-auto max-w-5xl px-4 py-8">
      <PageHeader
        title="学習ログ"
        description="これまでの学習記録"
        action={
          <Link
            href="/logs/new"
            className="rounded-xl border border-slate-200 px-4 py-2 text-sm text-slate-700 transition hover:bg-slate-50"
          >
            新規作成
          </Link>
        }
      />

      {errorMessage ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {errorMessage}
        </div>
      ) : logs.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white px-6 py-10 text-center text-slate-500">
          まだ学習ログがありません。
        </div>
      ) : (
        <div className="space-y-4">
          {logs.map((log) => (
            <LogCard key={log.id} log={log} />
          ))}
        </div>
      )}
    </main>
  );
}
