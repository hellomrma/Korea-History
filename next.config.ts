import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  pageExtensions: ['js', 'jsx', 'mdx', 'ts', 'tsx'],
  images: {
    domains: [],
    unoptimized: true,
  },
  allowedDevOrigins: ['10.100.94.94'],
}

export default nextConfig
