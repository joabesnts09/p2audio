import { NextRequest, NextResponse } from 'next/server'
import { join } from 'path'
import { existsSync, readFileSync } from 'fs'

// Forçar função dinâmica para evitar bundling de arquivos estáticos
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

// NÃO importar readdir aqui - será importado dinamicamente apenas em desenvolvimento
// Isso evita que o Vercel inclua os arquivos de áudio no bundle

// ID da pasta do Google Drive
const DRIVE_FOLDER_ID = process.env.GOOGLE_DRIVE_FOLDER_ID || '1zyPMkcTQApq3fbZ64RZCeseIPGt40w5w'

/**
 * Mapeamento explícito de arquivos para suas categorias e gêneros
 */
interface FileMapping {
  type: string
  gender: 'Homem' | 'Mulher' | null
}

const FILE_CATEGORY_MAP: Record<string, FileMapping> = {
  // Locução em Espanhol Nativo
  'embratur - visit brasil_espanhol': { type: 'Locução em Espanhol Nativo', gender: 'Mulher' },
  'eurofarma_espanhol': { type: 'Locução em Espanhol Nativo', gender: 'Mulher' },
  'som livre_espanhol': { type: 'Locução em Espanhol Nativo', gender: 'Mulher' },
  
  // Locução em Inglês Nativo
  'accenture - santander_inglês': { type: 'Locução em Inglês Nativo', gender: 'Mulher' },
  'basf': { type: 'Locução em Inglês Nativo', gender: 'Mulher' },
  'britania - inglês': { type: 'Locução em Inglês Nativo', gender: 'Homem' },
  'casa de vídeo - inglês britânico': { type: 'Locução em Inglês Nativo', gender: 'Homem' },
  'colgate_inglês': { type: 'Locução em Inglês Nativo', gender: 'Homem' },
  'dewalt_ingles': { type: 'Locução em Inglês Nativo', gender: 'Homem' },
  'edelman - visit dubai_inglês': { type: 'Locução em Inglês Nativo', gender: 'Mulher' },
  'facebook - ccxp_inglês': { type: 'Locução em Inglês Nativo', gender: 'Mulher' },
  'google plex _inglês': { type: 'Locução em Inglês Nativo', gender: 'Mulher' },
  'johson & johnson': { type: 'Locução em Inglês Nativo', gender: 'Homem' },
  'oracle-inglês': { type: 'Locução em Inglês Nativo', gender: 'Homem' },
  'senai cimatec mar_inglês britanico': { type: 'Locução em Inglês Nativo', gender: 'Homem' },
  'sesi_curso de inglês': { type: 'Locução em Inglês Nativo', gender: 'Homem' },
  
  // Gravação de Locução
  'accenture - suzano': { type: 'Gravação de Locução', gender: 'Mulher' },
  'ajinomoto food services': { type: 'Gravação de Locução', gender: 'Mulher' },
  'albert einstein - endocrinologia': { type: 'Gravação de Locução', gender: 'Homem' },
  'ambev': { type: 'Gravação de Locução', gender: 'Homem' },
  'duracell': { type: 'Gravação de Locução', gender: 'Homem' },
  'gerdau': { type: 'Gravação de Locução', gender: 'Homem' },
  'huggies': { type: 'Gravação de Locução', gender: 'Mulher' },
  'hyundai': { type: 'Gravação de Locução', gender: 'Mulher' },
  'ibis': { type: 'Gravação de Locução', gender: 'Mulher' },
  'masp': { type: 'Gravação de Locução', gender: 'Mulher' },
  'molico': { type: 'Gravação de Locução', gender: 'Homem' },
  'pfizer': { type: 'Gravação de Locução', gender: 'Mulher' },
  'picadilly': { type: 'Gravação de Locução', gender: 'Mulher' },
  'sabesp': { type: 'Gravação de Locução', gender: 'Mulher' },
  'siemens': { type: 'Gravação de Locução', gender: 'Homem' },
  'tnt': { type: 'Gravação de Locução', gender: 'Mulher' },
  'vidara cultural paulista': { type: 'Gravação de Locução', gender: 'Homem' },
  'volks e  accenture': { type: 'Gravação de Locução', gender: 'Mulher' },
  'volvo cars 02': { type: 'Gravação de Locução', gender: 'Mulher' },
  
  // Locução em Alemão
  'linkedin - alemão': { type: 'Locução em Alemão', gender: 'Mulher' },
  
  // Locução em Francês
  'linkedin for non-profits - francês': { type: 'Locução em Francês', gender: 'Mulher' },
  
  // Locução Português Portugal
  'pepsico_português de portugal': { type: 'Locução Português Portugal', gender: 'Mulher' },
  
  // Espera Telefônica (será detectado por padrão se não estiver no mapa)
}

