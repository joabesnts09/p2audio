import { NextResponse } from 'next/server'
import { createPrismaClient, disconnectPrisma } from '@/lib/prisma'

// GET - Verificar se existe algum usuário no banco
export async function GET() {
  const { prisma, pool } = createPrismaClient()
  
  try {
    const userCount = await prisma.user.count()
    return NextResponse.json({ hasUsers: userCount > 0, count: userCount })
  } catch (error: any) {
    console.error('Erro ao verificar usuários:', error)
    
    // Mensagens de erro mais específicas
    let errorMessage = 'Erro ao verificar usuários'
    
    if (error.code === 'P1001') {
      errorMessage = 'Não foi possível conectar ao banco de dados. Verifique se o PostgreSQL está rodando.'
    } else if (error.message?.includes('DATABASE_URL')) {
      errorMessage = 'Configuração do banco de dados não encontrada'
    } else if (error.message) {
      errorMessage = `Erro: ${error.message}`
    }
    
    return NextResponse.json(
      { error: errorMessage, hasUsers: false, details: process.env.NODE_ENV === 'development' ? error.message : undefined },
      { status: 500 }
    )
  } finally {
    await disconnectPrisma(prisma, pool)
  }
}
