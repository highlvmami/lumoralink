// Bir tıklama isteğinden analitik bilgisini çıkarır.
// Kişisel veriyi en aza indiriyoruz: IP adresi saklanmaz, yalnızca
// günlük değişen tuzla alınmış tek yönlü bir hash tutulur.
import { createHash } from "node:crypto";
import { userAgent, type NextRequest } from "next/server";

// Next.js'in isBot kontrolü arama motoru botlarını yakalar. Link önizlemesi
// üreten uygulamalar (WhatsApp, Telegram, Slack...) linki "tıklamış gibi" görünür,
// onları da ayrıca eliyoruz; yoksa paylaşılan her link sahte tıklama alırdı.
const PREVIEW_BOTS =
  /whatsapp|telegrambot|slackbot|discordbot|twitterbot|facebookexternalhit|linkedinbot|skypeuripreview|pinterest|embedly|redditbot|applebot|googleother|bingpreview|vkshare|preview/i;

// cihaz tipi (Next.js "mobile" | "tablet" | ... | undefined döndürür; undefined = masaüstü)
const DEVICE_LABELS: Record<string, string> = {
  mobile: "Mobil",
  tablet: "Tablet",
  smarttv: "Akıllı TV",
  console: "Oyun konsolu",
  wearable: "Giyilebilir",
  embedded: "Gömülü",
};

function clientIp(request: NextRequest) {
  // Proxy/CDN arkasında gerçek IP x-forwarded-for başlığının ilk değeridir
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return request.headers.get("x-real-ip") ?? "0.0.0.0";
}

function referrerHost(value: string | null) {
  if (!value) return null;
  try {
    return new URL(value).hostname.replace(/^www\./, "");
  } catch {
    return null;
  }
}

function visitorHash(ip: string, ua: string) {
  const day = new Date().toISOString().slice(0, 10); // "2026-09-28"
  const salt = process.env.BETTER_AUTH_SECRET ?? "";
  return createHash("sha256").update(`${day}|${ip}|${ua}|${salt}`).digest("hex");
}

export type ClickData = {
  isBot: boolean;
  device: string;
  browser: string | null;
  os: string | null;
  country: string | null;
  referrer: string | null;
  visitorHash: string;
};

export function parseClick(request: NextRequest): ClickData {
  const ua = request.headers.get("user-agent") ?? "";
  const parsed = userAgent(request);

  // Ülke bilgisini barındırma platformu başlıkta verir (Vercel, Cloudflare).
  // Kendi bilgisayarımızda bu başlıklar olmadığı için yerelde "bilinmiyor" görünür.
  const country =
    request.headers.get("x-vercel-ip-country") ?? request.headers.get("cf-ipcountry");

  return {
    isBot: parsed.isBot || PREVIEW_BOTS.test(ua) || ua.length === 0,
    device: DEVICE_LABELS[parsed.device.type ?? ""] ?? "Masaüstü",
    browser: parsed.browser.name ?? null,
    os: parsed.os.name ?? null,
    country: country && /^[A-Z]{2}$/.test(country) ? country : null,
    referrer: referrerHost(request.headers.get("referer")),
    visitorHash: visitorHash(clientIp(request), ua),
  };
}
