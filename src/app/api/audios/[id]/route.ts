import { NextRequest, NextResponse } from 'next/server'

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

// GET - Buscar áudio por ID (apenas dados mockados)
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const audio = MOCK_AUDIOS.find(a => a.id === params.id)
  
  if (!audio) {
    return NextResponse.json(
      { error: 'Áudio não encontrado' },
      { status: 404 }
    )
  }

  return NextResponse.json(audio)
}

// PUT - Atualizar áudio (não disponível em modo demonstração)
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return NextResponse.json(
    { error: 'Atualização de áudios não disponível em modo demonstração' },
    { status: 501 }
  )
}

// DELETE - Deletar áudio (não disponível em modo demonstração)
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return NextResponse.json(
    { error: 'Exclusão de áudios não disponível em modo demonstração' },
    { status: 501 }
  )
}
