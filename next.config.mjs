/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "http://localhost:80/api/:path*",
      },
      {
        source: "/chat_history/:path*",
        destination: "http://localhost:80/chat_history/:path*",
      },
    ];
  },
};

export default nextConfig;
