"use client";

import { useState } from "react";

type Props = {
  shareUrl: string;
};

export default function ShareTokenField({ shareUrl }: Props) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="flex items-center gap-2">
      <input
        value={shareUrl}
        readOnly
        className="min-w-0 flex-1 rounded-lg border border-slate-200 px-3 py-2 text-sm"
      />

      <button
        type="button"
        onClick={handleCopy}
        className="shrink-0 whitespace-nowrap rounded-lg border border-slate-200 px-3 py-2 text-sm hover:bg-slate-50"
      >
        {copied ? "コピー済み" : "コピー"}
      </button>
    </div>
  );
}
