import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // React Compiler para optimizar renders
  reactCompiler: true,
  
  // Seguridad: remover header X-Powered-By
  poweredByHeader: false,
};

export default nextConfig;
