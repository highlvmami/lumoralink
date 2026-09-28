// Zod şemaları: dışarıdan gelen veriye asla güvenmeyiz, önce doğrularız.
// Aynı şema hem sunucuda hem (ileride) formda kullanılabilir.
import { z } from "zod";
import { RESERVED_SLUGS } from "./slug";

export const createLinkSchema = z.object({
  // Yalnızca http/https kabul edilir. "javascript:alert(1)" gibi zararlı adresler reddedilir.
  url: z.httpUrl({ error: "Geçerli bir http(s) adresi gir" }).max(2048, "Adres çok uzun"),

  // İsteğe bağlı özel kısa ad: /kampanya-2026 gibi
  customSlug: z
    .string()
    .trim()
    .regex(
      /^[a-zA-Z0-9_-]{3,32}$/,
      "Kısa ad 3-32 karakter olmalı; harf, rakam, - ve _ kullanılabilir",
    )
    .refine((s) => !RESERVED_SLUGS.has(s.toLowerCase()), "Bu ad sistem tarafından ayrılmış")
    .optional(),
});

export type CreateLinkInput = z.infer<typeof createLinkSchema>;

// Link güncelleme: gönderilen alanlar değişir, gönderilmeyenlere dokunulmaz.
// Kısa ad (slug) bilerek değiştirilemez: basılmış QR kodlar ve paylaşılmış linkler bozulurdu.
export const updateLinkSchema = z
  .object({
    url: z.httpUrl({ error: "Geçerli bir http(s) adresi gir" }).max(2048, "Adres çok uzun").optional(),
    isActive: z.boolean().optional(),
    // ISO tarih ("2026-10-01T12:00:00+03:00") veya null (= süresiz yap)
    expiresAt: z
      .iso.datetime({ offset: true, error: "Geçersiz tarih" })
      .transform((value) => new Date(value))
      .refine((date) => date > new Date(), "Son kullanma tarihi gelecekte olmalı")
      .nullable()
      .optional(),
  })
  .refine((data) => Object.keys(data).length > 0, "Değiştirilecek bir alan gönder");

export type UpdateLinkInput = z.infer<typeof updateLinkSchema>;
