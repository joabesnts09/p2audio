import { NextRequest, NextResponse } from 'next/server'
import { createPrismaClient, disconnectPrisma } from '@/lib/prisma'

// Dados mockados para demonstração
const MOCK_VIDEOS = [
  {
    id: 'mock-youtube-1',
    title: 'Vídeo Demonstrativo 1',
    description: 'Exemplo de trabalho realizado com produção de áudio profissional.',
    youtubeUrl: 'https://www.youtube.com/watch?v=sR9mcz_Ujto',
    type: 'Produção de Áudio',
    client: null,
    duration: null,
    coverImage: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'mock-youtube-2',
    title: 'Vídeo Demonstrativo 2',
    description: 'Spot publicitário com narração profissional e edição de alta qualidade.',
    youtubeUrl: 'https://www.youtube.com/watch?v=w4p6ufUr7yk',
    type: 'Spot Publicitário',
    client: null,
    duration: null,
    coverImage: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'mock-youtube-3',
    title: 'Vídeo Demonstrativo 3',
    description: 'E-book narrado com voz profissional e trilha sonora personalizada.',
    youtubeUrl: 'https://www.youtube.com/watch?v=J0iQf21GBpA',
    type: 'E-book Narrado',
    client: null,
    duration: null,
    coverImage: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
]

// GET - Listar todos os vídeos do YouTube
export async function GET() {
  // Verificar se deve usar dados mockados (modo demonstração ou sem DATABASE_URL)
  const useMockData = process.env.USE_MOCK_DATA === 'true' || !process.env.DATABASE_URL
  
  if (useMockData) {
    console.log('[API] Usando dados mockados para vídeos do YouTube')
    return NextResponse.json(MOCK_VIDEOS)
  }

  try {
    const client = createPrismaClient()
    
    // Se não houver cliente Prisma (modo demonstração), retornar mockados
    if (!client) {
      return NextResponse.json(MOCK_VIDEOS)
    }
    
    const { prisma, pool } = client
    
    // O modelo no Prisma Client é youTubeVideo (camelCase do YouTubeVideo)
    const videos = await prisma.youTubeVideo.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    })
    // Sempre retornar um array, mesmo que vazio
    return NextResponse.json(Array.isArray(videos) ? videos : [])
  } catch (error) {
    console.error('Erro ao buscar vídeos do banco, usando dados mockados:', error)
    // Em caso de erro, retornar dados mockados para não quebrar o frontend
    return NextResponse.json(MOCK_VIDEOS)
  } finally {
    try {
      const client = createPrismaClient()
      if (client) {
        await disconnectPrisma(client.prisma, client.pool)
      }
    } catch (disconnectError) {
      console.error('Erro ao desconectar Prisma:', disconnectError)
    }
  }
}

// POST - Criar novo vídeo do YouTube
export async function POST(request: NextRequest) {
  let prisma: any = null
  let pool: any = null
  
  try {
    console.log('[YouTube POST] Criando PrismaClient...')
    const client = createPrismaClient()
    prisma = client.prisma
    pool = client.pool
    
    if (!prisma) {
      throw new Error('PrismaClient não foi criado corretamente')
    }
    
    const body = await request.json()
    const { title, description, youtubeUrl, type } = body

    if (!title || !description || !youtubeUrl) {
      return NextResponse.json(
        { error: 'Título, descrição e link do YouTube são obrigatórios' },
        { status: 400 }
      )
    }

    // Validar URL do YouTube
    const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+/
    if (!youtubeRegex.test(youtubeUrl)) {
      return NextResponse.json(
        { error: 'URL do YouTube inválida' },
        { status: 400 }
      )
    }

    // O modelo no Prisma Client é youTubeVideo (camelCase do YouTubeVideo)
    const video = await prisma.youTubeVideo.create({
      data: {
        title,
        description,
        youtubeUrl,
        type: type || null,
      },
    })

    return NextResponse.json(video, { status: 201 })
  } catch (error: any) {
    console.error('Erro ao criar vídeo:', error)
    const errorMessage = error?.message || 'Erro ao criar vídeo'
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    )
  } finally {
    if (prisma && pool) {
      try {
        await disconnectPrisma(prisma, pool)
      } catch (disconnectError) {
        console.error('Erro ao desconectar Prisma:', disconnectError)
      }
    }
  }
}
