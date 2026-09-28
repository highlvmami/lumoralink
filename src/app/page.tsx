// Tanıtım sayfası. Giriş yapmış kullanıcı doğrudan paneline gider.
import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { ui } from "@/lib/ui";

// Basit çizgi ikonları (ek paket kullanmadan)
const icons = {
  link: (
    <path d="M10 14a4 4 0 0 0 5.66 0l3-3a4 4 0 0 0-5.66-5.66l-1 1M14 10a4 4 0 0 0-5.66 0l-3 3a4 4 0 0 0 5.66 5.66l1-1" />
  ),
  chart: <path d="M4 20V10M10 20V4M16 20v-7M22 20H2" />,
  qr: (
    <path d="M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h2v2h-2zM18 14h2M14 18v2M18 18h2v2" />
  ),
  leaf: <path d="M5 19c0-8 5-13 14-14-1 9-6 14-14 14ZM5 19l9-9" />,
};

function Icon({ name }: { name: keyof typeof icons }) {
  return (
    <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-soft text-brand">
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        {icons[name]}
      </svg>
    </span>
  );
}

const features = [
  {
    icon: "link" as const,
    title: "Kısa ve akılda kalıcı",
    text: "Uzun adresleri saniyeler içinde kısalt, istersen kendi kısa adını seç.",
  },
  {
    icon: "chart" as const,
    title: "Anlamlı istatistikler",
    text: "Kaç kişinin tıkladığını, nereden geldiğini ve hangi cihazı kullandığını gör.",
  },
  {
    icon: "qr" as const,
    title: "Tek tıkla QR kod",
    text: "Her link için PNG veya baskıya uygun SVG QR kod indir.",
  },
  {
    icon: "leaf" as const,
    title: "Gizliliğe saygılı",
    text: "IP adresi saklamıyoruz, reklam ya da takip çerezi kullanmıyoruz.",
  },
];

// Tanıtım görselindeki örnek grafik için sabit değerler (sadece süs)
const previewBars = [28, 40, 34, 52, 46, 64, 58, 72, 66, 84, 78, 92];

export default async function Home() {
  if (await getSession()) redirect("/dashboard");

  return (
    <main className="flex-1">
      {/* Kahraman bölümü */}
      <section className="relative overflow-hidden">
        {/* Arka planda yumuşak yeşil ışık */}
        <div
          aria-hidden
          className="pointer-events-none absolute -top-40 left-1/2 h-[520px] w-[900px] -translate-x-1/2 rounded-full bg-soft-strong/60 blur-3xl"
        />
        <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-4 py-16 sm:py-24 lg:grid-cols-[1.1fr_1fr]">
          <div className="space-y-7 text-center lg:text-left">
            <span className="inline-flex items-center gap-2 rounded-full border border-line bg-surface px-3 py-1 text-xs font-medium text-muted">
              <span className="h-1.5 w-1.5 rounded-full bg-series" />
              Ücretsiz ve açık kaynak
            </span>
            <h1 className="font-display text-4xl leading-[1.1] font-semibold tracking-tight text-ink sm:text-6xl">
              Uzun linkleri kısalt,
              <br />
              <span className="text-brand">tıklamaları takip et.</span>
            </h1>
            <p className="mx-auto max-w-xl text-lg text-muted lg:mx-0">
              LumoraLink ile linklerini tek yerden yönet, her tıklamanın hikâyesini sade ve anlaşılır
              istatistiklerle gör.
            </p>
            <div className="flex flex-col justify-center gap-3 sm:flex-row lg:justify-start">
              <Link href="/login" className={`${ui.btnPrimary} px-7 py-3.5 text-base`}>
                Ücretsiz başla
                <span aria-hidden>→</span>
              </Link>
              <a
                href="https://github.com/highlvmami/lumoralink"
                target="_blank"
                className={`${ui.btnSecondary} px-7 py-3.5 text-base`}
              >
                GitHub&apos;da incele
              </a>
            </div>
          </div>

          {/* Uygulamanın küçük bir önizlemesi (sadece görsel amaçlı) */}
          <div aria-hidden className={`${ui.card} mx-auto w-full max-w-md space-y-5 p-6`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-mono text-sm font-semibold text-ink">lumoralink.vercel.app/bahar</p>
                <p className="text-xs text-muted">bahar-kampanyasi-2026.com</p>
              </div>
              <span className="rounded-full bg-soft px-2.5 py-1 text-xs font-medium text-brand">Aktif</span>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {[
                ["1.284", "tıklama"],
                ["932", "tekil"],
                ["%61", "mobil"],
              ].map(([value, label]) => (
                <div key={label} className="rounded-xl bg-soft/70 p-3">
                  <p className="text-lg font-semibold tabular-nums text-ink">{value}</p>
                  <p className="text-xs text-muted">{label}</p>
                </div>
              ))}
            </div>
            <div className="flex h-28 items-end gap-1.5 border-b border-line">
              {previewBars.map((h, i) => (
                <div key={i} className="flex-1 rounded-t-[4px] bg-series" style={{ height: `${h}%`, opacity: 0.55 + i * 0.04 }} />
              ))}
            </div>
            <p className="text-center text-xs text-muted">Son 12 gün</p>
          </div>
        </div>
      </section>

      {/* Özellikler */}
      <section className="mx-auto max-w-6xl px-4 pb-20">
        <div className="mb-10 space-y-2 text-center">
          <p className={ui.eyebrow}>Neler yapabilirsin?</p>
          <h2 className="font-display text-3xl font-semibold tracking-tight">İhtiyacın olan her şey, sade bir arayüzde</h2>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f) => (
            <div key={f.title} className={`${ui.card} space-y-4 p-6 transition hover:-translate-y-0.5 hover:border-line-strong`}>
              <Icon name={f.icon} />
              <div className="space-y-1.5">
                <h3 className="font-semibold text-ink">{f.title}</h3>
                <p className="text-sm leading-relaxed text-muted">{f.text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Nasıl çalışır */}
      <section className="border-y border-line bg-surface">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 md:grid-cols-3">
          {[
            ["1", "Giriş yap", "Google veya GitHub hesabınla saniyeler içinde başla."],
            ["2", "Linkini kısalt", "Adresi yapıştır, istersen özel bir kısa ad ver."],
            ["3", "Paylaş ve izle", "Linkini ya da QR kodunu paylaş, tıklamaları panelden takip et."],
          ].map(([n, title, text]) => (
            <div key={n} className="flex gap-4">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary font-display font-semibold text-on-primary">
                {n}
              </span>
              <div className="space-y-1">
                <h3 className="font-semibold">{title}</h3>
                <p className="text-sm text-muted">{text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Son çağrı */}
      <section className="mx-auto max-w-6xl px-4 py-20">
        <div className="rounded-3xl bg-primary px-6 py-14 text-center text-on-primary">
          <h2 className="font-display text-3xl font-semibold tracking-tight">İlk linkini kısaltmaya hazır mısın?</h2>
          <p className="mx-auto mt-3 max-w-md opacity-85">Kurulum yok, kredi kartı yok. Giriş yap ve hemen başla.</p>
          <Link
            href="/login"
            className="mt-8 inline-flex items-center gap-2 rounded-xl bg-on-primary px-7 py-3.5 font-medium text-primary transition hover:opacity-90"
          >
            Ücretsiz başla <span aria-hidden>→</span>
          </Link>
        </div>
      </section>
    </main>
  );
}
