// Tarayıcı tarafı Better Auth istemcisi: giriş/çıkış düğmeleri bunu kullanır.
// Arka planda /api/auth/* uçlarına istek atar.
import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient();
