import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {},

  // Se você estiver usando <img> com URLs externas (picsum, pravatar etc.)
  // isso evita erro de imagem bloqueada quando você migrar para next/image.
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "picsum.photos" },
      { protocol: "https", hostname: "i.pravatar.cc" },
      { protocol: "https", hostname: "images.unsplash.com" }
    ],
  },

  // IMPORTANTE:
  // Não coloque `webpack(config){...}` aqui enquanto estiver usando Turbopack no Next 16,
  // senão ele acusa exatamente o erro que você viu.
};

export default nextConfig;
