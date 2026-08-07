import type { NextConfig } from "next";

const isStaticExport = process.env.NEXT_OUTPUT === "export";
const basePath = process.env.NEXT_BASE_PATH || "";

const nextConfig: NextConfig = {
  output: isStaticExport ? "export" : "standalone",
  trailingSlash: isStaticExport,
  ...(basePath && { basePath, assetPrefix: `${basePath}/` }),
  images: {
    unoptimized: isStaticExport,
  },
};

export default nextConfig;
