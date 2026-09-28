// Link oluşturma için hız sınırı.
// Sayacı veritabanındaki linklerden hesaplıyoruz: Vercel gibi sunucusuz ortamlarda
// her istek farklı bir makinede çalışabilir, bellekte tutulan sayaç paylaşılmaz.
// Ek bir servis (Redis vb.) gerektirmeyen, bu ölçek için yeterli bir çözüm.
import { prisma } from "@/lib/prisma";

const LIMITS = [
  { windowMs: 60 * 1000, max: 10, label: "dakikada" },
  { windowMs: 60 * 60 * 1000, max: 100, label: "saatte" },
];

export async function checkLinkCreateLimit(userId: string) {
  const now = Date.now();
  for (const limit of LIMITS) {
    const since = new Date(now - limit.windowMs);
    const count = await prisma.link.count({ where: { userId, createdAt: { gte: since } } });
    if (count >= limit.max) {
      return {
        ok: false as const,
        message: `Çok hızlı gidiyorsun: ${limit.label} en fazla ${limit.max} link oluşturabilirsin.`,
        retryAfterSeconds: Math.ceil(limit.windowMs / 1000),
      };
    }
  }
  return { ok: true as const };
}
