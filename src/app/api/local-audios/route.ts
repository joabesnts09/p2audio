import { NextRequest, NextResponse } from 'next/server'
import { readdir } from 'fs/promises'
import { join } from 'path'
import { existsSync } from 'fs'

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
  
  let type = 'Locução'
  let client = ''
  let title = nameWithoutExt
  let gender: 'Homem' | 'Mulher' | null = null
  
  // Detectar gênero primeiro
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
  
  // Detectar tipo de serviço
  const typePatterns = [
    { pattern: /espera telefônica|espera telefonica|ura/i, type: 'Espera Telefônica e URA' },
    { pattern: /spot|comercial/i, type: 'Spot Publicitário' },
    { pattern: /dublagem|dubbing/i, type: 'Dublagem' },
    { pattern: /e-learning|ebook|e-book|audiolivro/i, type: 'E-learning e E-book' },
    { pattern: /narração|narracao|narration/i, type: 'Narração' },
    { pattern: /podcast/i, type: 'Podcast' },
    { pattern: /locução|locucao|voiceover|locutor|locutora/i, type: 'Locução' },
    { pattern: /produção|producao|production/i, type: 'Produção de Áudio' },
    { pattern: /tradução|traducao|translation/i, type: 'Revisão e Tradução de Texto' },
  ]
  
  for (const { pattern, type: detectedType } of typePatterns) {
    if (pattern.test(nameWithoutExt)) {
      type = detectedType
      break
    }
  }
  
  // Extrair cliente e título
  const parts = nameWithoutExt.split(/[-_]/).map(p => p.trim()).filter(p => p)
  
  if (parts.length > 1) {
    client = parts[0]
    const titleParts = parts.slice(1).filter(part => {
      const lowerPart = part.toLowerCase()
      const isType = typePatterns.some(tp => tp.pattern.test(part))
      const isGender = genderPatterns.some(gp => gp.pattern.test(part))
      const isLanguage = /português|portugues|espanhol|inglês|ingles|en_uk|pt|es|en/i.test(lowerPart)
      return !isType && !isGender && !isLanguage
    })
    
    title = titleParts.join(' - ').trim() || parts.slice(1).join(' - ').trim() || nameWithoutExt
  }
  
  return { type, client, title, gender }
}

/**
 * Lista arquivos de áudio da pasta local /public/Portfólio
 */
async function getLocalAudios(): Promise<any[]> {
  try {
    const portfolioPath = join(process.cwd(), 'public', 'Portfólio')
    
    // Verificar se a pasta existe
    if (!existsSync(portfolioPath)) {
      console.log('[API] Pasta Portfólio não encontrada')
      return []
    }
    
    // Ler arquivos da pasta
    const files = await readdir(portfolioPath)
    
    // Filtrar apenas arquivos de áudio
    const audioFiles = files.filter(file => 
      /\.(wav|mp3|aif|m4a)$/i.test(file)
    )
    
    // Converter para formato de áudio
    return audioFiles.map((fileName, index) => {
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
        id: `local-${index}-${fileName}`,
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

export async function GET(request: NextRequest) {
  try {
    // Buscar áudios locais primeiro
    const localAudios = await getLocalAudios()
    
    if (localAudios.length > 0) {
      console.log(`[API] Carregados ${localAudios.length} áudios da pasta local`)
      return NextResponse.json(localAudios)
    }
    
    // Se não houver arquivos locais, retornar vazio (ou tentar Google Drive como fallback)
    console.log('[API] Nenhum áudio local encontrado')
    return NextResponse.json([])
  } catch (error: any) {
    console.error('[API] Erro ao buscar áudios locais:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar áudios', message: error?.message },
      { status: 500 }
    )
  }
}
