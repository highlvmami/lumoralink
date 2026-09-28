// QR kod indirme: /api/links/<id>/qr?format=png  veya  ?format=svg
import { prisma } from "@/lib/prisma";
import { qrPng, qrSvg } from "@/lib/qr";
import { getSession } from "@/lib/session";
import { getBaseUrl } from "@/lib/url";

export async function GET(request: Request, ctx: RouteContext<"/api/links/[id]/qr">) {
  const session = await getSession();
  if (!session) return Response.json({ error: "Giriş yapmalısın" }, { status: 401 });

  const { id } = await ctx.params;
  const link = await prisma.link.findFirst({
    where: { id, userId: session.user.id }, // yalnızca kendi linkinin QR'ı
    select: { slug: true },
  });
  if (!link) return Response.json({ error: "Link bulunamadı" }, { status: 404 });

  const shortUrl = `${await getBaseUrl()}/${link.slug}`;
  const format = new URL(request.url).searchParams.get("format") === "svg" ? "svg" : "png";
  const filename = `lumoralink-${link.slug}.${format}`;

  // Content-Disposition: attachment → tarayıcı dosyayı açmak yerine indirir
  const headers = {
    "Content-Disposition": `attachment; filename="${filename}"`,
    "Cache-Control": "private, max-age=3600",
  };

  if (format === "svg") {
    return new Response(await qrSvg(shortUrl), {
      headers: { ...headers, "Content-Type": "image/svg+xml" },
    });
  }
  const png = await qrPng(shortUrl);
  return new Response(new Uint8Array(png), {
    headers: { ...headers, "Content-Type": "image/png" },
  });
}
