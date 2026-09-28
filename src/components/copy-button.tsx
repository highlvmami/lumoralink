"use client";
import { useState } from "react";
import { ui } from "@/lib/ui";

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
      className={ui.btnSecondary}
    >
      {copied ? "Kopyalandı ✓" : "Kopyala"}
    </button>
  );
}
