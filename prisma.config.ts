// Prisma CLI ayarları: şema nerede, migration'lar nereye yazılacak, veritabanı adresi ne.
import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    // Migration'lar doğrudan bağlantıyı (DIRECT_URL) kullanır; Neon gibi servislerde
    // uygulamanın kullandığı "pooled" bağlantı migration için uygun değildir.
    // Yerelde DIRECT_URL tanımlı değilse DATABASE_URL kullanılır.
    url: process.env.DIRECT_URL ?? process.env.DATABASE_URL ?? "",
  },
});