/**
 * Extrai informações do nome do arquivo para determinar tipo, cliente, gênero e título
 */
function parseFileName(fileName: string): { 
  type: string
  client: string
  title: string
  gender: 'Homem' | 'Mulher' | null
} {
  const nameWithoutExt = fileName.replace(/\.(wav|mp3|aif|m4a)$/i, '')
  const normalizedName = nameWithoutExt.toLowerCase().trim()
  
  let type = 'Gravação de Locução'
  let client = ''
  let title = nameWithoutExt
  let gender: 'Homem' | 'Mulher' | null = null
  
  // Normalizar nome removendo acentos para comparação
  const normalizeForMatch = (str: string): string => {
    return str.toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/\s+/g, ' ')
      .trim()
  }
  
  const normalizedForMatch = normalizeForMatch(nameWithoutExt)
  
  // Verificar primeiro no mapeamento explícito (com normalização)
  let foundInMap = false
  for (const [mapKey, mapping] of Object.entries(FILE_CATEGORY_MAP)) {
    const normalizedMapKey = normalizeForMatch(mapKey)
    // Verificar match exato ou se todas as palavras-chave estão presentes
    if (normalizedForMatch === normalizedMapKey || 
        normalizedForMatch.includes(normalizedMapKey) ||
        normalizedMapKey.includes(normalizedForMatch)) {
      type = mapping.type
      // Usar o gênero do mapeamento (prioridade sobre detecção por padrão)
      if (mapping.gender) {
        gender = mapping.gender
      }
      foundInMap = true
      break
    }
  }
  
  // Se não encontrou no mapa, tentar detectar gênero por padrão
  if (!gender) {
    const genderPatterns = [
      { pattern: /mulher|mulher jovem|mulher madura|woman|female|feminina/i, gender: 'Mulher' as const },
      { pattern: /homem|man|male|masculino|masculina|locutor|narrator/i, gender: 'Homem' as const },
      { pattern: /locutora|narradora/i, gender: 'Mulher' as const },
    ]
    
    for (const { pattern, gender: detectedGender } of genderPatterns) {
      if (pattern.test(nameWithoutExt)) {
        gender = detectedGender
        break
      }
    }
  }
  
  // Se não encontrou no mapa, usar padrões
  if (!foundInMap) {
    // Espera Telefônica (verificar primeiro)
    if (/espera telefônica|espera telefonica|ura/i.test(nameWithoutExt)) {
      type = 'Espera Telefônica e URA'
    }
    // Locução em Espanhol Nativo - fallback por padrão
    else if (/espanhol|_espanhol|espanhol_|_es\b|es_/i.test(nameWithoutExt)) {
      type = 'Locução em Espanhol Nativo'
    }
    // Locução em Inglês Nativo - fallback por padrão
    else if (/inglês|ingles|inglés|_inglês|_ingles|_inglés|britânico|britanico|british|_en\b|en_|inglês britanico|inglês britânico/i.test(nameWithoutExt)) {
      type = 'Locução em Inglês Nativo'
    }
    // Locução em Alemão - fallback por padrão
    else if (/alemão|alemao|alemán|_de\b|de_|german/i.test(nameWithoutExt)) {
      type = 'Locução em Alemão'
    }
    // Locução em Francês - fallback por padrão
    else if (/francês|frances|français|_fr\b|fr_|french/i.test(nameWithoutExt)) {
      type = 'Locução em Francês'
    }
    // Locução Português Portugal - fallback por padrão
    else if (/português de portugal|portugues de portugal|português portugal|pt-pt/i.test(nameWithoutExt)) {
      type = 'Locução Português Portugal'
    }
    // Gravação de Locução (padrão para os demais)
    else {
      type = 'Gravação de Locução'
    }
  }
  
  // Extrair cliente e título
  const parts = nameWithoutExt.split(/[-_]/).map(p => p.trim()).filter(p => p)
  
  if (parts.length > 1) {
    client = parts[0]
    // Remover palavras que são idiomas do título
    const titleParts = parts.slice(1).filter(part => {
      const lowerPart = part.toLowerCase()
      const isLanguage = /português|portugues|espanhol|inglês|ingles|alemão|alemao|francês|frances|britânico|britanico|_es|_en|_de|_fr|es_|en_|de_|fr_/i.test(lowerPart)
      return !isLanguage
    })
    
    title = titleParts.join(' - ').trim() || parts.slice(1).join(' - ').trim() || nameWithoutExt
  } else {
    title = nameWithoutExt
  }
  
  return { type, client, title, gender }
}

