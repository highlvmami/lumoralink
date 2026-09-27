// Better Auth sunucu yapılandırması. Oturum, çerez ve OAuth akışının tamamı buradan yönetilir.
// Bu dosya yalnızca sunucuda çalışır; gizli anahtarlar tarayıcıya asla gitmez.
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { nextCookies } from "better-auth/next-js";
import { prisma } from "@/lib/prisma";

export const auth = betterAuth({
  // Kullanıcı, oturum ve hesap kayıtları kendi PostgreSQL veritabanımızda tutulur
  database: prismaAdapter(prisma, { provider: "postgresql" }),

  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      prompt: "select_account", // birden fazla Google hesabı varsa seçtir
    },
    github: {
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
    },
  },

  session: {
    expiresIn: 60 * 60 * 24 * 30, // oturum 30 gün geçerli
    updateAge: 60 * 60 * 24, // her gün kullanımda süre uzatılır
  },

  // Server Action'lardan oturum çerezi ayarlanabilsin diye (listede en sonda olmalı)
  plugins: [nextCookies()],
});

export type Session = typeof auth.$Infer.Session;
