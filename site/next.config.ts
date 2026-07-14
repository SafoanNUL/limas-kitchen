import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/limas-kitchen",
  images: { unoptimized: true },
  trailingSlash: true,
};

export default nextConfig;
