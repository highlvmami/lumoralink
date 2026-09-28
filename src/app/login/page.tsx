import Link from "next/link";
import { redirect } from "next/navigation";
import { LoginButtons } from "@/components/login-buttons";
import { LogoMark } from "@/components/logo";
import { getSession } from "@/lib/session";
import { ui } from "@/lib/ui";

export const metadata = { title: "Giriş yap" };

export default async function LoginPage({ searchParams }: PageProps<"/login">) {
  // Zaten giriş yapmış kullanıcıyı doğrudan panele gönder
  if (await getSession()) redirect("/dashboard");

  // Better Auth bir hata olursa buraya ?error=... ile döner
  const { error } = await searchParams;

  return (
    <main className="relative flex flex-1 items-center justify-center overflow-hidden px-4 py-16">
      <div
        aria-hidden
        className="pointer-events-none absolute top-1/2 left-1/2 h-[480px] w-[480px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-soft-strong/50 blur-3xl"
      />
      <div className={`${ui.card} relative w-full max-w-sm space-y-7 p-8`}>
        <div className="space-y-3 text-center">
          <LogoMark className="mx-auto h-12 w-12" />
          <h1 className="font-display text-3xl font-semibold tracking-tight">Tekrar hoş geldin</h1>
          <p className="text-sm text-muted">
            Linklerini kaydetmek ve istatistiklerini görmek için giriş yap.
          </p>
        </div>

        {error && <p className={ui.error}>Giriş sırasında bir sorun oluştu. Lütfen tekrar dene.</p>}

        <LoginButtons />

        <p className="text-center text-xs leading-relaxed text-muted">
          Şifren bize hiçbir zaman gelmez; giriş Google veya GitHub üzerinden yapılır. Devam ederek{" "}
          <Link href="/privacy" className="text-brand underline underline-offset-2">
            gizlilik politikasını
          </Link>{" "}
          kabul etmiş olursun.
        </p>
      </div>
    </main>
  );
}
