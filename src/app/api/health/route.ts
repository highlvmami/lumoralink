// Basit sağlık kontrolü: uygulama çalışıyor mu, veritabanına bağlanabiliyor mu?
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await prisma.$queryRaw`SELECT 1`;
    // Herkese açık uç: iç veri (link sayısı vb.) göstermiyoruz, sadece durum
    return Response.json({ status: "ok", database: "connected" });
  } catch (error) {
    console.error(error);
    return Response.json(
      { status: "error", database: "unreachable" },
      { status: 503 },
    );
  }
}
