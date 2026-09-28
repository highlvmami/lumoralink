// Bir linkin istatistiklerini hesaplayan sorgular.
// Sayma ve gruplama işini veritabanına yaptırıyoruz: binlerce tıklamayı
// uygulamaya çekip JavaScript'te saymak hem yavaş hem bellek dostu değil.
import { Prisma } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";

const TIME_ZONE = "Europe/Istanbul";

export type DailyPoint = { day: string; clicks: number };
export type BreakdownRow = { label: string; count: number };

// Gruplanabilir sütunlar. Sütun adını SQL'e doğrudan yazdığımız için
// yalnızca bu listedeki değerlere izin veriyoruz (SQL injection'a kapı açmamak için).
const BREAKDOWN_COLUMNS = ["referrer", "country", "device", "browser", "os"] as const;
type BreakdownColumn = (typeof BREAKDOWN_COLUMNS)[number];

async function dailyClicks(linkId: string, days: number) {
  // generate_series her gün için bir satır üretir; LEFT JOIN sayesinde
  // tıklama olmayan günler de 0 olarak gelir, grafikte boşluk oluşmaz.
  return prisma.$queryRaw<DailyPoint[]>`
    SELECT to_char(d.day, 'YYYY-MM-DD') AS day, COUNT(c.id)::int AS clicks
    FROM generate_series(
      (now() AT TIME ZONE ${TIME_ZONE})::date - ${days - 1}::int,
      (now() AT TIME ZONE ${TIME_ZONE})::date,
      interval '1 day'
    ) AS d(day)
    LEFT JOIN "Click" c
      ON c."linkId" = ${linkId}
      AND (c."createdAt" AT TIME ZONE 'UTC' AT TIME ZONE ${TIME_ZONE})::date = d.day::date
    GROUP BY d.day
    ORDER BY d.day`;
}

async function breakdown(linkId: string, column: BreakdownColumn, limit = 5) {
  const rows = await prisma.$queryRaw<{ label: string | null; count: number }[]>`
    SELECT ${Prisma.raw(`"${column}"`)} AS label, COUNT(*)::int AS count
    FROM "Click"
    WHERE "linkId" = ${linkId}
    GROUP BY 1
    ORDER BY 2 DESC`;

  // İlk N kalem ayrı, kalanlar "Diğer" altında toplanır
  const top: BreakdownRow[] = rows.slice(0, limit).map((r) => ({
    label: r.label ?? "",
    count: r.count,
  }));
  const rest = rows.slice(limit).reduce((sum, r) => sum + r.count, 0);
  if (rest > 0) top.push({ label: "__other__", count: rest });
  return top;
}

export async function getLinkStats(linkId: string) {
  const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

  // Birbirinden bağımsız sorguları aynı anda çalıştırıyoruz (Promise.all)
  const [total, lastWeek, uniqueRows, daily, referrer, country, device, browser, os] =
    await Promise.all([
      prisma.click.count({ where: { linkId } }),
      prisma.click.count({ where: { linkId, createdAt: { gte: weekAgo } } }),
      prisma.$queryRaw<{ count: number }[]>`
        SELECT COUNT(DISTINCT "visitorHash")::int AS count FROM "Click" WHERE "linkId" = ${linkId}`,
      dailyClicks(linkId, 30),
      breakdown(linkId, "referrer"),
      breakdown(linkId, "country"),
      breakdown(linkId, "device"),
      breakdown(linkId, "browser"),
      breakdown(linkId, "os"),
    ]);

  return {
    total,
    lastWeek,
    unique: uniqueRows[0]?.count ?? 0,
    daily,
    breakdowns: { referrer, country, device, browser, os },
  };
}
