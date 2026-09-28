"use client";
// Link ayarları: hedef adres, aktif/pasif, son kullanma tarihi ve silme.
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ui } from "@/lib/ui";

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

const inputClass = ui.input;

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
    <section className={`${ui.card} space-y-6 p-6`}>
      <h2 className="font-semibold">Ayarlar</h2>

      <form onSubmit={save} className="space-y-4">
        <label className="block space-y-1">
          <span className="text-sm font-medium">Hedef adres</span>
          <input type="url" required value={url} onChange={(e) => setUrl(e.target.value)} className={inputClass} />
          <span className="block text-xs text-muted">
            Kısa link ve QR kod aynı kalır, sadece yönlendirdiği adres değişir.
          </span>
        </label>

        <label className="flex items-center gap-3">
          <input
            type="checkbox"
            checked={isActive}
            onChange={(e) => setIsActive(e.target.checked)}
            className="h-4 w-4 accent-[var(--primary)]"
          />
          <span className="text-sm">
            <span className="font-medium">Link aktif</span>
            <span className="text-muted"> · kapatırsan tıklayanlar “bulunamadı” sayfası görür</span>
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
                className={`${ui.btnSecondary} shrink-0`}
              >
                Kaldır
              </button>
            )}
          </div>
          <span className="block text-xs text-muted">Boş bırakırsan link süresiz çalışır.</span>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={!changed || saving}
            className={`${ui.btnPrimary} px-5 py-2.5 text-sm disabled:opacity-40`}
          >
            {saving ? "Kaydediliyor..." : "Kaydet"}
          </button>
          {message && (
            <span
              role="status"
              className={`text-sm ${message.type === "ok" ? "text-brand" : "text-danger"}`}
            >
              {message.type === "ok" ? "✓ " : ""}
              {message.text}
            </span>
          )}
        </div>
      </form>

      {/* Tehlikeli bölge: silme geri alınamaz, bu yüzden iki adımlı onay */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line pt-5">
        <p className="text-sm text-muted">
          Silinen link ve tüm tıklama istatistikleri geri getirilemez.
        </p>
        {confirmDelete ? (
          <div className="flex gap-2">
            <button
              onClick={() => setConfirmDelete(false)}
              disabled={deleting}
              className={ui.btnSecondary}
            >
              Vazgeç
            </button>
            <button
              onClick={remove}
              disabled={deleting}
              className="inline-flex items-center rounded-xl bg-[#b42318] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#912018] disabled:opacity-50"
            >
              {deleting ? "Siliniyor..." : "Evet, kalıcı olarak sil"}
            </button>
          </div>
        ) : (
          <button
            onClick={() => setConfirmDelete(true)}
            className={ui.btnDanger}
          >
            Linki sil
          </button>
        )}
      </div>
    </section>
  );
}
