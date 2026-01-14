import { NextRequest, NextResponse } from 'next/server'
import { createPrismaClient, disconnectPrisma } from '@/lib/prisma'

// GET - Buscar projeto por ID
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
    const project = await prisma.audioProject.findUnique({
      where: { id: params.id },
    })

    if (!project) {
      return NextResponse.json(
        { error: 'Projeto não encontrado' },
        { status: 404 }
      )
    }

    return NextResponse.json(project)
  } catch (error) {
    console.error('Erro ao buscar projeto:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar projeto' },
      { status: 500 }
    )
  } finally {
    await disconnectPrisma(prisma, pool)
  }
}

// PUT - Atualizar projeto
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
    const { title, description, audioUrl, youtubeUrl, type, client, duration, coverImage } = body

    const project = await prisma.audioProject.update({
      where: { id: params.id },
      data: {
        title,
        description,
        audioUrl: audioUrl || null,
        youtubeUrl: youtubeUrl || null,
        type,
        client: client || null,
        duration: duration || null,
        coverImage: coverImage || null,
      },
    })

    return NextResponse.json(project)
  } catch (error) {
    console.error('Erro ao atualizar projeto:', error)
    return NextResponse.json(
      { error: 'Erro ao atualizar projeto' },
      { status: 500 }
    )
  } finally {
    await disconnectPrisma(prisma, pool)
  }
}

// DELETE - Deletar projeto
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
    await prisma.audioProject.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ message: 'Projeto deletado com sucesso' })
  } catch (error) {
    console.error('Erro ao deletar projeto:', error)
    return NextResponse.json(
      { error: 'Erro ao deletar projeto' },
      { status: 500 }
    )
  } finally {
    await disconnectPrisma(prisma, pool)
  }
}
