import type { NextConfig } from 'next'

import '@/lib/env'

const nextConfig: NextConfig = {
  agentRules: false,
  poweredByHeader: false,
  devIndicators: {
    position: 'bottom-right',
  },

  cacheComponents: true,
  partialPrefetching: true,
  reactCompiler: true,
  reactStrictMode: true,

  images: {
    qualities: [90, 100],
    remotePatterns: [
      {
        hostname: '**.neon.tech',
        protocol: 'https',
      },
      {
        hostname: '**.amazonaws.com',
        protocol: 'https',
      },
      {
        hostname: 'images.unsplash.com',
        protocol: 'https',
      },
      {
        hostname: 'res.cloudinary.com',
        protocol: 'https',
      },
      ...(process.env.AWS_ENDPOINT_URL_S3
        ? [
            (() => {
              try {
                const url = new URL(process.env.AWS_ENDPOINT_URL_S3)
                return {
                  hostname: url.hostname,
                  protocol: url.protocol.replace(':', '') as 'http' | 'https',
                }
              } catch {
                return null
              }
            })(),
          ].filter((p): p is { hostname: string; protocol: 'http' | 'https' } => p !== null)
        : []),
    ],
  },

  turbopack: {
    rules: {
      '*.css': {
        as: '*.css',
        loaders: ['@tailwindcss/turbopack'],
      },
    },
  },
}

export default nextConfig
