const withPWA = require('next-pwa')
const runtimeCaching = require('next-pwa/cache')
const { PHASE_PRODUCTION_BUILD, PHASE_PRODUCTION_SERVER } = require('next/constants')
const withPlugins = require('next-compose-plugins')
const withTM = require('next-transpile-modules')(['@simplewebauthn/browser']);

const nextConfig = {
  experimental: {
    optimizeCss:true,
    esmExternals: false
  },
  reactStrictMode: true,
  poweredByHeader: false,
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback.fs = false;
      config.resolve.fallback.net = false;
      config.resolve.fallback.tls = false;
    }
    return config;
  }
}

module.exports = withPlugins([
  [withPWA, {
    pwa: {
      dest: 'public',
      runtimeCaching
    },
  }, [PHASE_PRODUCTION_BUILD, PHASE_PRODUCTION_SERVER]],
  [withTM]
], nextConfig)
