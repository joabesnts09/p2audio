/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Headers para controle de cache dos arquivos JSON
  async headers() {
    return [
      {
        source: '/data/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-cache, no-store, must-revalidate',
          },
          {
            key: 'Pragma',
            value: 'no-cache',
          },
          {
            key: 'Expires',
            value: '0',
          },
        ],
      },
    ]
  },
  // Garantir que arquivos estáticos grandes não sejam incluídos no bundle das funções serverless
  webpack: (config, { isServer, webpack }) => {
    if (isServer) {
      // Excluir arquivos de áudio do bundle do servidor usando IgnorePlugin
      // Isso evita que o Vercel inclua os arquivos grandes no bundle da função
      config.plugins.push(
        new webpack.IgnorePlugin({
          resourceRegExp: /public\/Portfólio\/.*\.(wav|mp3|aif|m4a)$/i,
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
