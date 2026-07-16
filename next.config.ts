import type { NextConfig } from "next";

/**
 * Standard Next.js App Router config for Vercel.
 * Use the default Node server runtime (no static export, no custom distDir).
 * Static export mode commonly causes platform 404s on Vercel.
 */
const nextConfig: NextConfig = {
  // Keep default Node.js server output (Vercel Next.js runtime).
  reactStrictMode: true,
};

export default nextConfig;
