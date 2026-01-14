# p2audio - Produtora de Áudio

Site institucional da p2audio desenvolvido com Next.js, TypeScript e Tailwind CSS, inspirado na arquitetura moderna de portfólios profissionais.

## 🚀 Tecnologias

- **Next.js 14** - Framework React com App Router
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Estilização utilitária
- **Framer Motion** - Animações suaves
- **React Hot Toast** - Notificações
- **EmailJS** - Envio de emails via formulário

## 📋 Pré-requisitos

- Node.js 18+ 
- npm ou yarn

## 🛠️ Instalação

1. Instale as dependências:
```bash
npm install
```

2. Configure as variáveis de ambiente (opcional - para formulário de contato):
```bash
# Crie um arquivo .env.local na raiz do projeto
NEXT_PUBLIC_EMAILJS_SERVICE_ID=your_service_id
NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=your_template_id
NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=your_public_key
NEXT_PUBLIC_RECEIVER_EMAIL=seu@email.com
```

3. Execute o servidor de desenvolvimento:
```bash
npm run dev
```

4. Abra [http://localhost:3000](http://localhost:3000) no seu navegador.

## 📁 Estrutura do Projeto

```
p2audio/
├── src/
│   ├── app/
│   │   ├── globals.css      # Estilos globais e Tailwind
│   │   ├── layout.tsx       # Layout raiz com Toaster
│   │   └── page.tsx         # Página principal
│   ├── components/
│   │   ├── Header/          # Cabeçalho com navegação ativa
│   │   ├── Hero/            # Seção hero com frame branco
│   │   ├── Services/        # Seção de serviços
│   │   ├── Contact/         # Formulário de contato
│   │   ├── Footer/          # Rodapé
│   │   ├── Logo/            # Componente do logo
│   │   └── Main/            # Container principal + BoxArrowUp
│   └── hooks/
│       └── useScroll.ts     # Hook para navegação ativa baseada em scroll
└── public/                  # Arquivos estáticos
```

## 🎨 Características

- **Arquitetura Moderna**: Estrutura organizada com componentes em pastas
- **Navegação Ativa**: Hook customizado que detecta a seção visível no scroll
- **Animações Suaves**: Framer Motion para transições elegantes
- **Menu Mobile**: Menu hambúrguer funcional com animações
- **Design Responsivo**: Totalmente adaptável a todos os dispositivos
- **Formulário de Contato**: Integração com EmailJS para envio de emails
- **Botão Voltar ao Topo**: Aparece automaticamente ao fazer scroll
- **Textura de Fundo**: Efeito visual nas seções escuras
- **Toast Notifications**: Feedback visual para ações do usuário

## 🎯 Funcionalidades

### Navegação
- Header fixo com backdrop blur
- Navegação ativa baseada em scroll
- Menu mobile com animação hambúrguer
- Links suaves entre seções

### Animações
- Entrada suave dos componentes
- Animações ao scroll (whileInView)
- Transições de hover
- Indicador REC pulsante

### Formulário de Contato
- Validação de campos
- Integração com EmailJS
- Feedback visual com toast
- Estados de loading

## 📝 Scripts Disponíveis

- `npm run dev` - Inicia o servidor de desenvolvimento
- `npm run build` - Cria build de produção
- `npm run start` - Inicia o servidor de produção
- `npm run lint` - Executa o linter

## 🔧 Configuração do EmailJS

Para habilitar o formulário de contato:

1. Crie uma conta em [EmailJS](https://www.emailjs.com/)
2. Configure um serviço de email (Gmail, Outlook, etc.)
3. Crie um template de email
4. Adicione as credenciais no arquivo `.env.local`

## 🎨 Cores e Tema

- **Fundo Escuro**: `#1a1a1a` (dark-charcoal)
- **Dourado**: `#FFD700` (gold-yellow)
- **Branco**: Para seções de serviços
- **Textura**: Overlay sutil nas seções escuras

## 📱 Seções do Site

1. **Hero** - Apresentação principal com frame branco e indicador REC
2. **Serviços** - Casting, Tradução e Produção de Áudio
3. **Contato** - Formulário de contato integrado
4. **Footer** - Logo, telefone e copyright

## 🚀 Próximos Passos

- [ ] Adicionar seção de Portfólio
- [ ] Adicionar seção Sobre
- [ ] Implementar galeria de projetos
- [ ] Adicionar depoimentos de clientes
- [ ] Integrar player de áudio para demonstrações

## 📄 Licença

Este projeto é privado e propriedade da p2audio.
