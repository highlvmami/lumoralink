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
