// Tek bir link üzerinde işlem:
//   PATCH  /api/links/<id> → hedef adres, aktiflik veya son kullanma tarihini güncelle
//   DELETE /api/links/<id> → linki (ve tıklama kayıtlarını) sil
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { updateLinkSchema } from "@/lib/validation";

export async function PATCH(request: Request, ctx: RouteContext<"/api/links/[id]">) {
  const session = await getSession();
  if (!session) return Response.json({ error: "Giriş yapmalısın" }, { status: 401 });

  const parsed = updateLinkSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    const fields = z.flattenError(parsed.error);
    return Response.json(
      { error: fields.formErrors[0] ?? "Geçersiz istek", fields: fields.fieldErrors },
      { status: 400 },
    );
  }
  const data = parsed.data;

  // Kendi kısa linkimize yönlendirme döngüsü kurulmasın
  if (data.url && new URL(data.url).origin === new URL(request.url).origin) {
    return Response.json({ error: "Bu sitenin linkleri hedef olarak kullanılamaz" }, { status: 400 });
  }

  const { id } = await ctx.params;

  // updateMany + userId filtresi: link başkasınınsa hiçbir satır etkilenmez (count = 0).
  // Böylece "önce bul, sonra güncelle" arasında oluşabilecek boşluk da kalmaz.
  const result = await prisma.link.updateMany({
    where: { id, userId: session.user.id },
    data,
  });
  if (result.count === 0) {
    return Response.json({ error: "Link bulunamadı" }, { status: 404 });
  }

  const link = await prisma.link.findUnique({
    where: { id },
    select: { id: true, slug: true, url: true, isActive: true, expiresAt: true },
  });
  return Response.json(link);
}

export async function DELETE(_request: Request, ctx: RouteContext<"/api/links/[id]">) {
  const session = await getSession();
  if (!session) return Response.json({ error: "Giriş yapmalısın" }, { status: 401 });

  const { id } = await ctx.params;

  // Şemadaki onDelete: Cascade sayesinde linke ait tıklamalar da otomatik silinir
  const result = await prisma.link.deleteMany({ where: { id, userId: session.user.id } });
  if (result.count === 0) {
    return Response.json({ error: "Link bulunamadı" }, { status: 404 });
  }

  return new Response(null, { status: 204 }); // 204 No Content: başarılı, döndürülecek gövde yok
}
