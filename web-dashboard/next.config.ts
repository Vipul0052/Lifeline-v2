import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  experimental: {
    appDir: true,
  },
  transpilePackages: ['shared'],
}

export default nextConfig
