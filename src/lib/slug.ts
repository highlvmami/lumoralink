// Kısa kod (slug) üretimi.
// nanoid kriptografik olarak güvenli rastgele sayılar kullanır, yani kodlar tahmin edilemez.
// Alfabeden karışabilecek karakterleri (0/O, 1/l/I) çıkardık: kullanıcı kodu elle yazarsa hata yapmasın.
import { customAlphabet } from "nanoid";

const ALPHABET = "23456789abcdefghijkmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ";

// 57 karakter, 7 hane → 57^7 ≈ 1,9 trilyon olasılık. Çakışma ihtimali çok düşük,
// yine de API tarafında çakışmaya karşı tekrar deniyoruz.
export const generateSlug = customAlphabet(ALPHABET, 7);

// Uygulamanın kendi sayfalarıyla çakışmasın diye kullanıcıya verilmeyen adlar.
export const RESERVED_SLUGS = new Set([
  "api",
  "dashboard",
  "login",
  "logout",
  "register",
  "settings",
  "admin",
  "_next",
]);
