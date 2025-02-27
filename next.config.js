/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['i.ytimg.com', 'img.youtube.com'],
  },
  // バックエンドAPIへのプロキシ設定
  async rewrites() {
    // Check if BACKEND_URL is defined, otherwise use a default value or return empty array
    if (process.env.BACKEND_URL) {
      return [
        {
          source: '/api/:path*',
          destination: process.env.BACKEND_URL + '/api/:path*',
        },
      ];
    }
    // If BACKEND_URL is not defined, return empty array to avoid the error
    return [];
  },
};

module.exports = nextConfig;
