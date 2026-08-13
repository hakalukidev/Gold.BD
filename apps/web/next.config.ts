import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Standalone output keeps the production Docker image small (see docker/Dockerfile) —
  // it copies only the traced dependency subset instead of the whole node_modules tree.
  output: "standalone",
};

export default nextConfig;
