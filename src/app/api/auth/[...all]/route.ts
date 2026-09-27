// /api/auth/* altındaki tüm istekleri Better Auth karşılar:
// /api/auth/sign-in/social, /api/auth/callback/google, /api/auth/sign-out ...
// [...all] "catch-all" segmenttir: bu klasörün altındaki her yolu yakalar.
import { toNextJsHandler } from "better-auth/next-js";
import { auth } from "@/lib/auth";

export const { GET, POST } = toNextJsHandler(auth);
