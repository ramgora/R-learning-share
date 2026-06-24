import { ShareLogResponse } from "@/app/types";
import { serverFetch } from "@/lib/api/serverFetch";
import { formatDate } from "@/lib/utils/formatDate";
import { headers } from "next/headers";
import Link from "next/link";
import { notFound } from "next/navigation";
import ShareTokenField from "./ShareTokenField";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function LogDetailPage({ params }: Props) {
  const { id } = await params;

  const res = await serverFetch(`/logs/${id}`, {
    method: "GET",
    credentials: "include",
  });
  if (res.status === 401) {
    throw new Error("UNAUTHORIZED");
  }

  if (res.status === 404) {
    notFound();
  }

  if (!res.ok) {
    throw new Error("FAILED_TO_FETCH_LOG");
  }

  const log: ShareLogResponse = await res.json();
  const requestHeaders = await headers();
  const host =
    requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host");
  const protocol =
    requestHeaders.get("x-forwarded-proto") ??
    (host?.includes("localhost") ? "http" : "https");
  const shareUrl = log.shareToken
    ? host
      ? `${protocol}://${host}/share/${log.shareToken}`
      : `/share/${log.shareToken}`
    : null;

  return (
    <div className="mx-auto max-w-3xl px-6 py-10">
      <article className="flex flex-col gap-8 rounded-2xl border border-slate-200 bg-white shadow-sm p-8">
        <nav className="flex items-center justify-between gap-3">
          <Link
            href="/logs"
            className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-slate-900"
          >
            <span aria-hidden="true">←</span>
            <span>戻る</span>
          </Link>
          <Link
            href={`/logs/${id}/edit`}
            className="inline-flex items-center rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
          >
            編集する
          </Link>
        </nav>

        <header className="flex flex-col gap-4">
          <h1 className="text-3xl font-semibold tracking-tight  text-slate-900">
            {log.title}
          </h1>
          <div className="flex flex-wrap gap-3">
            <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-sm">
              学習時間: {log.minutes}分
            </span>
            <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-sm">
              閲覧権限: {log.visibility}
            </span>
            <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-sm">
              作成日時: {formatDate(log.createdAt)}
            </span>
          </div>
        </header>

        <section className="rounded-2xl bg-slate-50 p-6">
          <div className="whitespace-pre-wrap text-[15px] leading-6 text-slate-800">
            {log.content}
          </div>
        </section>

        <footer>
          {shareUrl && (
            <div className="flex flex-col gap-2">
              <span className="text-sm text-slate-500">シェアURL</span>
              <ShareTokenField shareUrl={shareUrl} />
            </div>
          )}
          {log.tags && log.tags.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {log.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-sm text-slate-600"
                >
                  {tag}
                </span>
              ))}
            </div>
          ) : null}
        </footer>
      </article>
    </div>
  );
}
