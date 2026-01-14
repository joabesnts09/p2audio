# 🎛️ Painel Administrativo - p2audio

## 📋 Estrutura do Banco de Dados

O sistema agora possui **3 tabelas**:

### 1. **User** (Usuários/Admin)
- `id` - ID único
- `username` - Nome de usuário (único)
- `email` - Email (único)
- `password` - Senha (hash)
- `role` - Função (padrão: "admin")

### 2. **Audio** (Áudios com Upload)
- `id` - ID único
- `title` - Título *
- `description` - Descrição *
- `audioUrl` - URL do arquivo após upload *
- `type` - Tipo de serviço (opcional)
- `client` - Cliente (opcional)
- `duration` - Duração MM:SS (opcional)
- `coverImage` - URL da imagem de capa (opcional)

### 3. **YouTubeVideo** (Vídeos do YouTube)
- `id` - ID único
- `title` - Título *
- `description` - Descrição *
- `youtubeUrl` - Link do YouTube *
- `type` - Tipo de serviço (opcional)
- `client` - Cliente (opcional)
- `duration` - Duração MM:SS (opcional)
- `coverImage` - URL da imagem de capa (opcional)

---

## 🚀 Configuração Inicial

### 1. Configurar Banco de Dados

Edite o arquivo `.env.local`:

```env
DATABASE_URL="postgresql://usuario:senha@localhost:5432/p2audio?schema=public"
```

### 2. Executar Migrações

```bash
# Gerar cliente Prisma
npx prisma generate

# Criar tabelas no banco
npx prisma migrate dev --name init
```

### 3. Criar Primeiro Usuário Admin

**Opção A: Via API (mais simples)**

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "email": "admin@example.com",
    "password": "sua_senha_aqui"
  }'
```

**Opção B: Via Prisma Studio**

1. Execute: `npx prisma studio`
2. Vá na tabela `User`
3. Clique em "Add record"
4. Preencha os campos (use bcrypt para hash da senha)

**Opção C: Via Script (requer ts-node)**

```bash
npm install -D ts-node @types/node
npx ts-node scripts/create-admin.ts
```

---

## 🔐 Acessar o Painel Admin

1. **Acesse:** http://localhost:3000/admin/login
2. **Faça login** com suas credenciais
3. Você será redirecionado para `/admin`

---

## 📝 Como Usar o Painel

### Adicionar Áudio:

1. Vá na aba **"Áudios"**
2. Preencha:
   - Título *
   - Descrição *
   - Faça upload do arquivo de áudio *
   - Tipo, Cliente, Duração (opcionais)
3. Clique em **"Criar Áudio"**

### Adicionar Vídeo do YouTube:

1. Vá na aba **"Vídeos do YouTube"**
2. Preencha:
   - Título *
   - Descrição *
   - Cole o link do YouTube *
   - Tipo, Cliente, Duração (opcionais)
3. Clique em **"Criar Vídeo"**

### Editar/Deletar:

- Clique em **"Editar"** para modificar
- Clique em **"Deletar"** para remover

---

## 🔒 Segurança

⚠️ **IMPORTANTE:** O sistema de autenticação atual usa `localStorage` para armazenar a sessão.

**Para produção, considere:**
- Implementar NextAuth.js ou similar
- Usar cookies HTTP-only
- Adicionar CSRF protection
- Implementar rate limiting

---

## 📡 API Routes Disponíveis

### Autenticação:
- `POST /api/auth/login` - Login
- `POST /api/auth/register` - Criar usuário

### Áudios:
- `GET /api/audios` - Listar todos
- `POST /api/audios` - Criar
- `GET /api/audios/[id]` - Buscar por ID
- `PUT /api/audios/[id]` - Atualizar
- `DELETE /api/audios/[id]` - Deletar

### Vídeos do YouTube:
- `GET /api/youtube` - Listar todos
- `POST /api/youtube` - Criar
- `GET /api/youtube/[id]` - Buscar por ID
- `PUT /api/youtube/[id]` - Atualizar
- `DELETE /api/youtube/[id]` - Deletar

### Upload:
- `POST /api/upload` - Upload de arquivo de áudio

---

## ✅ Pronto!

Agora você tem:
- ✅ 3 tabelas separadas (User, Audio, YouTubeVideo)
- ✅ Painel admin com autenticação
- ✅ Upload de arquivos de áudio
- ✅ Gerenciamento de vídeos do YouTube
- ✅ Interface separada por abas

Acesse `/admin/login` para começar!
