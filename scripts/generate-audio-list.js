/**
 * Script para gerar lista de áudios em build time
 * Execute: node scripts/generate-audio-list.js
 */
const { readdir } = require('fs/promises')
const { join } = require('path')
const { existsSync } = require('fs')
const { writeFileSync } = require('fs')

// Função para normalizar strings (mesma lógica do route.ts)
function normalizeForMatch(str) {
  return str.toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
}

// Mapeamento de arquivos (mesmo do route.ts)
const FILE_CATEGORY_MAP = {
  'embratur - visit brasil_espanhol': { type: 'Locução em Espanhol Nativo', gender: 'Mulher' },
  'eurofarma_espanhol': { type: 'Locução em Espanhol Nativo', gender: 'Mulher' },
  'som livre_espanhol': { type: 'Locução em Espanhol Nativo', gender: 'Mulher' },
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
  'linkedin - alemão': { type: 'Locução em Alemão', gender: 'Mulher' },
  'linkedin for non-profits - francês': { type: 'Locução em Francês', gender: 'Mulher' },
  'pepsico_português de portugal': { type: 'Locução Português Portugal', gender: 'Mulher' },
}

function parseFileName(fileName) {
  // Remover "_compressed" do nome para processamento, mas manter no arquivo original
  const nameWithoutCompressed = fileName.replace(/_compressed/gi, '')
  const nameWithoutExt = nameWithoutCompressed.replace(/\.(wav|mp3|aif|m4a)$/i, '')
  const normalizedName = nameWithoutExt.toLowerCase().trim()
  
  let type = 'Gravação de Locução'
  let client = ''
  let title = nameWithoutExt
  let gender = null
  
  const normalizeForMatch = (str) => {
    return str.toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/\s+/g, ' ')
      .trim()
  }
  
  const normalizedForMatch = normalizeForMatch(nameWithoutExt)
  
  let foundInMap = false
  for (const [mapKey, mapping] of Object.entries(FILE_CATEGORY_MAP)) {
    const normalizedMapKey = normalizeForMatch(mapKey)
    if (normalizedForMatch === normalizedMapKey || 
        normalizedForMatch.includes(normalizedMapKey) ||
        normalizedMapKey.includes(normalizedForMatch)) {
      type = mapping.type
      if (mapping.gender) {
        gender = mapping.gender
      }
      foundInMap = true
      break
    }
  }
  
  if (!foundInMap) {
    if (/espera telefônica|espera telefonica|ura/i.test(nameWithoutExt)) {
      type = 'Espera Telefônica e URA'
    } else if (/espanhol|_espanhol|espanhol_|_es\b|es_/i.test(nameWithoutExt)) {
      type = 'Locução em Espanhol Nativo'
    } else if (/inglês|ingles|inglés|_inglês|_ingles|_inglés|britânico|britanico|british|_en\b|en_|inglês britanico|inglês britânico/i.test(nameWithoutExt)) {
      type = 'Locução em Inglês Nativo'
    } else if (/alemão|alemao|alemán|_de\b|de_|german/i.test(nameWithoutExt)) {
      type = 'Locução em Alemão'
    } else if (/francês|frances|français|_fr\b|fr_|french/i.test(nameWithoutExt)) {
      type = 'Locução em Francês'
    } else if (/português de portugal|portugues de portugal|português portugal|pt-pt/i.test(nameWithoutExt)) {
      type = 'Locução Português Portugal'
    }
  }
  
  const parts = nameWithoutExt.split(/[-_]/).map(p => p.trim()).filter(p => p)
  
  if (parts.length > 1) {
    client = parts[0]
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

async function generateAudioList() {
  try {
    const portfolioPath = join(process.cwd(), 'public', 'Portfólio')
    
    if (!existsSync(portfolioPath)) {
      console.log('Pasta Portfólio não encontrada')
      return []
    }
    
    const files = await readdir(portfolioPath)
    const audioFiles = files.filter(file => 
      /\.(wav|mp3|aif|m4a)$/i.test(file)
    )
    
    const audios = audioFiles.map((fileName, index) => {
      // Remover "_compressed" para processamento do nome
      const nameForProcessing = fileName.replace(/_compressed/gi, '')
      const { type, client, title, gender } = parseFileName(fileName)
      
      // Manter o nome original do arquivo na URL (com _compressed se existir)
      const encodedFileName = encodeURIComponent(fileName)
      const audioUrl = `/Portfólio/${encodedFileName}`
      
      const descriptionParts = [type]
      if (client) descriptionParts.push(`Cliente: ${client}`)
      if (gender) descriptionParts.push(`Voz: ${gender}`)
      
      // Usar título sem "_compressed" para exibição
      const displayTitle = title || nameForProcessing.replace(/\.(wav|mp3|aif|m4a)$/i, '')
      
      return {
        id: `local-${index}-${nameForProcessing.replace(/[^a-zA-Z0-9]/g, '-')}`,
        title: displayTitle,
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
    
    // Salvar em arquivo JSON
    const outputPath = join(process.cwd(), 'public', 'data', 'audio-projects.json')
    writeFileSync(outputPath, JSON.stringify(audios, null, 2), 'utf-8')
    
    console.log(`✅ Gerado arquivo com ${audios.length} áudios: ${outputPath}`)
    return audios
  } catch (error) {
    console.error('Erro ao gerar lista de áudios:', error)
    return []
  }
}

generateAudioList()
