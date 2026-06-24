import Link from "next/link";
import type { LogSummary } from "@/app/types";
import { formatDate } from "@/lib/utils/formatDate";

type Props = {
  log: LogSummary;
};
export default function LogCard({ log }: Props) {
  return (
    <>
      <Link
        href={`/logs/${log.id}`}
        className="
        block rounded-2xl border border-slate-200 bg-white p-5
        transition hover:bg-slate-50
      "
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-lg font-medium text-slate-900">{log.title}</h2>
            <div className="mt-2 flex items-center gap-2 text-sm text-slate-500">
              <span>{log.visibility}</span>
              <span>・</span>
              <span>{log.minutes}分</span>
            </div>
          </div>
          <span className="text-xs text-slate-400">
            {formatDate(log.updatedAt)}
          </span>
        </div>
        <p className="mt-4 text-sm leading-7 text-slate-600">
          {log.contentPreview}
        </p>
        {log.tags && log.tags.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {log.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-slate-200 px-3 py-1 text-xs text-slate-500"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </Link>
    </>
  );
}
