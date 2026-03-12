import { notFound } from "next/navigation";
import { ShareLogResponse } from "@/app/types";

type PageProps = {
  params: Promise<{
    token: string;
  }>;
};

const API_BASE = "http://localhost:8080/api";

function formatDate(dateString: string) {
  const date = new Date(dateString);

  return new Intl.DateTimeFormat("ja-JP", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

const getLog = async (token: string): Promise<ShareLogResponse> => {
  const res = await fetch(`${API_BASE}/share/${token}`, {
    cache: "no-store", // キャッシュに頼らず毎回取りに行く
  });
  if (res.status === 404) {
    notFound();
  }

  if (!res.ok) {
    throw new Error("学習ログの取得に失敗しました....");
  }
  return res.json();
};

export default async function GetShareLogsPage({ params }: PageProps) {
  const { token } = await params;
  const log = await getLog(token);
  console.log("title", log.title);
  console.log("log", log);
  return (
    <>
      <main>
        <div className="mx-auto max-w-3xl">
          <div className="mb-8">
            <span className="inline-flex rounded-full border border-slate-200 px-3 py-1 text-xs font-medium text-slate-600">
              Shared Learning Log
            </span>
          </div>
        </div>
        <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <header className="mb-6 border-b border-slate-100 pb-6">
            <h1 className="mb-4 text-3xl font-bold tracking-tight">
              {log.title}
            </h1>
            <div className="flex flex-wrap gap-3 text-sm text-slate-600">
              <span className="rounded-full bg-slate-100 px-3 py-1">
                学習時間: {log.minutes}分
              </span>
              <span className="rounded-full bg-slate-100 px-3 py-1">
                閲覧権限: {log.visibility}
              </span>
              <span className="rounded-full bg-slate-100 px-3 py-1">
                作成日時: {formatDate(log.createdAt)}
              </span>
            </div>
          </header>
          <section>
            <h2 className="mb-3 text-sm font-semibold text-slate-500">内容</h2>
            <div className="whitespace-pre-wrap break-words rounded-xl bg-slate-50 p-4 leading-7 text-slate-800">
              {log.content || "内容はありません"}
            </div>
          </section>
          <section>
            {log?.tags?.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {log.tags.map((tag) => (
                  <span key={tag}>{tag}</span>
                ))}
              </div>
            ) : (
              <span>ここにタグ表示させる予定</span>
            )}
          </section>
        </article>
      </main>
    </>
  );
}
