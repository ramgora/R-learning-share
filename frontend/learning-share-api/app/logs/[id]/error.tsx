"use client";

import Link from "next/link";

type Props = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function LogDetailErrorPage({ reset }: Props) {
  return (
    <div className="mx-auto max-w-3xl px-6 py-10">
      <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="flex flex-col gap-4">
          <p className="text-sm font-medium text-slate-500">Error</p>

          <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
            エラーが発生しました
          </h1>

          <p className="text-[15px] leading-7 text-slate-700">
            学習ログの取得中に問題が発生しました。時間をおいて再度お試しください。
          </p>

          <div className="flex flex-wrap gap-3 pt-2">
            <button
              type="button"
              onClick={reset}
              className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
            >
              再試行する
            </button>

            <Link
              href="/logs"
              className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-500 transition hover:text-slate-900"
            >
              <span aria-hidden="true">←</span>
              <span>一覧へ戻る</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
