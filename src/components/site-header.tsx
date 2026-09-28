// Üst menü (Server Component): oturumu sunucuda okur, sayfa ilk yüklendiğinde
// doğru durumda gelir; "giriş yap" butonu bir an görünüp kaybolmaz.
import Image from "next/image";
import Link from "next/link";
import { getSession } from "@/lib/session";
import { SignOutButton } from "./sign-out-button";

export async function SiteHeader() {
  const session = await getSession();

  return (
    <header className="border-b border-zinc-200 dark:border-zinc-800">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
        <Link href="/" className="text-xl font-bold tracking-tight">
          Lumora<span className="text-zinc-500">Link</span>
        </Link>

        {session ? (
          <nav className="flex items-center gap-4">
            <Link href="/dashboard" className="text-sm font-medium hover:underline">
              Panel
            </Link>
            <SignOutButton />
            {session.user.image ? (
              <Image
                src={session.user.image}
                alt={session.user.name}
                width={32}
                height={32}
                className="rounded-full"
              />
            ) : (
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-200 text-sm font-semibold dark:bg-zinc-800">
                {session.user.name.charAt(0).toUpperCase()}
              </span>
            )}
          </nav>
        ) : null}
      </div>
    </header>
  );
}
