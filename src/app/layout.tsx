import type { Metadata } from "next";
import { Fraunces, Geist, Geist_Mono } from "next/font/google";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin", "latin-ext"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Başlıklar için yumuşak, doğal hissiyatlı bir serif yazı tipi
const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin", "latin-ext"],
});

export const metadata: Metadata = {
  // Alt sayfalar sadece kendi adını verir, marka otomatik eklenir: "Panel · LumoraLink"
  title: { default: "LumoraLink", template: "%s · LumoraLink" },
  description: "LumoraLink: link kısaltıcı ve tıklama analitiği paneli",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="tr"
      className={`${geistSans.variable} ${geistMono.variable} ${fraunces.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-canvas font-sans text-ink">
        <SiteHeader />
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}
