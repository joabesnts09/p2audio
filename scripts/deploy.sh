#!/bin/bash

# Script de deploy para servidor local
# Uso: ./scripts/deploy.sh

set -e  # Parar em caso de erro

echo "🚀 Iniciando deploy da aplicação p2audio..."

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Verificar se está no diretório correto
if [ ! -f "package.json" ]; then
    echo -e "${RED}❌ Erro: package.json não encontrado. Execute este script na raiz do projeto.${NC}"
    exit 1
fi

# Verificar se .env.local existe
if [ ! -f ".env.local" ]; then
    echo -e "${YELLOW}⚠️  Aviso: Arquivo .env.local não encontrado.${NC}"
    echo "Crie o arquivo .env.local antes de fazer o deploy."
    exit 1
fi

echo -e "${GREEN}✓${NC} Verificações iniciais concluídas"

# Instalar dependências
echo ""
echo "📦 Instalando dependências..."
npm install --production

# Gerar cliente Prisma
echo ""
echo "🔧 Gerando cliente Prisma..."
npx prisma generate

# Executar migrações
echo ""
echo "🗄️  Executando migrações do banco de dados..."
npx prisma migrate deploy

# Build da aplicação
echo ""
echo "🏗️  Fazendo build de produção..."
npm run build

# Criar diretório de logs se não existir
mkdir -p logs

# Verificar se PM2 está instalado
if ! command -v pm2 &> /dev/null; then
    echo -e "${YELLOW}⚠️  PM2 não está instalado. Instalando...${NC}"
    sudo npm install -g pm2
fi

# Parar aplicação se já estiver rodando
if pm2 list | grep -q "p2audio"; then
    echo ""
    echo "🛑 Parando aplicação existente..."
    pm2 stop p2audio || true
    pm2 delete p2audio || true
fi

# Iniciar aplicação com PM2
echo ""
echo "▶️  Iniciando aplicação com PM2..."
pm2 start ecosystem.config.js

# Salvar configuração do PM2
pm2 save

echo ""
echo -e "${GREEN}✅ Deploy concluído com sucesso!${NC}"
echo ""
echo "Comandos úteis:"
echo "  - Ver logs: pm2 logs p2audio"
echo "  - Ver status: pm2 status"
echo "  - Reiniciar: pm2 restart p2audio"
echo "  - Parar: pm2 stop p2audio"
echo ""
