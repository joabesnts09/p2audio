import { NextRequest, NextResponse } from 'next/server'
import { createPrismaClient, disconnectPrisma } from '@/lib/prisma'

// GET - Listar todos os usuários (sem senha)
export async function GET() {
  const { prisma, pool } = createPrismaClient()

  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json(users)
  } catch (error) {
    console.error('Erro ao listar usuários:', error)
    return NextResponse.json(
      { error: 'Erro ao listar usuários' },
      { status: 500 }
    )
  } finally {
    await disconnectPrisma(prisma, pool)
  }
}
