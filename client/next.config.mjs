/** @type {import('next').NextConfig} */
const nextConfig = {
  // Set default port to 8080
  env: {
    PORT: 8080,
  },
  // Skip linting and type checking during build
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  // Other Next.js configurations can go here
};

export default nextConfig;