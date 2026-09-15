import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Pin the workspace root so the lockfile in the parent directory is ignored.
  turbopack: { root: __dirname },
};

export default nextConfig;
