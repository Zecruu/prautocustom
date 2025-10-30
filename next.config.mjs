/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'd1jq7wgb95mzy3.cloudfront.net',
      },
      {
        protocol: 'https',
        hostname: '*.amazonaws.com',
      },
    ],
  },
  // Optimize Sharp for serverless deployment
  experimental: {
    serverComponentsExternalPackages: ['sharp'],
  },
};

export default nextConfig;

