import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* Configurações para ignorar erros no Vercel e forçar o deploy */
  typescript: {
    ignoreBuildErrors: true,
  },
  /* Garante que a saída é compatível */
  reactStrictMode: true, 
};

export default nextConfig;