"use client";
// Client Component: kullanıcı etkileşimi (yazma, tıklama, kopyalama) tarayıcıda çalışır.
// Bu yüzden dosyanın başında "use client" var.
import { useState } from "react";
import { useRouter } from "next/navigation";

type Result = { shortUrl: string; url: string };

export function ShortenForm() {
  const router = useRouter();
  const [url, setUrl] = useState("");
  const [customSlug, setCustomSlug] = useState("");
  const [result, setResult] = useState<Result | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); // sayfanın yeniden yüklenmesini engelle
    setLoading(true);
    setError(null);
    setResult(null);
    setCopied(false);

    try {
      const response = await fetch("/api/links", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url, customSlug: customSlug.trim() || undefined }),
      });
      const data = await response.json();

      if (!response.ok) {
        // Alan bazlı hata varsa ilkini göster, yoksa genel mesajı
        const fieldError = data.fields && Object.values(data.fields).flat()[0];
        setError((fieldError as string) ?? data.error ?? "Bir hata oluştu");
        return;
      }

      setResult(data);
      setUrl("");
      setCustomSlug("");
      router.refresh(); // sunucudaki "son linkler" listesini yenile
    } catch {
      setError("Sunucuya ulaşılamadı");
    } finally {
      setLoading(false);
    }
  }

  async function copy() {
    if (!result) return;
    await navigator.clipboard.writeText(result.shortUrl);
    setCopied(true);
  }

  return (
    <div className="w-full space-y-4">
      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="url"
          required
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://cok-uzun-bir-adres.com/..."
          className="w-full rounded-lg border border-zinc-300 bg-transparent px-4 py-3 outline-none focus:border-zinc-500 dark:border-zinc-700"
        />
        <div className="flex flex-col gap-3 sm:flex-row">
          <input
            type="text"
            value={customSlug}
            onChange={(e) => setCustomSlug(e.target.value)}
            placeholder="Özel kısa ad (isteğe bağlı)"
            className="flex-1 rounded-lg border border-zinc-300 bg-transparent px-4 py-3 outline-none focus:border-zinc-500 dark:border-zinc-700"
          />
          <button
            type="submit"
            disabled={loading}
            className="rounded-lg bg-zinc-900 px-6 py-3 font-medium text-white disabled:opacity-50 dark:bg-white dark:text-black"
          >
            {loading ? "Kısaltılıyor..." : "Kısalt"}
          </button>
        </div>
      </form>

      {error && (
        <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700 dark:bg-red-950 dark:text-red-300">
          {error}
        </p>
      )}

      {result && (
        <div className="flex items-center justify-between gap-3 rounded-lg bg-green-50 px-4 py-3 dark:bg-green-950">
          <a
            href={result.shortUrl}
            target="_blank"
            className="truncate font-mono text-green-800 underline dark:text-green-300"
          >
            {result.shortUrl}
          </a>
          <button onClick={copy} className="shrink-0 text-sm font-medium">
            {copied ? "Kopyalandı ✓" : "Kopyala"}
          </button>
        </div>
      )}
    </div>
  );
}
