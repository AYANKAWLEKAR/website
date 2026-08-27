import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Static export for GitHub Pages (also fine on Vercel). Pages cannot run
  // the image-optimizer server, so images are served as the original files.
  output: "export",
  images: { unoptimized: true },
};

export default nextConfig;
