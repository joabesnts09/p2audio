import { NextRequest, NextResponse } from 'next/server'
import { createPrismaClient, disconnectPrisma } from '@/lib/prisma'
import { generateToken, getTokenExpirationDate } from '@/lib/jwt'
import bcrypt from 'bcryptjs'

export async function POST(request: NextRequest) {
  const { prisma, pool } = createPrismaClient()

  try {
    const body = await request.json()
    const { username, password } = body

    if (!username || !password) {
      return NextResponse.json(
        { error: 'Usuário e senha são obrigatórios' },
        { status: 400 }
      )
    }

    // Buscar usuário
    const user = await prisma.user.findUnique({
      where: { username },
    })

    if (!user) {
      return NextResponse.json(
        { error: 'Usuário ou senha inválidos' },
        { status: 401 }
      )
    }

    // Verificar senha
    const isValidPassword = await bcrypt.compare(password, user.password)

    if (!isValidPassword) {
      return NextResponse.json(
        { error: 'Usuário ou senha inválidos' },
        { status: 401 }
      )
    }

    // Gerar token JWT
    let token: string
    try {
      token = generateToken({
        userId: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
      })
    } catch (tokenError) {
      console.error('Erro ao gerar token JWT:', tokenError)
      return NextResponse.json(
        { error: 'Erro ao gerar token de autenticação' },
        { status: 500 }
      )
    }

    // Calcular data de expiração (3 dias)
    const expireToken = getTokenExpirationDate()

    // Atualizar o campo expireToken no banco de dados
    try {
      await prisma.user.update({
        where: { id: user.id },
        data: { expireToken },
      })
    } catch (updateError) {
      console.error('Erro ao atualizar expireToken:', updateError)
      // Não falhar o login se apenas a atualização do expireToken falhar
    }

    // Retornar dados do usuário (sem a senha) e o token
    const { password: _, ...userWithoutPassword } = user

    return NextResponse.json({
      user: userWithoutPassword,
      token,
      expireToken: expireToken.toISOString(),
      message: 'Login realizado com sucesso',
    })
  } catch (error) {
    console.error('Erro ao fazer login:', error)
    return NextResponse.json(
      { error: 'Erro ao fazer login' },
      { status: 500 }
    )
  } finally {
    await disconnectPrisma(prisma, pool)
  }
}
