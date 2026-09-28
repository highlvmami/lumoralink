"use client";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

export function SignOutButton() {
  const router = useRouter();

  async function signOut() {
    await authClient.signOut(); // oturum veritabanından silinir, çerez temizlenir
    router.push("/");
    router.refresh();
  }

  return (
    <button
      onClick={signOut}
      className="rounded-lg px-3 py-1.5 text-sm text-muted transition hover:bg-soft hover:text-ink"
    >
      Çıkış yap
    </button>
  );
}
