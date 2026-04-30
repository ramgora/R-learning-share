import Link from "next/link";

export default function NotFoundPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-10">
      <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="flex flex-col gap-4">
          <p className="text-sm font-medium text-slate-500">404 Not Found</p>

          <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
            ページが見つかりません
          </h1>

          <p className="text-[15px] leading-7 text-slate-700">
            指定された学習ログは存在しないか、現在は閲覧できません。
          </p>

          <Link
            href="/logs"
            className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-slate-900"
          >
            <span aria-hidden="true">←</span>
            <span>一覧へ戻る</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

