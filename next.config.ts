import type { NextConfig } from "next";
import { features } from "./src/lib/features";

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    unoptimized: true,
  },
  // Retail route files are named `page.retail.tsx`, which Next.js only treats
  // as pages when the extension is registered. With the retail flag off they
  // are never routed, so the screens are left out of the build entirely.
  pageExtensions: features.retail
    ? ["tsx", "ts", "jsx", "js", "retail.tsx"]
    : ["tsx", "ts", "jsx", "js"],
};

export default nextConfig;
