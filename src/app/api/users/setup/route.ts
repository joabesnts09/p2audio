import { NextRequest, NextResponse } from 'next/server'
import { createPrismaClient, disconnectPrisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

// POST - Criar o primeiro usuário admin (só funciona se não houver usuários)
export async function POST(request: NextRequest) {
  const client = createPrismaClient()
  
  if (!client) {
    return NextResponse.json(
      { error: 'Banco de dados não configurado' },
      { status: 503 }
    )
  }
  
  const { prisma, pool } = client
  
  try {
    // Verificar se já existe algum usuário
    const userCount = await prisma.user.count()
    
    if (userCount > 0) {
      return NextResponse.json(
        { error: 'Já existem usuários cadastrados. Use a página de login ou a área admin para criar novos usuários.' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const { username, email, password } = body

    if (!username || !email || !password) {
      return NextResponse.json(
        { error: 'Usuário, email e senha são obrigatórios' },
        { status: 400 }
      )
    }

    // Validação de senha
    if (password.length < 6) {
      return NextResponse.json(
        { error: 'A senha deve ter no mínimo 6 caracteres' },
        { status: 400 }
      )
    }

    // Hash da senha
    const hashedPassword = await bcrypt.hash(password, 10)

    // Criar usuário
    const user = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
        role: 'admin',
      },
    })

    // Retornar dados do usuário (sem a senha)
    const { password: _, ...userWithoutPassword } = user

    return NextResponse.json(
      {
        user: userWithoutPassword,
        message: 'Primeiro usuário admin criado com sucesso!',
      },
      { status: 201 }
    )
  } catch (error: any) {
    console.error('Erro ao criar primeiro usuário:', error)
    
    // Mensagens de erro mais específicas
    let errorMessage = 'Erro ao criar usuário'
    
    if (error.code === 'P2002') {
      errorMessage = 'Usuário ou email já existe'
    } else if (error.code === 'P1001') {
      errorMessage = 'Não foi possível conectar ao banco de dados. Verifique se o PostgreSQL está rodando.'
    } else if (error.message?.includes('DATABASE_URL')) {
      errorMessage = 'Configuração do banco de dados não encontrada. Verifique o arquivo .env.local'
    } else if (error.message) {
      errorMessage = `Erro: ${error.message}`
    }
    
    return NextResponse.json(
      { error: errorMessage, details: process.env.NODE_ENV === 'development' ? error.message : undefined },
      { status: 500 }
    )
  } finally {
    await disconnectPrisma(prisma, pool)
  }
}
