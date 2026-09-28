"use client";
import { useState } from "react";

export function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000); // 2 sn sonra eski haline dön
  }

  return (
    <button
      onClick={copy}
      className="rounded-md border border-zinc-300 px-3 py-1 text-sm font-medium hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-900"
    >
      {copied ? "Kopyalandı ✓" : "Kopyala"}
    </button>
  );
}
