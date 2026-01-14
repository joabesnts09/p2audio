/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config, { isServer }) => {
    if (isServer) {
      // Ignorar sanity.config.ts durante o build (não é necessário para produção)
      config.resolve.alias = {
        ...config.resolve.alias,
        './sanity.config': false,
      }
    }
    return config
  },
  // Excluir sanity.config.ts do build
  pageExtensions: ['ts', 'tsx', 'js', 'jsx'],
}

module.exports = nextConfig
