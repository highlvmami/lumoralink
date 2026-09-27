import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Profil fotoğrafları Google ve GitHub sunucularından gelir.
    // next/image güvenlik için yalnızca izin verilen adreslerden resim yükler.
    remotePatterns: [
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
      { protocol: "https", hostname: "avatars.githubusercontent.com" },
    ],
  },
};

export default nextConfig;
