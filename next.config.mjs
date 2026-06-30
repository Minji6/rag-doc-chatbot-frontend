/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    proxyTimeout: 180_000,  // 3분 — 이미지 분석 + 다중 LLM 호출 대비
  },
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
