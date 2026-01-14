#!/bin/bash

# Script para corrigir autenticação PostgreSQL para TCP/IP

echo "🔧 Corrigindo autenticação PostgreSQL..."

# Encontrar arquivo pg_hba.conf
PG_HBA_FILE=$(find /etc/postgresql -name pg_hba.conf 2>/dev/null | head -1)

if [ -z "$PG_HBA_FILE" ]; then
    echo "❌ Arquivo pg_hba.conf não encontrado!"
    exit 1
fi

echo "📁 Arquivo encontrado: $PG_HBA_FILE"

# Fazer backup
echo "💾 Fazendo backup..."
sudo cp "$PG_HBA_FILE" "${PG_HBA_FILE}.backup.$(date +%Y%m%d_%H%M%S)"

# Verificar configuração atual
echo ""
echo "📋 Configuração atual (linhas relevantes):"
sudo grep -E "^host|^local" "$PG_HBA_FILE" | grep -v "^#" | head -10

# Adicionar/atualizar linha para localhost com md5
echo ""
echo "🔨 Aplicando correção..."

# Verificar se já existe linha para 127.0.0.1
if sudo grep -q "^host.*127.0.0.1/32" "$PG_HBA_FILE"; then
    echo "⚠️  Linha para 127.0.0.1 já existe, atualizando..."
    # Substituir peer/ident por md5
    sudo sed -i 's/^host\(.*\)127\.0\.0\.1\/32\(.*\)peer/host\1127.0.0.1\/32\2md5/' "$PG_HBA_FILE"
    sudo sed -i 's/^host\(.*\)127\.0\.0\.1\/32\(.*\)ident/host\1127.0.0.1\/32\2md5/' "$PG_HBA_FILE"
else
    echo "➕ Adicionando nova linha para 127.0.0.1..."
    # Adicionar linha antes do final do arquivo
    echo "host    all             all             127.0.0.1/32            md5" | sudo tee -a "$PG_HBA_FILE" > /dev/null
fi

# Verificar se já existe linha para ::1/128 (IPv6 localhost)
if sudo grep -q "^host.*::1/128" "$PG_HBA_FILE"; then
    echo "⚠️  Linha para ::1 já existe, atualizando..."
    sudo sed -i 's/^host\(.*\)::1\/128\(.*\)peer/host\1::1\/128\2md5/' "$PG_HBA_FILE"
    sudo sed -i 's/^host\(.*\)::1\/128\(.*\)ident/host\1::1\/128\2md5/' "$PG_HBA_FILE"
else
    echo "➕ Adicionando nova linha para ::1..."
    echo "host    all             all             ::1/128                 md5" | sudo tee -a "$PG_HBA_FILE" > /dev/null
fi

echo ""
echo "✅ Correção aplicada!"
echo ""
echo "📋 Nova configuração (linhas relevantes):"
sudo grep -E "^host.*127.0.0.1|^host.*::1" "$PG_HBA_FILE" | grep -v "^#"

echo ""
echo "🔄 Reiniciando PostgreSQL..."
sudo systemctl restart postgresql

echo ""
echo "✅ Pronto! Teste a conexão com:"
echo "   PGPASSWORD='joabesnts09' psql -U joabe -h localhost -d p2audio -c \"SELECT 1;\""
