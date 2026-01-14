import { NextRequest, NextResponse } from 'next/server'
import { createPrismaClient, disconnectPrisma } from '@/lib/prisma'

// GET - Buscar áudio por ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const client = createPrismaClient()
  
  if (!client) {
    return NextResponse.json(
      { error: 'Banco de dados não configurado' },
      { status: 503 }
    )
  }
  
  const { prisma, pool } = client
  
  try {
    const audio = await prisma.audio.findUnique({
      where: { id: params.id },
    })

    if (!audio) {
      return NextResponse.json(
        { error: 'Áudio não encontrado' },
        { status: 404 }
      )
    }

    return NextResponse.json(audio)
  } catch (error) {
    console.error('Erro ao buscar áudio:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar áudio' },
      { status: 500 }
    )
  } finally {
    await disconnectPrisma(prisma, pool)
  }
}

// PUT - Atualizar áudio
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const audio = await prisma.audio.update({
      where: { id: params.id },
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

    return NextResponse.json(audio)
  } catch (error) {
    console.error('Erro ao atualizar áudio:', error)
    return NextResponse.json(
      { error: 'Erro ao atualizar áudio' },
      { status: 500 }
    )
  } finally {
    await disconnectPrisma(prisma, pool)
  }
}

// DELETE - Deletar áudio
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const client = createPrismaClient()
  
  if (!client) {
    return NextResponse.json(
      { error: 'Banco de dados não configurado' },
      { status: 503 }
    )
  }
  
  const { prisma, pool } = client
  
  try {
    await prisma.audio.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ message: 'Áudio deletado com sucesso' })
  } catch (error) {
    console.error('Erro ao deletar áudio:', error)
    return NextResponse.json(
      { error: 'Erro ao deletar áudio' },
      { status: 500 }
    )
  } finally {
    await disconnectPrisma(prisma, pool)
  }
}
