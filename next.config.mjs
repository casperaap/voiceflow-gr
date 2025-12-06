/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // Warning: this lets production builds succeed even with ESLint errors
    ignoreDuringBuilds: true,
  },
  // ...any other Next config you already have
};

export default nextConfig;
