// Uygulama genelinde tek bir PrismaClient örneği kullanırız.
// Geliştirme modunda Next.js dosyaları sık sık yeniden yükler; her seferinde
// yeni client açılırsa veritabanı bağlantıları tükenir. Bu yüzden örneği
// globalThis üzerinde saklıyoruz.
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/generated/prisma/client";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

function createClient() {
  const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
  return new PrismaClient({ adapter });
}

export const prisma = globalForPrisma.prisma ?? createClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
