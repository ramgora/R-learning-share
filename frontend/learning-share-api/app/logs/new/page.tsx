"use client";

import { useMemo, useState } from "react";
import { clientFetch } from "@/lib/api/clientFetch";
import { useRouter } from "next/navigation";

interface CreateLogRequest {
  title: string;
  content: string;
  minutes: number | undefined;
  visibility: Visibility;
  tags: string[]; // MVP: カンマ区切りを配列化
}

interface CreateLogResponse {
  id: number;
  title?: string;
  visibility: Visibility;
  shareToken: string | null;
  slug: string | null;
  createdAt?: string;
}

interface ValidationErrors {
  title?: string;
  content?: string;
  minutes?: string;
}

type Visibility = "PRIVATE" | "LINK" | "PUBLIC";

export default function NewPageLog() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [minutes, setMinutes] = useState<number | undefined>(undefined);
  const [visibility, setVisibility] = useState<Visibility>("PRIVATE");
  const [tagText, setTagText] = useState("");
  const [result, setResult] = useState<CreateLogResponse | null>(null);

  const [error, setError] = useState<string | null>(null);
  const [validErrors, setValidErrors] = useState<ValidationErrors>({});
  const [loading, setLoading] = useState(false);

  const tags = useMemo(() => {
    return tagText
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
  }, [tagText]);

  const router = useRouter();

  // バリデーション処理
  const validate = (): ValidationErrors => {
    const newErrors: ValidationErrors = {};
    if (!title.trim()) {
      newErrors.title = "入力必須項目です。";
    }
    if (!content.trim()) {
      newErrors.content = "内容は必須入力項目です。";
    }
    if (minutes === undefined || minutes === null || isNaN(minutes)) {
      newErrors.minutes = "学習時間は必須です。";
    } else if (minutes < 0 || minutes > 1440) {
      newErrors.minutes = "学習時間は0以上1440以下で入力してください。";
    }
    return newErrors;
  };

  const onSubmit = async () => {
    setError(null);

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setValidErrors(validationErrors);
      return;
    }

    setValidErrors({});
    setLoading(true);

    const createLogRequest: CreateLogRequest = {
      title: title.trim(),
      content: content.trim(),
      minutes,
      visibility,
      tags,
    };
    try {
      const res = await clientFetch("/logs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(createLogRequest), // JSON形式に変換
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message ?? "作成に失敗しました。");
        return;
      }
      setResult(data);
    } catch {
      setError("NetWorkError");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="mx-auto max-w-2xl  px-4 py-10">
        <div className="mb-6">
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-border/60 bg-secondary/50 px-4 py-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            <span className="text-xs tracking-wide text-muted-foreground">
              {"パブリックベータ公開中"}
            </span>
          </div>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-foreground ">
            学習ログを記録する
          </h1>
        </div>

        <div className="rounded-2xl border border-border/60 bg-background/80 shadow-sm backdrop-blur p-6">
          <div className="grid gap-5">
            <div className="grid gap-2">
              <label className="text-sm font-medium text-foreground">
                タイトル*
              </label>
            </div>
            <input
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (validErrors.title) {
                  setValidErrors((prev) => ({ ...prev, title: undefined }));
                }
              }}
              className={`h-11 rounded-xl border bg-background px-4 text-sm outline-none
                  focus:ring-2 focus:ring-ring/20
                  ${
                    validErrors.title
                      ? "border-red-400 focus:border-red-400"
                      : "border-border/60 focus:border-border"
                  }`}
              placeholder="タイトルを入力してください。"
            />
            {validErrors.title && (
              <p className="text-xs text-red-500 mt-1">{validErrors.title}</p>
            )}

            <div className="grid gap-2">
              <label className="text-sm font-medium text-foreground">
                内容*
              </label>
              <textarea
                value={content}
                onChange={(e) => {
                  setContent(e.target.value);
                  if (validErrors.content) {
                    setValidErrors((prev) => ({
                      ...prev,
                      contents: undefined,
                    }));
                  }
                }}
                className={`min-h-40 rounded-xl border bg-background px-4 py-3 text-sm outline-none
                  focus:ring-2 focus:ring-ring/20
                  ${
                    validErrors.content
                      ? "border-red-400 focus:border-red-400"
                      : "border-border/60 focus:border-border"
                  }`}
                placeholder="今日やったこと、気づき、詰まった点など…"
              />
              {validErrors.content && (
                <p className="text-xs text-red-500 mt-1">
                  {validErrors.content}
                </p>
              )}
            </div>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div className="grid gap-2">
                <label className="text-sm font-medium text-foreground">
                  学習時間(分)
                </label>
                {/* 　//TODO ここのinputにバリデーションをかける */}
                <input
                  type="number"
                  inputMode="numeric"
                  value={minutes ?? ""}
                  onChange={(e) => {
                    const value = e.target.value;
                    setMinutes(value === "" ? undefined : Number(value));
                    if (validErrors.minutes) {
                      setValidErrors((prev) => ({
                        ...prev,
                        minutes: undefined,
                      }));
                    }
                  }}
                  className={`h-11 rounded-xl border bg-background px-4 text-sm outline-none
                    focus:ring-2 focus:ring-ring/20
                    ${
                      validErrors.minutes
                        ? "border-red-400 focus:border-red-400"
                        : "border-border/60 focus:border-border"
                    }`}
                  max={1000}
                />
                {validErrors.minutes && (
                  <p className="text-xs text-red-500 mt-1">
                    {validErrors.minutes}
                  </p>
                )}
              </div>
              <div className="grid gap-2">
                <label className="text-sm font-medium text-foreground">
                  公開範囲
                </label>
                <select
                  value={visibility}
                  onChange={(e) => setVisibility(e.target.value as Visibility)}
                  className="h-11 rounded-xl border border-border/60 bg-background px-4 text-sm outline-none
                focus:border-border focus:ring-2 focus:ring-ring/20"
                >
                  <option value="PRIVATE">PRIVATE(自分だけ)</option>
                  <option value="LINK">LINK(URLを知ってる人だけ)</option>
                  <option value="PUBLIC">PUBLIC(誰でも)</option>
                </select>
              </div>
            </div>
            <div className="grid gap-2">
              {/* バックエンドでタグの処理は未実装 */}
              <label className="text-sm font-medium foreground">タグ</label>
              <input
                value={tagText}
                onChange={(e) => {
                  setTagText(e.target.value);
                }}
                className="h-11 rounded-xl border border-border/60 bg-background px-4 text-sm outline-none
                     focus:border-border focus:ring-2 focus:ring-ring/20"
                placeholder="react,nextjs,api,java..."
              />
              <p className="text-xs text-muted-foreground">
                カンマ区切りで入力できます
              </p>
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {tags.map((t: string) => (
                    <span
                      key={t}
                      className="rounded-full border border-border/60 bg-secondary/40 px-3 py-1 text-xs text-foreground"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              )}
            </div>
            <div>
              <button
                type="button"
                onClick={onSubmit}
                // disabled={!canSubmit}
                className="h-11 rounded-xl bg-foreground px-5 text-sm font-medium text-background
                         hover:opacity-90 active:opacity-80 disabled:opacity-50"
              >
                {loading ? "送信中..." : "作成"}
              </button>
            </div>
            <div>
              {result && (
                <div className="mt-6 rounded-xl border p-4">
                  <p>作成できました</p>

                  {result.shareToken && (
                    <p>
                      シェアURL: http://localhost:3000/share/{result.shareToken}
                    </p>
                  )}

                  {result.slug && (
                    <p>
                      公開URL: http://localhost:3000/u/username/logs/
                      {result.slug}
                    </p>
                  )}
                </div>
              )}
              <button
                type="button"
                onClick={() => router.push("/logs")}
                className="mt-4 rounded-xl bg-blue-600 px-4 py-2 text-white"
              >
                一覧へ戻る
              </button>
            </div>
          </div>
        </div>
        {/* エラー画面は別の画面で実装したい */}
        {error && <div>エラ</div>}
      </div>
    </>
  );
}
