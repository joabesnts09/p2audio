import { NextRequest, NextResponse } from 'next/server'
import { createPrismaClient, disconnectPrisma } from '@/lib/prisma'

// GET - Buscar vídeo por ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { prisma, pool } = createPrismaClient()
  
  try {
    // O modelo no Prisma Client é youTubeVideo (camelCase do YouTubeVideo)
    const video = await prisma.youTubeVideo.findUnique({
      where: { id: params.id },
    })

    if (!video) {
      return NextResponse.json(
        { error: 'Vídeo não encontrado' },
        { status: 404 }
      )
    }

    return NextResponse.json(video)
  } catch (error) {
    console.error('Erro ao buscar vídeo:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar vídeo' },
      { status: 500 }
    )
  } finally {
    await disconnectPrisma(prisma, pool)
  }
}

// PUT - Atualizar vídeo
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { prisma, pool } = createPrismaClient()
  
  try {
    const body = await request.json()
    const { title, description, youtubeUrl, type } = body

    // Validar URL do YouTube se fornecida
    if (youtubeUrl) {
      const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+/
      if (!youtubeRegex.test(youtubeUrl)) {
        return NextResponse.json(
          { error: 'URL do YouTube inválida' },
          { status: 400 }
        )
      }
    }

    // O modelo no Prisma Client é youTubeVideo (camelCase do YouTubeVideo)
    const video = await prisma.youTubeVideo.update({
      where: { id: params.id },
      data: {
        title,
        description,
        youtubeUrl,
        type: type || null,
      },
    })

    return NextResponse.json(video)
  } catch (error) {
    console.error('Erro ao atualizar vídeo:', error)
    return NextResponse.json(
      { error: 'Erro ao atualizar vídeo' },
      { status: 500 }
    )
  } finally {
    await disconnectPrisma(prisma, pool)
  }
}

// DELETE - Deletar vídeo
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { prisma, pool } = createPrismaClient()
  
  try {
    // O modelo no Prisma Client é youTubeVideo (camelCase do YouTubeVideo)
    await prisma.youTubeVideo.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ message: 'Vídeo deletado com sucesso' })
  } catch (error) {
    console.error('Erro ao deletar vídeo:', error)
    return NextResponse.json(
      { error: 'Erro ao deletar vídeo' },
      { status: 500 }
    )
  } finally {
    await disconnectPrisma(prisma, pool)
  }
}
