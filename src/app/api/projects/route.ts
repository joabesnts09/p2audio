import { NextRequest, NextResponse } from 'next/server'
import { createPrismaClient, disconnectPrisma } from '@/lib/prisma'

// GET - Listar todos os projetos
export async function GET() {
  const { prisma, pool } = createPrismaClient()
  
  try {
    const projects = await prisma.audioProject.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    })
    return NextResponse.json(projects)
  } catch (error) {
    console.error('Erro ao buscar projetos:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar projetos' },
      { status: 500 }
    )
  } finally {
    await disconnectPrisma(prisma, pool)
  }
}

// POST - Criar novo projeto
export async function POST(request: NextRequest) {
  const { prisma, pool } = createPrismaClient()
  
  try {
    const body = await request.json()
    const { title, description, audioUrl, youtubeUrl, type, client, duration, coverImage } = body

    if (!title || !description || !type) {
      return NextResponse.json(
        { error: 'Título, descrição e tipo são obrigatórios' },
        { status: 400 }
      )
    }

    const project = await prisma.audioProject.create({
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

    return NextResponse.json(project, { status: 201 })
  } catch (error) {
    console.error('Erro ao criar projeto:', error)
    return NextResponse.json(
      { error: 'Erro ao criar projeto' },
      { status: 500 }
    )
  } finally {
    await disconnectPrisma(prisma, pool)
  }
}
