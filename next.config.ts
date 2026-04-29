import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Ensure `aria-build.config.json` and brand assets are available if code uses `readFileSync`
  // (see `getBuildConfig`); Vercel serverless tracing can omit unimported root files without this.
  outputFileTracingIncludes: {
    "/*": ["./aria-build.config.json"],
  },
};

export default nextConfig;
