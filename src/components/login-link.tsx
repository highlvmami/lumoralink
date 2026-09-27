"use client";
// Üst menüdeki "Giriş yap" düğmesi. Zaten /login sayfasındaysak gizlenir.
// Hangi sayfada olduğumuzu bilmek için usePathname gerekir; bu bir tarayıcı
// hook'u olduğundan bu küçük parçayı Client Component yaptık, menünün geri kalanı sunucuda kalıyor.
import Link from "next/link";
import { usePathname } from "next/navigation";

export function LoginLink() {
  const pathname = usePathname();
  if (pathname === "/login") return null;

  return (
    <Link
      href="/login"
      className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white dark:bg-white dark:text-black"
    >
      Giriş yap
    </Link>
  );
}
