"use client";
// Link ayarları: hedef adres, aktif/pasif, son kullanma tarihi ve silme.
import { useState } from "react";
import { useRouter } from "next/navigation";

type Props = {
  link: { id: string; url: string; isActive: boolean; expiresAt: string | null };
};

// Türkiye 2016'dan beri yıl boyu UTC+3 (yaz saati yok). Tarih kutusundaki saati
// her zaman Türkiye saati kabul ediyoruz; böylece sunucu ve tarayıcı aynı değeri gösterir.
const TR_OFFSET = "+03:00";

function toInputValue(iso: string | null) {
  if (!iso) return "";
  const local = new Date(new Date(iso).getTime() + 3 * 60 * 60 * 1000); // UTC → TR
  return local.toISOString().slice(0, 16); // "2026-10-01T12:00"
}

const inputClass =
  "w-full rounded-lg border border-zinc-300 bg-transparent px-3 py-2 outline-none focus:border-zinc-500 dark:border-zinc-700";

export function LinkSettings({ link }: Props) {
  const router = useRouter();
  const [url, setUrl] = useState(link.url);
  const [isActive, setIsActive] = useState(link.isActive);
  const [expiresAt, setExpiresAt] = useState(toInputValue(link.expiresAt));
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "ok" | "error"; text: string } | null>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const initialExpiry = toInputValue(link.expiresAt);
  const changed = url !== link.url || isActive !== link.isActive || expiresAt !== initialExpiry;

  async function save(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setMessage(null);

    // Sadece değişen alanları gönderiyoruz (PATCH mantığı)
    const body: Record<string, unknown> = {};
    if (url !== link.url) body.url = url;
    if (isActive !== link.isActive) body.isActive = isActive;
    if (expiresAt !== initialExpiry) body.expiresAt = expiresAt ? `${expiresAt}:00${TR_OFFSET}` : null;

    try {
      const response = await fetch(`/api/links/${link.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await response.json();
      if (!response.ok) {
        const fieldError = data.fields && Object.values(data.fields).flat()[0];
        setMessage({ type: "error", text: (fieldError as string) ?? data.error ?? "Kaydedilemedi" });
        return;
      }
      setMessage({ type: "ok", text: "Kaydedildi" });
      router.refresh(); // sunucudaki sayfa verisini (durum etiketi vb.) yenile
    } catch {
      setMessage({ type: "error", text: "Sunucuya ulaşılamadı" });
    } finally {
      setSaving(false);
    }
  }

  async function remove() {
    setDeleting(true);
    const response = await fetch(`/api/links/${link.id}`, { method: "DELETE" });
    if (response.ok) {
      router.push("/dashboard");
      router.refresh();
    } else {
      setDeleting(false);
      setConfirmDelete(false);
      setMessage({ type: "error", text: "Silinemedi, tekrar dene" });
    }
  }

  return (
    <section className="space-y-6 rounded-lg border border-zinc-200 p-5 dark:border-zinc-800">
      <h2 className="font-semibold">Ayarlar</h2>

      <form onSubmit={save} className="space-y-4">
        <label className="block space-y-1">
          <span className="text-sm font-medium">Hedef adres</span>
          <input type="url" required value={url} onChange={(e) => setUrl(e.target.value)} className={inputClass} />
          <span className="block text-xs text-zinc-500">
            Kısa link ve QR kod aynı kalır, sadece yönlendirdiği adres değişir.
          </span>
        </label>

        <label className="flex items-center gap-3">
          <input
            type="checkbox"
            checked={isActive}
            onChange={(e) => setIsActive(e.target.checked)}
            className="h-4 w-4 accent-zinc-900 dark:accent-white"
          />
          <span className="text-sm">
            <span className="font-medium">Link aktif</span>
            <span className="text-zinc-500"> · kapatırsan tıklayanlar “bulunamadı” sayfası görür</span>
          </span>
        </label>

        <div className="space-y-1">
          <span className="block text-sm font-medium">Son kullanma tarihi (Türkiye saati)</span>
          <div className="flex gap-2">
            <input
              type="datetime-local"
              value={expiresAt}
              onChange={(e) => setExpiresAt(e.target.value)}
              className={inputClass}
            />
            {expiresAt && (
              <button
                type="button"
                onClick={() => setExpiresAt("")}
                className="shrink-0 rounded-lg border border-zinc-300 px-3 text-sm dark:border-zinc-700"
              >
                Kaldır
              </button>
            )}
          </div>
          <span className="block text-xs text-zinc-500">Boş bırakırsan link süresiz çalışır.</span>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={!changed || saving}
            className="rounded-lg bg-zinc-900 px-5 py-2 text-sm font-medium text-white disabled:opacity-40 dark:bg-white dark:text-black"
          >
            {saving ? "Kaydediliyor..." : "Kaydet"}
          </button>
          {message && (
            <span
              role="status"
              className={`text-sm ${message.type === "ok" ? "text-green-700 dark:text-green-400" : "text-red-700 dark:text-red-400"}`}
            >
              {message.type === "ok" ? "✓ " : ""}
              {message.text}
            </span>
          )}
        </div>
      </form>

      {/* Tehlikeli bölge: silme geri alınamaz, bu yüzden iki adımlı onay */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-zinc-200 pt-4 dark:border-zinc-800">
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          Silinen link ve tüm tıklama istatistikleri geri getirilemez.
        </p>
        {confirmDelete ? (
          <div className="flex gap-2">
            <button
              onClick={() => setConfirmDelete(false)}
              disabled={deleting}
              className="rounded-lg border border-zinc-300 px-4 py-2 text-sm dark:border-zinc-700"
            >
              Vazgeç
            </button>
            <button
              onClick={remove}
              disabled={deleting}
              className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
            >
              {deleting ? "Siliniyor..." : "Evet, kalıcı olarak sil"}
            </button>
          </div>
        ) : (
          <button
            onClick={() => setConfirmDelete(true)}
            className="rounded-lg border border-red-300 px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-50 dark:border-red-900 dark:text-red-400 dark:hover:bg-red-950"
          >
            Linki sil
          </button>
        )}
      </div>
    </section>
  );
}
