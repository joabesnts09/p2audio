/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Garantir que o Prisma Client seja gerado durante o build
  // mesmo sem DATABASE_URL configurada
  webpack: (config, { isServer }) => {
    if (isServer) {
      // Não tentar resolver o Prisma Client durante o build se não houver DATABASE_URL
      config.externals = config.externals || []
      
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