/**
 * Lista arquivos de áudio da pasta local /public/Portfólio
 * IMPORTANTE: Esta função NUNCA é chamada em produção no Vercel
 * Em produção, sempre usar o JSON estático gerado em build time
 * 
 * Esta função está desabilitada em produção para evitar que o Vercel
 * inclua os arquivos de áudio (503MB) no bundle da função serverless
 */
async function getLocalAudios(): Promise<any[]> {
  // SEMPRE retornar vazio em produção/Vercel para evitar incluir arquivos no bundle
  // O Vercel inclui TODOS os arquivos referenciados no código, mesmo que não sejam executados
  if (process.env.VERCEL || process.env.NODE_ENV === 'production') {
    console.log('[API] Produção: retornando vazio - usar JSON estático')
    return []
  }
  
  // Apenas em desenvolvimento local
  try {
    // Import dinâmico de fs/promises apenas em desenvolvimento
    // Isso evita que o Vercel inclua fs/promises no bundle
    const fsPromises = await import('fs/promises')
    const portfolioPath = join(process.cwd(), 'public', 'Portfólio')
    
    // Verificar se a pasta existe
    if (!existsSync(portfolioPath)) {
      console.log('[API] Pasta Portfólio não encontrada')
      return []
    }
    
    // Ler apenas os nomes dos arquivos (não o conteúdo)
    const files = await fsPromises.readdir(portfolioPath)
    
    // Filtrar apenas arquivos de áudio
    const audioFiles = files.filter((file: string) => 
      /\.(wav|mp3|aif|m4a)$/i.test(file)
    )
    
    // Converter para formato de áudio usando a mesma função parseFileName
    return audioFiles.map((fileName: string, index: number) => {
      const { type, client, title, gender } = parseFileName(fileName)
      
      // URL relativa para arquivo estático (Next.js serve /public como /)
      // Encode para lidar com espaços e caracteres especiais
      const encodedFileName = encodeURIComponent(fileName)
      const audioUrl = `/Portfólio/${encodedFileName}`
      
      // Construir descrição
      const descriptionParts = [type]
      if (client) descriptionParts.push(`Cliente: ${client}`)
      if (gender) descriptionParts.push(`Voz: ${gender}`)
      
      return {
        id: `local-${index}-${fileName.replace(/[^a-zA-Z0-9]/g, '-')}`,
        title: title || fileName,
        description: descriptionParts.join(' - '),
        audioUrl,
        type,
        client: client || undefined,
        gender: gender || undefined,
        duration: undefined,
        coverImage: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
    })
  } catch (error) {
    console.error('[API] Erro ao ler arquivos locais:', error)
    return []
  }
}

/**
 * Busca arquivos do Google Drive usando API Key
 */
async function getDriveAudios(): Promise<any[]> {
  const API_KEY = process.env.GOOGLE_DRIVE_API_KEY
  
  if (!API_KEY) {
    console.log('[API] Google Drive API Key não configurada, usando dados mockados')
    return []
  }
  
  try {
    const url = `https://www.googleapis.com/drive/v3/files?q='${DRIVE_FOLDER_ID}'+in+parents+and+(mimeType+contains+'audio' or name+contains+'.wav' or name+contains+'.mp3' or name+contains+'.aif')&key=${API_KEY}&fields=files(id,name,mimeType,size,webViewLink,webContentLink)&orderBy=name`
    
    const response = await fetch(url, { cache: 'no-store' })
    
    if (!response.ok) {
      console.error('[API] Erro ao buscar do Drive:', response.status)
      return []
    }
    
    const data = await response.json()
    const files = data.files || []
    
    return files.map((file: any, index: number) => {
      const { type, client, title, gender } = parseFileName(file.name)
      
      // Usar proxy interno para streaming de áudio
      // O proxy lida com CORS e headers corretos para reprodução
      // Fallback: se o proxy falhar, tentar link direto do Google Drive
      const audioUrl = `/api/drive-audio/${file.id}`
      const fallbackUrl = file.webContentLink || 
        `https://drive.google.com/uc?export=download&id=${file.id}`
      
      // Construir descrição mais informativa
      const descriptionParts = [type]
      if (client) descriptionParts.push(`Cliente: ${client}`)
      if (gender) descriptionParts.push(`Voz: ${gender}`)
      
      return {
        id: file.id || `drive-${index}`,
        title: title || file.name,
        description: descriptionParts.join(' - '),
        audioUrl,
        fallbackUrl, // URL alternativa caso o proxy falhe
        type,
        client: client || undefined,
        gender: gender || undefined,
        duration: undefined,
        coverImage: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
    })
  } catch (error) {
    console.error('[API] Erro ao buscar do Drive:', error)
    return []
  }
}

// Dados mockados para demonstração - 3 áudios para cada tipo
const MOCK_AUDIOS = [
  // Locução (3 áudios)
  {
    id: 'locucao-1',
    title: 'Locução Institucional 1',
    description: 'Narração profissional para vídeo institucional com voz clara e adequada.',
    audioUrl: '/audio/aud1.mp3',
    type: 'Locução',
    client: 'Cliente Demo',
    gender: 'Homem',
    duration: '02:30',
    coverImage: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'locucao-2',
    title: 'Locução Institucional 2',
    description: 'Narração para treinamento corporativo com tom profissional.',
    audioUrl: '/audio/aud1.mp3',
    type: 'Locução',
    client: 'Cliente Demo',
    duration: '01:45',
    coverImage: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'locucao-3',
    title: 'Locução Institucional 3',
    description: 'Narração para material educacional com voz adequada ao público.',
    audioUrl: '/audio/aud1.mp3',
    type: 'Locução',
    client: 'Cliente Demo',
    duration: '03:15',
    coverImage: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  // Spot Publicitário (3 áudios)
  {
    id: 'spot-1',
    title: 'Spot Publicitário 1',
    description: 'Spot publicitário para rádio com trilha sonora personalizada.',
    audioUrl: '/audio/aud1.mp3',
    type: 'Spot Publicitário',
    client: 'Cliente Demo',
    duration: '00:30',
    coverImage: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'spot-2',
    title: 'Spot Publicitário 2',
    description: 'Spot para TV e mídias digitais com roteiro criativo.',
    audioUrl: '/audio/aud1.mp3',
    type: 'Spot Publicitário',
    client: 'Cliente Demo',
    duration: '00:45',
    coverImage: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'spot-3',
    title: 'Spot Publicitário 3',
    description: 'Spot publicitário de impacto com produção de alta qualidade.',
    audioUrl: '/audio/aud1.mp3',
    type: 'Spot Publicitário',
    client: 'Cliente Demo',
    duration: '01:00',
    coverImage: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  // Produção de Áudio (3 áudios)
  {
    id: 'producao-1',
    title: 'Produção de Áudio 1',
    description: 'Produção de áudio profissional com qualidade superior.',
    audioUrl: '/audio/aud1.mp3',
    type: 'Produção de Áudio',
    client: 'Cliente Demo',
    duration: '02:30',
    coverImage: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'producao-2',
    title: 'Produção de Áudio 2',
    description: 'Produção completa com edição e mixagem profissional.',
    audioUrl: '/audio/aud1.mp3',
    type: 'Produção de Áudio',
    client: 'Cliente Demo',
    duration: '03:20',
    coverImage: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'producao-3',
    title: 'Produção de Áudio 3',
    description: 'Produção de áudio com masterização de alta qualidade.',
    audioUrl: '/audio/aud1.mp3',
    type: 'Produção de Áudio',
    client: 'Cliente Demo',
    duration: '02:15',
    coverImage: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  // Dublagem (3 áudios)
  {
    id: 'dublagem-1',
    title: 'Dublagem 1',
    description: 'Dublagem profissional para vídeo com sincronização perfeita.',
    audioUrl: '/audio/aud1.mp3',
    type: 'Dublagem',
    client: 'Cliente Demo',
    duration: '04:00',
    coverImage: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'dublagem-2',
    title: 'Dublagem 2',
    description: 'Dublagem para animação mantendo naturalidade e expressividade.',
    audioUrl: '/audio/aud1.mp3',
    type: 'Dublagem',
    client: 'Cliente Demo',
    duration: '03:30',
    coverImage: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'dublagem-3',
    title: 'Dublagem 3',
    description: 'Dublagem completa para conteúdo audiovisual.',
    audioUrl: '/audio/aud1.mp3',
    type: 'Dublagem',
    client: 'Cliente Demo',
    duration: '05:15',
    coverImage: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  // Narração (3 áudios)
  {
    id: 'narracao-1',
    title: 'Narração 1',
    description: 'Narração profissional para documentário com voz adequada.',
    audioUrl: '/audio/aud1.mp3',
    type: 'Narração',
    client: 'Cliente Demo',
    duration: '06:00',
    coverImage: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'narracao-2',
    title: 'Narração 2',
    description: 'Narração para conteúdo educacional com tom claro.',
    audioUrl: '/audio/aud1.mp3',
    type: 'Narração',
    client: 'Cliente Demo',
    duration: '04:30',
    coverImage: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'narracao-3',
    title: 'Narração 3',
    description: 'Narração especializada com edição profissional.',
    audioUrl: '/audio/aud1.mp3',
    type: 'Narração',
    client: 'Cliente Demo',
    duration: '05:45',
    coverImage: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  // Podcast (3 áudios)
  {
    id: 'podcast-1',
    title: 'Podcast 1',
    description: 'Episódio de podcast com produção completa e qualidade profissional.',
    audioUrl: '/audio/aud1.mp3',
    type: 'Podcast',
    client: 'Cliente Demo',
    duration: '30:00',
    coverImage: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'podcast-2',
    title: 'Podcast 2',
    description: 'Podcast com edição e mixagem profissional.',
    audioUrl: '/audio/aud1.mp3',
    type: 'Podcast',
    client: 'Cliente Demo',
    duration: '25:30',
    coverImage: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'podcast-3',
    title: 'Podcast 3',
    description: 'Episódio de podcast com trilha sonora e efeitos.',
    audioUrl: '/audio/aud1.mp3',
    type: 'Podcast',
    client: 'Cliente Demo',
    duration: '35:15',
    coverImage: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  // E-book Narrado (3 áudios)
  {
    id: 'ebook-1',
    title: 'E-book Narrado 1',
    description: 'E-book narrado com voz profissional e edição de alta qualidade.',
    audioUrl: '/audio/aud1.mp3',
    type: 'E-book Narrado',
    client: 'Cliente Demo',
    duration: '45:00',
    coverImage: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'ebook-2',
    title: 'E-book Narrado 2',
    description: 'Audiolivro completo com narração envolvente.',
    audioUrl: '/audio/aud1.mp3',
    type: 'E-book Narrado',
    client: 'Cliente Demo',
    duration: '50:30',
    coverImage: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'ebook-3',
    title: 'E-book Narrado 3',
    description: 'E-book narrado com produção profissional e qualidade superior.',
    audioUrl: '/audio/aud1.mp3',
    type: 'E-book Narrado',
    client: 'Cliente Demo',
    duration: '40:15',
    coverImage: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
]

// GET - Listar todos os áudios (prioridade: JSON estático > Drive > mockados)
// IMPORTANTE: Em produção/Vercel, NUNCA ler arquivos locais para evitar exceder limite de 300MB
export async function GET() {
  try {
    // 1. Tentar carregar do JSON estático gerado em build time (OBRIGATÓRIO no Vercel)
    // Tentativa 1: Ler do filesystem (funciona em desenvolvimento e build)
    try {
      const jsonPath = join(process.cwd(), 'public', 'data', 'audio-projects.json')
      
      if (existsSync(jsonPath)) {
        const jsonData = readFileSync(jsonPath, 'utf-8')
        const staticAudios = JSON.parse(jsonData)
        
        if (staticAudios && Array.isArray(staticAudios) && staticAudios.length > 0) {
          console.log(`[API] ✅ Carregados ${staticAudios.length} áudios do JSON estático (filesystem)`)
          return NextResponse.json(staticAudios)
        }
      }
    } catch (fsError: any) {
      console.log(`[API] ⚠️ Erro ao ler JSON do filesystem: ${fsError?.message}`)
    }
    
    // Tentativa 2: Fazer fetch do arquivo estático (funciona no Vercel em runtime)
    try {
      // No Vercel, tentar buscar o arquivo estático via URL
      const baseUrl = process.env.VERCEL_URL 
        ? `https://${process.env.VERCEL_URL}` 
        : process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
      
      const jsonUrl = `${baseUrl}/data/audio-projects.json`
      const response = await fetch(jsonUrl, { 
        cache: 'no-store',
        headers: {
          'Accept': 'application/json'
        }
      })
      
      if (response.ok) {
        const staticAudios = await response.json()
        
        if (staticAudios && Array.isArray(staticAudios) && staticAudios.length > 0) {
          console.log(`[API] ✅ Carregados ${staticAudios.length} áudios do JSON estático (fetch)`)
          return NextResponse.json(staticAudios)
        }
      }
    } catch (fetchError: any) {
      console.log(`[API] ⚠️ Erro ao fazer fetch do JSON: ${fetchError?.message}`)
    }
    
    // 2. Em produção/Vercel, NÃO tentar ler arquivos locais (evita exceder limite de 300MB)
    // Apenas em desenvolvimento local, tentar ler arquivos
    if (!process.env.VERCEL && process.env.NODE_ENV !== 'production') {
      const localAudios = await getLocalAudios()
      
      if (localAudios.length > 0) {
        console.log(`[API] Carregados ${localAudios.length} áudios da pasta local`)
        return NextResponse.json(localAudios)
      }
    }
    
    // 3. Tentar buscar do Google Drive (fallback)
    const driveAudios = await getDriveAudios()
    
    if (driveAudios.length > 0) {
      console.log(`[API] Carregados ${driveAudios.length} áudios do Google Drive`)
      return NextResponse.json(driveAudios)
    }
    
    // 4. Se não conseguir de nenhum lugar, usar dados mockados
    console.log('[API] ⚠️ Usando dados mockados para áudios (nenhuma fonte disponível)')
    return NextResponse.json(MOCK_AUDIOS)
  } catch (error: any) {
    console.error('[API] ❌ Erro ao buscar áudios:', error?.message || error)
    // Em caso de erro, retornar dados mockados
    return NextResponse.json(MOCK_AUDIOS)
  }
}

// POST - Criar novo áudio (não disponível em modo demonstração)
export async function POST(request: NextRequest) {
  return NextResponse.json(
    { error: 'Criação de áudios não disponível em modo demonstração' },
    { status: 501 }
  )
}
