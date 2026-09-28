import Link from "next/link";
import { LogoMark } from "./logo";

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-line">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-4 py-6 text-sm text-muted sm:flex-row">
        <span className="inline-flex items-center gap-2">
          <LogoMark className="h-6 w-6" />© {new Date().getFullYear()} LumoraLink
        </span>
        <nav className="flex gap-5">
          <Link href="/privacy" className="transition hover:text-ink">
            Gizlilik
          </Link>
          <a href="https://github.com/highlvmami/lumoralink" target="_blank" className="transition hover:text-ink">
            GitHub
          </a>
        </nav>
      </div>
    </footer>
  );
}
