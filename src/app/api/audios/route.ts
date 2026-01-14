import { NextRequest, NextResponse } from 'next/server'
import { createPrismaClient, disconnectPrisma } from '@/lib/prisma'

// Dados mockados para demonstração
const MOCK_AUDIOS = [
  {
    id: 'mock-1',
    title: 'Projeto de Áudio 1',
    description: 'Demonstração de produção de áudio profissional com qualidade superior.',
    audioUrl: '/audio/aud1.mp3',
    type: 'Produção de Áudio',
    client: 'Cliente Demo',
    duration: '02:30',
    coverImage: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'mock-2',
    title: 'Projeto de Áudio 2',
    description: 'Spot publicitário com trilha sonora personalizada e narração profissional.',
    audioUrl: '/audio/aud2.mp3',
    type: 'Spot Publicitário',
    client: 'Cliente Demo',
    duration: '01:45',
    coverImage: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'mock-3',
    title: 'Projeto de Áudio 3',
    description: 'E-book narrado com voz profissional e edição de alta qualidade.',
    audioUrl: '/audio/aud3.mp3',
    type: 'E-book Narrado',
    client: 'Cliente Demo',
    duration: '03:15',
    coverImage: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
]

// GET - Listar todos os áudios
export async function GET() {
  // Verificar se deve usar dados mockados (modo demonstração ou sem DATABASE_URL)
  const useMockData = process.env.USE_MOCK_DATA === 'true' || !process.env.DATABASE_URL
  
  if (useMockData) {
    console.log('[API] Usando dados mockados para áudios')
    return NextResponse.json(MOCK_AUDIOS)
  }

  try {
    const client = createPrismaClient()
    
    // Se não houver cliente Prisma (modo demonstração), retornar mockados
    if (!client) {
      return NextResponse.json(MOCK_AUDIOS)
    }
    
    const { prisma, pool } = client
    
    const audios = await prisma.audio.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    })
    // Sempre retornar um array, mesmo que vazio
    return NextResponse.json(Array.isArray(audios) ? audios : [])
  } catch (error) {
    console.error('Erro ao buscar áudios do banco, usando dados mockados:', error)
    // Em caso de erro, retornar dados mockados para não quebrar o frontend
    return NextResponse.json(MOCK_AUDIOS)
  } finally {
    try {
      const client = createPrismaClient()
      if (client) {
        await disconnectPrisma(client.prisma, client.pool)
      }
    } catch (e) {
      // Ignorar erro de desconexão se não houver conexão
    }
  }
}

// POST - Criar novo áudio
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
    const body = await request.json()
    const { title, description, audioUrl, type, client, duration, coverImage } = body

    if (!title || !description || !audioUrl) {
      return NextResponse.json(
        { error: 'Título, descrição e arquivo de áudio são obrigatórios' },
        { status: 400 }
      )
    }

    const audio = await prisma.audio.create({
      data: {
        title,
        description,
        audioUrl,
        type: type || null,
        client: client || null,
        duration: duration || null,
        coverImage: coverImage || null,
      },
    })

    return NextResponse.json(audio, { status: 201 })
  } catch (error) {
    console.error('Erro ao criar áudio:', error)
    return NextResponse.json(
      { error: 'Erro ao criar áudio' },
      { status: 500 }
    )
  } finally {
    await disconnectPrisma(prisma, pool)
  }
}
