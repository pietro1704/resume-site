/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  // For static export to Cloudflare Pages
  output: 'export',
  distDir: 'out'
}

module.exports = nextConfig