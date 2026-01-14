import { NextRequest, NextResponse } from 'next/server'

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

// GET - Buscar vídeo por ID (apenas dados mockados)
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const video = MOCK_VIDEOS.find(v => v.id === params.id)
  
  if (!video) {
    return NextResponse.json(
      { error: 'Vídeo não encontrado' },
      { status: 404 }
    )
  }

  return NextResponse.json(video)
}

// PUT - Atualizar vídeo (não disponível em modo demonstração)
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return NextResponse.json(
    { error: 'Atualização de vídeos não disponível em modo demonstração' },
    { status: 501 }
  )
}

// DELETE - Deletar vídeo (não disponível em modo demonstração)
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return NextResponse.json(
    { error: 'Exclusão de vídeos não disponível em modo demonstração' },
    { status: 501 }
  )
}
