/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Garantir que arquivos estáticos não sejam incluídos no bundle das funções serverless
  webpack: (config, { isServer, webpack }) => {
    if (isServer) {
      // Excluir arquivos de áudio da pasta Portfólio do bundle
      config.plugins.push(
        new webpack.IgnorePlugin({
          resourceRegExp: /^\.\/Portfólio\/.*\.(wav|mp3|aif|m4a)$/i,
        })
      )
      
      // Excluir módulos do Node.js que podem causar problemas no bundle
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
