// Üst menü (Server Component): oturumu sunucuda okur, sayfa ilk yüklendiğinde
// doğru durumda gelir.
import Image from "next/image";
import Link from "next/link";
import { getSession } from "@/lib/session";
import { Logo } from "./logo";
import { SignOutButton } from "./sign-out-button";

export async function SiteHeader() {
  const session = await getSession();

  return (
    <header className="sticky top-0 z-20 border-b border-line bg-canvas/85 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link href="/" aria-label="LumoraLink ana sayfa">
          <Logo />
        </Link>

        {session ? (
          <nav className="flex items-center gap-2 sm:gap-4">
            <Link
              href="/dashboard"
              className="rounded-lg px-3 py-1.5 text-sm font-medium text-ink transition hover:bg-soft"
            >
              Panel
            </Link>
            <SignOutButton />
            {session.user.image ? (
              <Image
                src={session.user.image}
                alt={session.user.name}
                width={34}
                height={34}
                className="rounded-full ring-2 ring-soft-strong"
              />
            ) : (
              <span className="flex h-[34px] w-[34px] items-center justify-center rounded-full bg-soft text-sm font-semibold text-brand">
                {session.user.name.charAt(0).toUpperCase()}
              </span>
            )}
          </nav>
        ) : null}
      </div>
    </header>
  );
}
