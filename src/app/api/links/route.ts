// REST API: /api/links
//   POST → yeni kısa link oluştur
//   GET  → son oluşturulan linkleri listele
import { z } from "zod";
import { Prisma } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { generateSlug } from "@/lib/slug";
import { createLinkSchema } from "@/lib/validation";

// Prisma'nın "unique alan çakıştı" hata kodu. slug alanı @unique olduğu için
// aynı kod ikinci kez eklenmek istenirse veritabanı bu hatayı verir.
function isUniqueViolation(error: unknown) {
  return error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002";
}

export async function POST(request: Request) {
  // 0) Link oluşturmak için giriş zorunlu
  const session = await getSession();
  if (!session) {
    return Response.json({ error: "Link oluşturmak için giriş yapmalısın" }, { status: 401 });
  }

  // 1) Gövdeyi oku. Bozuk JSON gelirse uygulama çökmesin, 400 dönsün.
  const body = await request.json().catch(() => null);

  // 2) Doğrula
  const parsed = createLinkSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json(
      { error: "Geçersiz istek", fields: z.flattenError(parsed.error).fieldErrors },
      { status: 400 },
    );
  }
  const { url, customSlug } = parsed.data;

  // 3) Kendi kısa linkimizi tekrar kısaltmayı engelle (sonsuz yönlendirme döngüsü olmasın)
  const origin = new URL(request.url).origin;
  if (new URL(url).origin === origin) {
    return Response.json({ error: "Bu sitenin linkleri kısaltılamaz" }, { status: 400 });
  }

  // 4) Link, giriş yapan kullanıcıya bağlanır
  const userId = session.user.id;

  // 5) Kaydet. Özel ad varsa tek deneme; yoksa rastgele kodla en fazla 3 deneme.
  const attempts = customSlug ? 1 : 3;
  for (let i = 0; i < attempts; i++) {
    const slug = customSlug ?? generateSlug();
    try {
      const link = await prisma.link.create({ data: { slug, url, userId } });
      return Response.json(
        { id: link.id, slug: link.slug, url: link.url, shortUrl: `${origin}/${link.slug}` },
        { status: 201 }, // 201 Created: yeni kaynak oluşturuldu
      );
    } catch (error) {
      if (!isUniqueViolation(error)) throw error;
      if (customSlug) {
        // 409 Conflict: istenen ad zaten kullanımda
        return Response.json({ error: "Bu kısa ad zaten kullanılıyor" }, { status: 409 });
      }
      // Rastgele kod çakıştıysa döngü yeni kodla tekrar dener
    }
  }

  return Response.json({ error: "Kısa kod üretilemedi, tekrar dene" }, { status: 500 });
}

export async function GET() {
  // Yalnızca giriş yapan kullanıcının kendi linkleri döner
  const session = await getSession();
  if (!session) {
    return Response.json({ error: "Giriş yapmalısın" }, { status: 401 }); // 401 Unauthorized
  }

  const links = await prisma.link.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    take: 20,
    select: {
      id: true,
      slug: true,
      url: true,
      createdAt: true,
      _count: { select: { clicks: true } },
    },
  });
  return Response.json(links);
}
