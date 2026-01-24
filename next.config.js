/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Excluir arquivos de áudio do bundle das funções serverless
  experimental: {
    serverComponentsExternalPackages: [],
  },
  // Garantir que arquivos estáticos não sejam incluídos no bundle
  webpack: (config, { isServer }) => {
    if (isServer) {
      // Excluir arquivos de áudio do bundle do servidor
      config.externals = config.externals || []
      config.externals.push({
        'fs/promises': 'commonjs fs/promises',
        'path': 'commonjs path',
        'fs': 'commonjs fs',
      })
    }
    return config
  },
}

module.exports = nextConfig
