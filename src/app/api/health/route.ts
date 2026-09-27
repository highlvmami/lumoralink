// Basit sağlık kontrolü: uygulama çalışıyor mu, veritabanına bağlanabiliyor mu?
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await prisma.$queryRaw`SELECT 1`;
    const linkCount = await prisma.link.count();
    return Response.json({ status: "ok", database: "connected", linkCount });
  } catch (error) {
    console.error(error);
    return Response.json(
      { status: "error", database: "unreachable" },
      { status: 503 },
    );
  }
}
