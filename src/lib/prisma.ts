import { PrismaClient } from '@prisma/client'
import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'

// Função helper para criar PrismaClient com adapter PostgreSQL
// Necessário para Prisma 7.2.0 que requer adapter ou accelerateUrl
// Retorna null se não houver DATABASE_URL (modo demonstração)
export function createPrismaClient() {
  try {
    if (!process.env.DATABASE_URL) {
      console.log('[Prisma] DATABASE_URL não configurada, usando modo demonstração')
      return null
    }

    const pool = new Pool({ connectionString: process.env.DATABASE_URL })
    const adapter = new PrismaPg(pool)
    const prisma = new PrismaClient({ adapter })

    if (!prisma) {
      throw new Error('Falha ao criar PrismaClient')
    }

    return { prisma, pool }
  } catch (error) {
    console.error('Erro ao criar PrismaClient:', error)
    // Em modo demonstração, retorna null ao invés de lançar erro
    if (process.env.USE_MOCK_DATA === 'true' || !process.env.DATABASE_URL) {
      console.log('[Prisma] Usando modo demonstração devido ao erro')
      return null
    }
    throw error
  }
}

// Função helper para desconectar PrismaClient e pool
export async function disconnectPrisma(prisma: PrismaClient | null, pool: Pool | null) {
  if (!prisma || !pool) return
  
  try {
    await prisma.$disconnect()
    await pool.end()
  } catch (error) {
    console.error('Erro ao desconectar Prisma:', error)
  }
}
