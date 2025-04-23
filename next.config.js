// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true, // ✅ 完全跳过 eslint 报错
  },
};

module.exports = nextConfig;
