import { NextRequest, NextResponse } from 'next/server'

// Forçar função dinâmica para evitar pré-renderização estática
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

// IDs dos vídeos do YouTube
const YOUTUBE_VIDEOS = [
  {
    id: 'sR9mcz_Ujto',
    type: 'Produção de Áudio',
  },
  {
    id: 'w4p6ufUr7yk',
    type: 'Spot Publicitário',
  },
  {
    id: 'J0iQf21GBpA',
    type: 'E-book Narrado',
  },
  {
    id: 'Hnj9Iku7VAk',
    type: 'Produção de Áudio',
  },
  {
    id: 'IRT2eL-U9n4',
    type: 'Produção de Áudio',
  },
  {
    id: 'Ylwc56kYmTU',
    type: 'Produção de Áudio',
  },
]

/**
 * Extrai o ID do vídeo de uma URL do YouTube
 */
function extractYouTubeId(url: string): string | null {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/
  const match = url.match(regExp)
  return match && match[2].length === 11 ? match[2] : null
}

/**
 * Busca metadados de um vídeo do YouTube usando oEmbed API
 */
async function fetchYouTubeMetadata(videoId: string): Promise<{ title: string; description: string } | null> {
  try {
    const oEmbedUrl = `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`
    const response = await fetch(oEmbedUrl, { cache: 'no-store' })
    
    if (!response.ok) {
      console.error(`[API] Erro ao buscar metadados do vídeo ${videoId}:`, response.status)
      return null
    }
    
    const data = await response.json()
    return {
      title: data.title || '',
      description: data.author_name ? `Vídeo de ${data.author_name}` : 'Vídeo do YouTube',
    }
  } catch (error) {
    console.error(`[API] Erro ao buscar metadados do vídeo ${videoId}:`, error)
    return null
  }
}

// GET - Listar todos os vídeos do YouTube com títulos reais
export async function GET() {
  try {
    const videos = await Promise.all(
      YOUTUBE_VIDEOS.map(async (video) => {
        const youtubeUrl = `https://www.youtube.com/watch?v=${video.id}`
        
        // Buscar metadados reais do YouTube
        const metadata = await fetchYouTubeMetadata(video.id)
        
        return {
          id: `youtube-${video.id}`,
          title: metadata?.title || `Vídeo ${video.id}`,
          description: metadata?.description || 'Projeto de produção de áudio profissional.',
          youtubeUrl,
          type: video.type,
          client: null,
          duration: null,
          coverImage: null,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }
      })
    )
    
    console.log(`[API] Carregados ${videos.length} vídeos do YouTube com títulos reais`)
    return NextResponse.json(videos)
  } catch (error) {
    console.error('[API] Erro ao buscar vídeos do YouTube:', error)
    // Em caso de erro, retornar dados básicos
    const fallbackVideos = YOUTUBE_VIDEOS.map((video) => ({
      id: `youtube-${video.id}`,
      title: `Vídeo ${video.id}`,
      description: 'Projeto de produção de áudio profissional.',
      youtubeUrl: `https://www.youtube.com/watch?v=${video.id}`,
      type: video.type,
      client: null,
      duration: null,
      coverImage: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }))
    return NextResponse.json(fallbackVideos)
  }
}

// POST - Criar novo vídeo do YouTube (não disponível em modo demonstração)
export async function POST(request: NextRequest) {
  return NextResponse.json(
    { error: 'Criação de vídeos não disponível em modo demonstração' },
    { status: 501 }
  )
}
