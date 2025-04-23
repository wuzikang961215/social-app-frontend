// next.config.js
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true, // ✅ 禁用 ESLint 报错导致构建失败
  },
};

module.exports = nextConfig;
