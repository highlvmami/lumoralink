// Kısa linkin kalbi: /abc1234 → hedef adrese yönlendir ve tıklamayı kaydet.
// Sayfa (page.tsx) yerine Route Handler kullanıyoruz; HTML üretmeye gerek yok,
// sadece bir yönlendirme cevabı dönüyoruz. Bu çok daha hızlı.
import { after, NextResponse, type NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

// Referrer'ın tamamını değil sadece alan adını saklıyoruz (ör. "twitter.com").
// Hem gruplamak kolaylaşır hem de gereksiz kişisel veri tutmamış oluruz.
function referrerHost(value: string | null) {
  if (!value) return null;
  try {
    return new URL(value).hostname;
  } catch {
    return null;
  }
}

export async function GET(request: NextRequest, ctx: RouteContext<"/[slug]">) {
  const { slug } = await ctx.params;

  const link = await prisma.link.findUnique({
    where: { slug },
    select: { id: true, url: true, isActive: true, expiresAt: true },
  });

  if (!link || !link.isActive) {
    return new Response("Link bulunamadı", { status: 404 });
  }
  if (link.expiresAt && link.expiresAt < new Date()) {
    // 410 Gone: kaynak vardı ama artık kalıcı olarak yok
    return new Response("Bu linkin süresi dolmuş", { status: 410 });
  }

  const referrer = referrerHost(request.headers.get("referer"));

  // after(): cevabı kullanıcıya gönderdikten SONRA çalışır.
  // Böylece tıklamayı veritabanına yazmak yönlendirmeyi yavaşlatmaz.
  after(async () => {
    try {
      await prisma.click.create({ data: { linkId: link.id, referrer } });
    } catch (error) {
      console.error("Tıklama kaydedilemedi", error);
    }
  });

  // 302 (geçici) yönlendirme kullanıyoruz. 301 (kalıcı) olsaydı tarayıcı bunu
  // önbelleğe alır, sonraki tıklamalar sunucumuza hiç gelmez ve sayılamazdı.
  return NextResponse.redirect(link.url, 302);
}
