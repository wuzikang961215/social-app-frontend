module.exports = {
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  reactStrictMode: false, // Disable double-rendering in development
  productionBrowserSourceMaps: false, // Disable source maps in production
  swcMinify: true, // Use SWC for faster minification
  experimental: {
    optimizeCss: true, // Enable CSS optimization
  },
}