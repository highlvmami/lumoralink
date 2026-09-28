// Tek bir linkin analitik sayfası: /dashboard/links/<id>
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { BreakdownList } from "@/components/breakdown-list";
import { ClicksChart } from "@/components/clicks-chart";
import { CopyButton } from "@/components/copy-button";
import { LinkSettings } from "@/components/link-settings";
import { LinkStatusBadge } from "@/components/link-status-badge";
import { getLinkStatus } from "@/lib/link-status";
import { prisma } from "@/lib/prisma";
import { qrSvg } from "@/lib/qr";
import { getSession } from "@/lib/session";
import { getLinkStats } from "@/lib/stats";
import { getBaseUrl } from "@/lib/url";

export const metadata = { title: "Link istatistikleri" };

const countryNames = new Intl.DisplayNames(["tr"], { type: "region" });
const dateFormat = new Intl.DateTimeFormat("tr-TR", { dateStyle: "long" });

export default async function LinkStatsPage({ params }: PageProps<"/dashboard/links/[id]">) {
  const session = await getSession();
  if (!session) redirect("/login");

  const { id } = await params;

  // Hem id hem sahip eşleşmeli: başkasının linkinin id'sini bilen biri
  // istatistiklerini göremesin. Bulunamazsa 404 (varlığını bile sızdırmıyoruz).
  const link = await prisma.link.findFirst({
    where: { id, userId: session.user.id },
    select: { id: true, slug: true, url: true, createdAt: true, isActive: true, expiresAt: true },
  });
  if (!link) notFound();

  const shortUrl = `${await getBaseUrl()}/${link.slug}`;
  const [stats, qr] = await Promise.all([getLinkStats(link.id), qrSvg(shortUrl)]);

  const tiles = [
    { label: "Toplam tıklama", value: stats.total },
    { label: "Tekil ziyaretçi", value: stats.unique },
    { label: "Son 7 gün", value: stats.lastWeek },
  ];

  return (
    <main className="mx-auto w-full max-w-5xl space-y-8 px-4 py-10">
      <div className="space-y-1">
        <Link href="/dashboard" className="text-sm text-zinc-500 hover:underline">
          ← Panele dön
        </Link>
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="font-mono text-2xl font-bold">/{link.slug}</h1>
          <LinkStatusBadge status={getLinkStatus(link)} />
          <CopyButton text={shortUrl} />
        </div>
        <a href={link.url} target="_blank" className="block truncate text-sm text-zinc-600 hover:underline dark:text-zinc-400">
          {link.url}
        </a>
        <p className="text-xs text-zinc-500">{dateFormat.format(link.createdAt)} tarihinde oluşturuldu</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {tiles.map((t) => (
          <div key={t.label} className="rounded-lg border border-zinc-200 p-5 dark:border-zinc-800">
            <p className="text-sm text-zinc-500">{t.label}</p>
            <p className="mt-1 text-3xl font-bold tabular-nums">{t.value.toLocaleString("tr-TR")}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-[1fr_auto]">
        <section className="rounded-lg border border-zinc-200 p-5 dark:border-zinc-800">
          <h2 className="mb-3 font-semibold">Son 30 gün</h2>
          <ClicksChart data={stats.daily} />
        </section>

        <section className="flex flex-col items-center gap-3 rounded-lg border border-zinc-200 p-5 dark:border-zinc-800">
          <h2 className="self-start font-semibold">QR kod</h2>
          {/* SVG'yi sunucuda kendimiz ürettiğimiz için sayfaya doğrudan gömmek güvenli */}
          <div
            className="w-44 overflow-hidden rounded-md [&>svg]:h-auto [&>svg]:w-full"
            role="img"
            aria-label={`${shortUrl} için QR kod`}
            dangerouslySetInnerHTML={{ __html: qr }}
          />
          <div className="flex gap-2">
            <a
              href={`/api/links/${link.id}/qr?format=png`}
              className="rounded-md bg-zinc-900 px-3 py-1.5 text-sm font-medium text-white dark:bg-white dark:text-black"
            >
              PNG indir
            </a>
            <a
              href={`/api/links/${link.id}/qr?format=svg`}
              className="rounded-md border border-zinc-300 px-3 py-1.5 text-sm font-medium dark:border-zinc-700"
            >
              SVG indir
            </a>
          </div>
          <p className="max-w-44 text-center text-xs text-zinc-500">
            SVG baskı için idealdir, her boyutta net kalır.
          </p>
        </section>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <BreakdownList
          title="Kaynak"
          rows={stats.breakdowns.referrer}
          total={stats.total}
          emptyLabel="Doğrudan / bilinmiyor"
        />
        <BreakdownList
          title="Ülke"
          rows={stats.breakdowns.country}
          total={stats.total}
          emptyLabel="Bilinmiyor"
          format={(code) => countryNames.of(code) ?? code}
        />
        <BreakdownList title="Cihaz" rows={stats.breakdowns.device} total={stats.total} emptyLabel="Bilinmiyor" />
        <BreakdownList title="Tarayıcı" rows={stats.breakdowns.browser} total={stats.total} emptyLabel="Bilinmiyor" />
        <BreakdownList title="İşletim sistemi" rows={stats.breakdowns.os} total={stats.total} emptyLabel="Bilinmiyor" />
      </div>

      <LinkSettings
        link={{
          id: link.id,
          url: link.url,
          isActive: link.isActive,
          // Date nesnesi sunucudan tarayıcıya metin olarak geçer
          expiresAt: link.expiresAt?.toISOString() ?? null,
        }}
      />
    </main>
  );
}
