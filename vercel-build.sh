#!/bin/bash
# Script de build para Vercel que gera Prisma Client mesmo sem DATABASE_URL

set -e

echo "🔧 Gerando Prisma Client..."

# Gerar Prisma Client (não precisa de DATABASE_URL para isso)
npx prisma generate || {
  echo "⚠️  Aviso: Prisma Client não pôde ser gerado, mas continuando o build..."
}

echo "🏗️  Fazendo build do Next.js..."
npm run build
