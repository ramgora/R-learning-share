import { notFound } from "next/navigation";
import Link from "next/link";
import { ShareLogResponse } from "@/app/types";
import { formatDate } from "@/lib/utils/formatDate";
import { serverFetch } from "@/lib/api/serverFetch";

type PageProps = {
  params: Promise<{
    token: string;
  }>;
};

const getLog = async (token: string): Promise<ShareLogResponse> => {
  const res = await serverFetch(`/share/${token}`, {
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
  return (
    <main>
      <div className="mx-auto max-w-3xl px-6 py-10">
        <article className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          <div className="mb-6">
            <Link
              href="/logs"
              className="inline-flex rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 transition hover:bg-slate-50"
            >
              一覧へ戻る
            </Link>
          </div>
          <div className="mb-8">
            <span className="inline-flex rounded-full border border-slate-200 px-3 py-1 text-xs font-medium text-slate-600">
              Shared Learning Log
            </span>
          </div>

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
            <div className="whitespace-pre-wrap wrap-break-word rounded-xl bg-slate-50 p-4 leading-7 text-slate-800">
              {log.content || "内容はありません"}
            </div>
          </section>
          <section className="mt-6">
            {log?.tags?.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {log.tags.map((tag) => (
                  <span key={tag}>{tag}</span>
                ))}
              </div>
            ) : (
              <span></span>
            )}
          </section>
        </article>
      </div>
    </main>
  );
}
