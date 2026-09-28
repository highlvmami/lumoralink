// Bir linkin durumunu tek yerden hesaplarız; panel, detay sayfası ve
// yönlendirme aynı kuralı kullanır, böylece "burada aktif, orada pasif" tutarsızlığı olmaz.
export type LinkStatus = "active" | "inactive" | "expired";

export function getLinkStatus(link: { isActive: boolean; expiresAt: Date | null }): LinkStatus {
  if (!link.isActive) return "inactive";
  if (link.expiresAt && link.expiresAt <= new Date()) return "expired";
  return "active";
}
