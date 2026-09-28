// Korumalı sayfa: yalnızca giriş yapan kullanıcı görebilir.
// Kontrolü sayfanın kendisinde (sunucuda) yapıyoruz; tarayıcıda gizlemek güvenlik sağlamaz.
import Link from "next/link";
import { redirect } from "next/navigation";
import { ShortenForm } from "@/components/shorten-form";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

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
      _count: { select: { clicks: true } },
    },
  });

  const totalClicks = links.reduce((sum, link) => sum + link._count.clicks, 0);

  return (
    <main className="mx-auto w-full max-w-5xl space-y-8 px-4 py-10">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          Merhaba, {session.user.name.split(" ")[0]}
        </h1>
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          {links.length} link · toplam {totalClicks} tıklama · istatistik için bir linke tıkla
        </p>
      </div>

      <ShortenForm />

      {links.length === 0 ? (
        <p className="text-sm text-zinc-500">Henüz linkin yok. Yukarıdan ilkini oluştur.</p>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-zinc-200 dark:border-zinc-800">
          <table className="w-full text-left text-sm">
            <thead className="bg-zinc-50 text-zinc-500 dark:bg-zinc-900">
              <tr>
                <th className="px-4 py-3 font-medium">Kısa link</th>
                <th className="px-4 py-3 font-medium">Hedef</th>
                <th className="px-4 py-3 text-right font-medium">Tıklama</th>
                <th className="px-4 py-3 text-right font-medium">Oluşturulma</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
              {links.map((link) => (
                <tr key={link.id}>
                  <td className="px-4 py-3 font-mono">
                    <Link href={`/dashboard/links/${link.id}`} className="font-medium underline">
                      /{link.slug}
                    </Link>
                    <a
                      href={`/${link.slug}`}
                      target="_blank"
                      aria-label="Linki yeni sekmede aç"
                      className="ml-2 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100"
                    >
                      ↗
                    </a>
                  </td>
                  <td className="max-w-xs truncate px-4 py-3 text-zinc-600 dark:text-zinc-400">
                    {link.url}
                  </td>
                  <td className="px-4 py-3 text-right tabular-nums">{link._count.clicks}</td>
                  <td className="px-4 py-3 text-right text-zinc-500">
                    {dateFormat.format(link.createdAt)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}
