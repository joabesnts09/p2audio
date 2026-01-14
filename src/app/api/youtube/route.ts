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

// GET - Listar todos os vídeos do YouTube (apenas dados mockados)
export async function GET() {
  console.log('[API] Usando dados mockados para vídeos do YouTube')
  return NextResponse.json(MOCK_VIDEOS)
}

// POST - Criar novo vídeo do YouTube (não disponível em modo demonstração)
export async function POST(request: NextRequest) {
  return NextResponse.json(
    { error: 'Criação de vídeos não disponível em modo demonstração' },
    { status: 501 }
  )
}
