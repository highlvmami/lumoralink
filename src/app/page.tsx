// Tanıtım sayfası. Giriş yapmış kullanıcı doğrudan paneline gider;
// giriş yapmamış ziyaretçi yalnızca tanıtımı ve "Başla" düğmesini görür.
import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";

const features = [
  { title: "Kısa linkler", text: "Uzun adresleri saniyeler içinde kısalt, istersen kendi kısa adını seç." },
  { title: "Tıklama analitiği", text: "Kaç kişinin tıkladığını, nereden geldiğini ve hangi cihazı kullandığını gör." },
  { title: "QR kod", text: "Her link için indirilebilir QR kod üret, basılı materyallerde kullan." },
];

export default async function Home() {
  if (await getSession()) redirect("/dashboard");

  return (
    <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col items-center justify-center gap-12 px-4 py-20">
      <div className="space-y-4 text-center">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          Uzun linkleri kısalt, <br className="hidden sm:block" />
          tıklamaları takip et.
        </h1>
        <p className="mx-auto max-w-xl text-zinc-600 dark:text-zinc-400">
          LumoraLink ile linklerini tek yerden yönet, her tıklamanın istatistiğini gör.
        </p>
        <Link
          href="/login"
          className="inline-block rounded-lg bg-zinc-900 px-6 py-3 font-medium text-white dark:bg-white dark:text-black"
        >
          Ücretsiz başla
        </Link>
      </div>

      <div className="grid w-full gap-4 sm:grid-cols-3">
        {features.map((f) => (
          <div key={f.title} className="rounded-lg border border-zinc-200 p-5 dark:border-zinc-800">
            <h2 className="font-semibold">{f.title}</h2>
            <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">{f.text}</p>
          </div>
        ))}
      </div>
    </main>
  );
}
