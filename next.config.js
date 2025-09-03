/** @type {import('next').NextConfig} */
const nextConfig = {
  // React
  reactStrictMode: true,
  
  // Performance
  swcMinify: true,
  poweredByHeader: false,
  
  // Static export for Cloudflare Pages
  output: 'export',
  distDir: 'out',
  trailingSlash: true,
  
  // Images - unoptimized for static export
  images: {
    unoptimized: true,
    formats: ['image/webp', 'image/avif']
  },
  
  // Compression and optimization
  compress: true,
  
  // Note: Headers don't work with static export - will be handled by Cloudflare Pages
}

module.exports = nextConfig