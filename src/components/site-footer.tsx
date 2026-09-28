import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-zinc-200 dark:border-zinc-800">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4 text-sm text-zinc-500">
        <span>© {new Date().getFullYear()} LumoraLink</span>
        <nav className="flex gap-4">
          <Link href="/privacy" className="hover:underline">
            Gizlilik
          </Link>
          <a href="https://github.com/highlvmami/lumoralink" target="_blank" className="hover:underline">
            GitHub
          </a>
        </nav>
      </div>
    </footer>
  );
}
