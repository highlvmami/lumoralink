// Sunucu tarafında "şu an giriş yapmış kullanıcı kim?" sorusunun tek cevabı.
// Server Component'lerde ve Route Handler'larda kullanılır.
import { headers } from "next/headers";
import { auth } from "@/lib/auth";

export async function getSession() {
  return auth.api.getSession({ headers: await headers() });
}
