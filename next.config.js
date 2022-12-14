/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  async redirects() {
    return [
      {
        source: '/forms/:path',
        destination: '/forms/:path/submissions',
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;
