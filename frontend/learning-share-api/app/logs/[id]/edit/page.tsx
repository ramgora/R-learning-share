"use client";

import { ShareLogResponse, Visibility } from "@/app/types";
import DeleteConfirmModal from "@/components/common/DeleteConfirmMordal";
import { clientFetch } from "@/lib/api/clientFetch";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

type ValidationErrors = {
  title?: string;
  content?: string;
  minutes?: string;
};

export default function EditLogPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const id = params?.id;

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [minutes, setMinutes] = useState<number | undefined>(undefined);
  const [visibility, setVisibility] = useState<Visibility>("PRIVATE");
  const [tagText, setTagText] = useState("");

  const [error, setError] = useState<string | null>(null);
  const [validErrors, setValidErrors] = useState<ValidationErrors>({});
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [isOpen, setIsOpen] = useState(false);

  const tags = useMemo(() => {
    return tagText
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
  }, [tagText]);

  useEffect(() => {
    if (!id) return;
    let mounted = true;
    const load = async () => {
      setError(null);
      setFetching(true);
      try {
        const res = await clientFetch(`/logs/${id}`, {
          method: "GET",
        });
        if (!res.ok) {
          setError("ログの取得に失敗しました。");
          return;
        }
        const log: ShareLogResponse = await res.json();
        if (!mounted) return;
        setTitle(log.title ?? "");
        setContent(log.content ?? "");
        setMinutes(log.minutes);
        setVisibility(log.visibility);
        setTagText(log.tags?.join(",") ?? "");
      } catch {
        if (!mounted) return;
        setError("ネットワークエラーが発生しました。");
      } finally {
        if (mounted) {
          setFetching(false);
        }
      }
    };
    load();
    return () => {
      mounted = false;
    };
  }, [id]);

  const validate = (): ValidationErrors => {
    const nextErrors: ValidationErrors = {};
    if (!title.trim()) {
      nextErrors.title = "入力必須項目です。";
    }
    if (!content.trim()) {
      nextErrors.content = "内容は必須入力項目です。";
    }
    if (minutes === undefined || minutes === null || Number.isNaN(minutes)) {
      nextErrors.minutes = "学習時間は必須です。";
    } else if (minutes < 0 || minutes > 1440) {
      nextErrors.minutes = "学習時間は0以上1440以下で入力してください。";
    }
    return nextErrors;
  };

  // 更新ボタンクリック処理
  const onUpdate = async () => {
    if (!id) return;
    setError(null);
    const nextErrors = validate();
    if (Object.keys(nextErrors).length > 0) {
      setValidErrors(nextErrors);
      return;
    }
    setValidErrors({});
    setLoading(true);
    try {
      const res = await clientFetch(`/logs/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          content: content.trim(),
          minutes,
          visibility,
          tags,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data?.message ?? "更新に失敗しました。");
        return;
      }
      router.push(`/logs/${id}`);
      router.refresh();
    } catch {
      setError("ネットワークエラーが発生しました。");
    } finally {
      setLoading(false);
    }
  };

  // 削除ボタンクリック処理
  const onDelete = async () => {
    if (!id) return;
    setError(null);
    setLoading(true);
    try {
      const res = await clientFetch(`/logs/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data?.message ?? "削除に失敗しました。");
        return;
      }
      setIsOpen(false);
      router.push("/logs");
      router.refresh();
    } catch {
      setError("ネットワークエラーが発生しました。");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return <div className="mx-auto max-w-2xl px-4 py-10">読み込み中...</div>;
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <div className="mb-6 flex items-center justify-between gap-3">
        <h1 className="text-3xl font-semibold tracking-tight text-foreground">
          学習ログを編集する
        </h1>
        <Link
          href={id ? `/logs/${id}` : "/logs"}
          className="text-sm font-medium text-slate-500 hover:text-slate-900"
        >
          キャンセル
        </Link>
      </div>

      <div className="rounded-2xl border border-border/60 bg-background/80 p-6 shadow-sm backdrop-blur">
        <div className="grid gap-5">
          <div className="grid gap-2">
            <label className="text-sm font-medium text-foreground">
              タイトル*
            </label>
            <input
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (validErrors.title) {
                  setValidErrors((prev) => ({ ...prev, title: undefined }));
                }
              }}
              className={`h-11 rounded-xl border bg-background px-4 text-sm outline-none focus:ring-2 focus:ring-ring/20 ${
                validErrors.title
                  ? "border-red-400 focus:border-red-400"
                  : "border-border/60 focus:border-border"
              }`}
              placeholder="タイトルを入力してください。"
            />
            {validErrors.title && (
              <p className="text-xs text-red-500">{validErrors.title}</p>
            )}
          </div>

          <div className="grid gap-2">
            <label className="text-sm font-medium text-foreground">内容*</label>
            <textarea
              value={content}
              onChange={(e) => {
                setContent(e.target.value);
                if (validErrors.content) {
                  setValidErrors((prev) => ({ ...prev, content: undefined }));
                }
              }}
              className={`min-h-40 rounded-xl border bg-background px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring/20 ${
                validErrors.content
                  ? "border-red-400 focus:border-red-400"
                  : "border-border/60 focus:border-border"
              }`}
              placeholder="今日やったこと、気づき、詰まった点など..."
            />
            {validErrors.content && (
              <p className="text-xs text-red-500">{validErrors.content}</p>
            )}
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div className="grid gap-2">
              <label className="text-sm font-medium text-foreground">
                学習時間(分)
              </label>
              <input
                type="number"
                inputMode="numeric"
                value={minutes ?? ""}
                onChange={(e) => {
                  const value = e.target.value;
                  setMinutes(value === "" ? undefined : Number(value));
                  if (validErrors.minutes) {
                    setValidErrors((prev) => ({ ...prev, minutes: undefined }));
                  }
                }}
                className={`h-11 rounded-xl border bg-background px-4 text-sm outline-none focus:ring-2 focus:ring-ring/20 ${
                  validErrors.minutes
                    ? "border-red-400 focus:border-red-400"
                    : "border-border/60 focus:border-border"
                }`}
              />
              {validErrors.minutes && (
                <p className="text-xs text-red-500">{validErrors.minutes}</p>
              )}
            </div>

            <div className="grid gap-2">
              <label className="text-sm font-medium text-foreground">
                公開範囲
              </label>
              <select
                value={visibility}
                onChange={(e) => setVisibility(e.target.value as Visibility)}
                className="h-11 rounded-xl border border-border/60 bg-background px-4 text-sm outline-none focus:border-border focus:ring-2 focus:ring-ring/20"
              >
                <option value="PRIVATE">PRIVATE(自分だけ)</option>
                <option value="LINK">LINK(URLを知ってる人だけ)</option>
                <option value="PUBLIC">PUBLIC(誰でも)</option>
              </select>
            </div>
          </div>

          <div className="grid gap-2">
            <label className="text-sm font-medium text-foreground">タグ</label>
            <input
              value={tagText}
              onChange={(e) => setTagText(e.target.value)}
              className="h-11 rounded-xl border border-border/60 bg-background px-4 text-sm outline-none focus:border-border focus:ring-2 focus:ring-ring/20"
              placeholder="react,nextjs,api,java..."
            />
            <p className="text-xs text-muted-foreground">
              カンマ区切りで入力できます
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onUpdate}
              disabled={loading}
              className="h-11 rounded-xl bg-sky-600 px-5 text-sm font-medium text-white hover:bg-sky-700 active:bg-sky-800 disabled:opacity-50"
            >
              {loading ? "更新中..." : "更新する"}
            </button>
            <button
              type="button"
              onClick={() => setIsOpen(true)}
              disabled={loading}
              className="h-11 rounded-xl bg-red-700 px-5 text-sm font-medium text-white hover:bg-red-800 active:bg-red-900 disabled:opacity-50"
            >
              {loading ? "更新中..." : "削除"}
            </button>
            {error && <p className="text-sm text-red-500">{error}</p>}
          </div>
        </div>
      </div>
      <DeleteConfirmModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onConfirm={onDelete}
      />
    </div>
  );
}
