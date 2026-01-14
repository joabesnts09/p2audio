/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Garantir que o Prisma Client seja gerado durante o build
  // mesmo sem DATABASE_URL configurada
  webpack: (config, { isServer }) => {
    if (isServer) {
      // Não tentar resolver o Prisma Client durante o build se não houver DATABASE_URL
      config.externals = config.externals || []
    }
    return config
  },
}

module.exports = nextConfig
