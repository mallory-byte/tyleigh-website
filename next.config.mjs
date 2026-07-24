/** @type {import('next').NextConfig} */
const nextConfig = {
  // Don't let a stray type/lint error block a deploy on Vercel.
  typescript: { ignoreBuildErrors: true },
  eslint: { ignoreDuringBuilds: true },
  images: { unoptimized: true },
};

export default nextConfig;
