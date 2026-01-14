# 🚀 Deploy na Vercel com Dados Mockados (Demonstração)

Este guia explica como fazer deploy na Vercel usando dados mockados para apresentação à cliente, sem necessidade de banco de dados.

---

## ✅ O que foi configurado

- ✅ Dados mockados para áudios (3 áudios da pasta `public/audio`)
- ✅ Dados mockados para vídeos do YouTube (3 links)
- ✅ Sistema detecta automaticamente se deve usar dados mockados

---

## 📋 Dados Mockados Configurados

### Áudios:
1. **Projeto de Áudio 1** - `/audio/aud1.mp3`
2. **Projeto de Áudio 2** - `/audio/aud2.mp3`
3. **Projeto de Áudio 3** - `/audio/aud3.mp3`

### Vídeos do YouTube:
1. `https://www.youtube.com/watch?v=sR9mcz_Ujto`
2. `https://www.youtube.com/watch?v=w4p6ufUr7yk`
3. `https://www.youtube.com/watch?v=J0iQf21GBpA`

---

## 🚀 Como fazer deploy na Vercel

### Opção 1: Sem banco de dados (Modo Demonstração)

1. **Criar conta na Vercel:**
   - Acesse [vercel.com](https://vercel.com)
   - Faça login com GitHub/GitLab/Bitbucket

2. **Conectar repositório:**
   - Clique em "Add New Project"
   - Conecte seu repositório Git
   - Ou faça upload manual

3. **Configurar variáveis de ambiente:**
   - No painel da Vercel, vá em **Settings** → **Environment Variables**
   - Adicione:
     ```
     USE_MOCK_DATA=true
     ```
   - **NÃO** adicione `DATABASE_URL` (ou deixe vazio)

4. **Fazer deploy:**
   - A Vercel detecta automaticamente Next.js
   - Clique em "Deploy"
   - Aguarde o build completar

5. **Pronto!**
   - O site estará no ar com dados mockados
   - Áudios e vídeos funcionando sem banco de dados

---

### Opção 2: Via Vercel CLI

```bash
# Instalar Vercel CLI
npm install -g vercel

# Fazer deploy
vercel

# Quando perguntar sobre variáveis de ambiente:
# - USE_MOCK_DATA: true
# - DATABASE_URL: (deixe vazio ou não configure)
```

---

## 🔄 Como funciona

O sistema detecta automaticamente se deve usar dados mockados:

1. **Se `USE_MOCK_DATA=true`** → Usa dados mockados
2. **Se `DATABASE_URL` não estiver configurado** → Usa dados mockados
3. **Se houver erro ao conectar no banco** → Usa dados mockados (fallback)

Isso garante que o site sempre funcione, mesmo sem banco de dados configurado.

### ⚠️ Sobre o Prisma

- ✅ O Prisma Client será gerado automaticamente durante o build na Vercel
- ✅ **NÃO precisa** de `DATABASE_URL` para gerar o Prisma Client
- ✅ O código foi ajustado para retornar `null` quando não há banco configurado
- ✅ As rotas verificam se o Prisma está disponível antes de usar
- ✅ Se não houver Prisma, usa dados mockados automaticamente

**Não vai dar erro no deploy!** 🎉

---

## 📝 Configuração de Variáveis de Ambiente na Vercel

### Para modo demonstração (sem banco):

```
USE_MOCK_DATA=true
NODE_ENV=production
```

### Para produção (com banco):

```
DATABASE_URL=postgresql://...
USE_MOCK_DATA=false
JWT_SECRET=sua_chave_secreta
```

---

## 🎯 Adicionar domínio próprio

1. No painel da Vercel, vá em **Settings** → **Domains**
2. Clique em "Add Domain"
3. Digite: `p2audio.com.br`
4. Configure DNS no registrador do domínio:
   - **CNAME:** `www` → `cname.vercel-dns.com`
   - **A Record:** `@` → `76.76.21.21`
5. Aguarde propagação (pode levar até 48h)

---

## ✅ Checklist de Deploy

- [ ] Conta criada na Vercel
- [ ] Repositório conectado ou código enviado
- [ ] Variável `USE_MOCK_DATA=true` configurada
- [ ] `DATABASE_URL` não configurado (ou vazio)
- [ ] Build concluído com sucesso
- [ ] Site acessível e funcionando
- [ ] Áudios carregando corretamente
- [ ] Vídeos do YouTube funcionando
- [ ] Domínio configurado (opcional)

---

## 🐛 Troubleshooting

### Áudios não carregam:
- Verifique se os arquivos estão em `public/audio/`
- Verifique os nomes: `aud1.mp3`, `aud2.mp3`, `aud3.mp3`

### Vídeos não aparecem:
- Verifique se os links do YouTube estão corretos
- Verifique o console do navegador para erros

### Dados não aparecem:
- Verifique se `USE_MOCK_DATA=true` está configurado
- Verifique os logs da Vercel (Deployments → View Function Logs)

### Erro do Prisma no build:
- ✅ **Não vai acontecer!** O código foi ajustado para funcionar sem DATABASE_URL
- O Prisma Client é gerado durante o build (não precisa de conexão)
- Se houver erro, verifique os logs da Vercel
- Certifique-se de que `USE_MOCK_DATA=true` está configurado

---

## 🎉 Pronto!

Agora você pode fazer deploy na Vercel sem banco de dados para apresentar à cliente!

**URL do site:** `https://seu-projeto.vercel.app`

**Com domínio:** `https://p2audio.com.br`

---

## 📞 Próximos Passos

Depois da apresentação, quando quiser usar banco de dados real:

1. Configure `DATABASE_URL` na Vercel
2. Configure `USE_MOCK_DATA=false`
3. Faça novo deploy
4. Os dados reais do banco serão usados automaticamente
