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
    <button onClick={signOut} className="text-sm text-zinc-600 hover:underline dark:text-zinc-400">
      Çıkış yap
    </button>
  );
}
