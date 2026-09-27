import Link from "next/link";
import { redirect } from "next/navigation";
import { LoginButtons } from "@/components/login-buttons";
import { getSession } from "@/lib/session";

export const metadata = { title: "Giriş yap" };

export default async function LoginPage({ searchParams }: PageProps<"/login">) {
  // Zaten giriş yapmış kullanıcıyı doğrudan panele gönder
  if (await getSession()) redirect("/dashboard");

  // Better Auth bir hata olursa buraya ?error=... ile döner
  const { error } = await searchParams;

  return (
    <main className="mx-auto flex w-full max-w-sm flex-1 flex-col items-center justify-center gap-6 px-4 py-20">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold tracking-tight">Giriş yap</h1>
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          Linklerini kaydetmek ve istatistiklerini görmek için giriş yap.
        </p>
      </div>

      {error && (
        <p className="w-full rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700 dark:bg-red-950 dark:text-red-300">
          Giriş sırasında bir sorun oluştu. Lütfen tekrar dene.
        </p>
      )}

      <LoginButtons />

      <p className="text-center text-xs text-zinc-500">
        Şifren bize hiçbir zaman gelmez; giriş Google veya GitHub üzerinden yapılır.
      </p>
      <Link href="/" className="text-sm underline">
        Ana sayfaya dön
      </Link>
    </main>
  );
}
