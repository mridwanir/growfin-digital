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
