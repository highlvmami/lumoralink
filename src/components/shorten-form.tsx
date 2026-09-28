"use client";
// Client Component: kullanıcı etkileşimi (yazma, tıklama, kopyalama) tarayıcıda çalışır.
// Bu yüzden dosyanın başında "use client" var.
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ui } from "@/lib/ui";

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
          aria-label="Kısaltılacak adres"
          className={ui.input}
        />
        <div className="flex flex-col gap-3 sm:flex-row">
          <input
            type="text"
            value={customSlug}
            onChange={(e) => setCustomSlug(e.target.value)}
            placeholder="Özel kısa ad (isteğe bağlı)"
            aria-label="Özel kısa ad"
            className={`${ui.input} sm:flex-1`}
          />
          <button type="submit" disabled={loading} className={`${ui.btnPrimary} sm:px-8`}>
            {loading ? "Kısaltılıyor..." : "Kısalt"}
          </button>
        </div>
      </form>

      {error && <p className={ui.error}>{error}</p>}

      {result && (
        <div className="flex items-center justify-between gap-3 rounded-xl border border-soft-strong bg-soft px-4 py-3">
          <div className="min-w-0">
            <p className="text-xs font-medium text-muted">Kısa linkin hazır</p>
            <a href={result.shortUrl} target="_blank" className="block truncate font-mono font-medium text-brand underline-offset-2 hover:underline">
              {result.shortUrl}
            </a>
          </div>
          <button onClick={copy} className={`${ui.btnSecondary} shrink-0`}>
            {copied ? "Kopyalandı ✓" : "Kopyala"}
          </button>
        </div>
      )}
    </div>
  );
}
