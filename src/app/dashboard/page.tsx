// Korumalı sayfa: yalnızca giriş yapan kullanıcı görebilir.
// Kontrolü sayfanın kendisinde (sunucuda) yapıyoruz; tarayıcıda gizlemek güvenlik sağlamaz.
import Link from "next/link";
import { redirect } from "next/navigation";
import { LinkStatusBadge } from "@/components/link-status-badge";
import { ShortenForm } from "@/components/shorten-form";
import { getLinkStatus } from "@/lib/link-status";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { ui } from "@/lib/ui";

export const metadata = { title: "Panel" };

const dateFormat = new Intl.DateTimeFormat("tr-TR", { dateStyle: "medium" });

export default async function DashboardPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  // Sadece bu kullanıcının linkleri. userId filtresi olmadan başkasının verisi sızardı.
  const links = await prisma.link.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      slug: true,
      url: true,
      createdAt: true,
      isActive: true,
      expiresAt: true,
      _count: { select: { clicks: true } },
    },
  });

  const totalClicks = links.reduce((sum, link) => sum + link._count.clicks, 0);
  const activeCount = links.filter((link) => getLinkStatus(link) === "active").length;

  const tiles = [
    { label: "Toplam link", value: links.length },
    { label: "Toplam tıklama", value: totalClicks },
    { label: "Aktif link", value: activeCount },
  ];

  return (
    <main className="mx-auto w-full max-w-6xl flex-1 space-y-8 px-4 py-10">
      <div className="space-y-1">
        <p className={ui.eyebrow}>Panel</p>
        <h1 className="font-display text-3xl font-semibold tracking-tight">
          Merhaba, {session.user.name.split(" ")[0]} 👋
        </h1>
        <p className="text-muted">Linklerini yönet, istatistik için bir linke tıkla.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {tiles.map((t) => (
          <div key={t.label} className={`${ui.card} p-5`}>
            <p className="text-sm text-muted">{t.label}</p>
            <p className="mt-1 text-3xl font-semibold tabular-nums">{t.value.toLocaleString("tr-TR")}</p>
          </div>
        ))}
      </div>

      <section className={`${ui.card} space-y-4 p-6`}>
        <h2 className="font-semibold">Yeni kısa link</h2>
        <ShortenForm />
      </section>

      <section className={`${ui.card} overflow-hidden`}>
        <div className="flex items-center justify-between border-b border-line px-6 py-4">
          <h2 className="font-semibold">Linklerin</h2>
          <span className="text-sm text-muted">{links.length} link</span>
        </div>

        {links.length === 0 ? (
          <div className="px-6 py-14 text-center">
            <p className="font-medium">Henüz linkin yok</p>
            <p className="mt-1 text-sm text-muted">Yukarıdaki formdan ilk kısa linkini oluştur.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-soft/60 text-muted">
                <tr>
                  <th className="px-6 py-3 font-medium">Kısa link</th>
                  <th className="px-6 py-3 font-medium">Hedef</th>
                  <th className="px-6 py-3 text-right font-medium">Tıklama</th>
                  <th className="px-6 py-3 text-right font-medium">Oluşturulma</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {links.map((link) => (
                  <tr key={link.id} className="transition hover:bg-soft/40">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Link
                        href={`/dashboard/links/${link.id}`}
                        className="font-mono font-medium text-brand underline-offset-2 hover:underline"
                      >
                        /{link.slug}
                      </Link>
                      <a
                        href={`/${link.slug}`}
                        target="_blank"
                        aria-label="Linki yeni sekmede aç"
                        className="ml-2 text-muted transition hover:text-ink"
                      >
                        ↗
                      </a>
                      <span className="ml-2">
                        <LinkStatusBadge status={getLinkStatus(link)} hideActive />
                      </span>
                    </td>
                    <td className="max-w-xs truncate px-6 py-4 text-muted">{link.url}</td>
                    <td className="px-6 py-4 text-right font-medium tabular-nums">{link._count.clicks}</td>
                    <td className="px-6 py-4 text-right whitespace-nowrap text-muted">
                      {dateFormat.format(link.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  );
}
