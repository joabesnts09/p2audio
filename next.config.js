/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Garantir que arquivos estáticos grandes não sejam incluídos no bundle das funções serverless
  webpack: (config, { isServer }) => {
    if (isServer) {
      // Excluir arquivos de áudio do bundle do servidor
      // Eles serão servidos como estáticos pelo Next.js
      config.externals = config.externals || []
      if (Array.isArray(config.externals)) {
        config.externals.push({
          'fs/promises': 'commonjs fs/promises',
        })
      }
    }
    return config
  },
}

module.exports = nextConfig
