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

// Mapeamento de arquivos com tipo e gênero
// Baseado na lista fornecida: M = Mulher, H = Homem
const FILE_CATEGORY_MAP = {
  // Locução em Espanhol Nativo - Todos Mulher (M)
  'embratur - visit brasil_espanhol': { type: 'Locução em Espanhol Nativo', gender: 'Mulher' },
  'embratur': { type: 'Locução em Espanhol Nativo', gender: 'Mulher' }, // Para arquivos Embratur com ES
  'eurofarma_espanhol': { type: 'Locução em Espanhol Nativo', gender: 'Mulher' },
  'eurofarma': { type: 'Locução em Espanhol Nativo', gender: 'Mulher' },
  'som livre_espanhol': { type: 'Locução em Espanhol Nativo', gender: 'Mulher' },
  'som livre': { type: 'Locução em Espanhol Nativo', gender: 'Mulher' },
  
  // Locução em Inglês Nativo
  'accenture - santander': { type: 'Locução em Inglês Nativo', gender: 'Mulher' },
  'accenture - santander_inglês': { type: 'Locução em Inglês Nativo', gender: 'Mulher' },
  'basf': { type: 'Locução em Inglês Nativo', gender: 'Mulher' },
  'braskem': { type: 'Locução em Inglês Nativo', gender: 'Homem' },
  'britania - en': { type: 'Locução em Inglês Nativo', gender: 'Homem' },
  'britania - inglês': { type: 'Locução em Inglês Nativo', gender: 'Homem' },
  'britania': { type: 'Locução em Inglês Nativo', gender: 'Homem' },
  'casa de vídeo': { type: 'Locução em Inglês Nativo', gender: 'Homem' },
  'casa de vídeo - inglês britânico': { type: 'Locução em Inglês Nativo', gender: 'Homem' },
  'colgate_inglês': { type: 'Locução em Inglês Nativo', gender: 'Homem' },
  'colgate': { type: 'Locução em Inglês Nativo', gender: 'Homem' },
  'dewalt_ingles': { type: 'Locução em Inglês Nativo', gender: 'Homem' },
  'dewalt': { type: 'Locução em Inglês Nativo', gender: 'Homem' },
  'edelman - visit dubai_inglês': { type: 'Locução em Inglês Nativo', gender: 'Homem' },
  'edelman': { type: 'Locução em Inglês Nativo', gender: 'Homem' },
  'facebook - ccxp_inglês': { type: 'Locução em Inglês Nativo', gender: 'Mulher' },
  'facebook': { type: 'Locução em Inglês Nativo', gender: 'Mulher' },
  'google plex _inglês': { type: 'Locução em Inglês Nativo', gender: 'Mulher' },
  'google plex': { type: 'Locução em Inglês Nativo', gender: 'Mulher' },
  'google': { type: 'Locução em Inglês Nativo', gender: 'Mulher' },
  'johson & johnson': { type: 'Locução em Inglês Nativo', gender: 'Homem' },
  'johson': { type: 'Locução em Inglês Nativo', gender: 'Homem' },
  'oracle - en': { type: 'Locução em Inglês Nativo', gender: 'Homem' },
  'oracle-inglês': { type: 'Locução em Inglês Nativo', gender: 'Homem' },
  'oracle': { type: 'Locução em Inglês Nativo', gender: 'Homem' },
  'senai cimatec mar_inglês britanico': { type: 'Locução em Inglês Nativo', gender: 'Homem' },
  'senai': { type: 'Locução em Inglês Nativo', gender: 'Homem' },
  'sesi_curso de inglês': { type: 'Locução em Inglês Nativo', gender: 'Homem' },
  'sesi': { type: 'Locução em Inglês Nativo', gender: 'Homem' },
  'mov locadora - deloitte transformando a saúde no brasil - en': { type: 'Locução em Inglês Nativo', gender: 'Mulher' },
  'deloitte transformando a saúde no brasil - en': { type: 'Locução em Inglês Nativo', gender: 'Mulher' },
  'deloitte transformando a saúde no brasil': { type: 'Locução em Inglês Nativo', gender: 'Mulher' },
  'deloitte': { type: 'Locução em Inglês Nativo', gender: 'Mulher' },
  'mov locadora': { type: 'Locução em Inglês Nativo', gender: 'Mulher' },
  
  // Gravação de Locução
  'accenture - suzano': { type: 'Gravação de Locução', gender: 'Mulher' },
  'ajinomoto food services': { type: 'Gravação de Locução', gender: 'Mulher' },
  'ajinomoto': { type: 'Gravação de Locução', gender: 'Mulher' },
  'albert einstein - endocrinologia': { type: 'Gravação de Locução', gender: 'Homem' },
  'albert einstein': { type: 'Gravação de Locução', gender: 'Homem' },
  'einstein': { type: 'Gravação de Locução', gender: 'Homem' },
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
  'vidara': { type: 'Gravação de Locução', gender: 'Homem' },
  'volks e  accenture': { type: 'Gravação de Locução', gender: 'Mulher' },
  'volks': { type: 'Gravação de Locução', gender: 'Mulher' },
  'volvo cars 02': { type: 'Gravação de Locução', gender: 'Mulher' },
  'volvo': { type: 'Gravação de Locução', gender: 'Mulher' },
  'achè': { type: 'Gravação de Locução', gender: 'Homem' },
  'ache': { type: 'Gravação de Locução', gender: 'Homem' },
  'graphis - achè': { type: 'Gravação de Locução', gender: 'Homem' },
  'graphis': { type: 'Gravação de Locução', gender: 'Homem' },
  'complexo portuário da bahia da babitonga': { type: 'Gravação de Locução', gender: 'Mulher' },
  'complexo portuário': { type: 'Gravação de Locução', gender: 'Mulher' },
  'pt': { type: 'Gravação de Locução', gender: 'Mulher' },
  'campanha 2024': { type: 'Gravação de Locução', gender: 'Mulher' },
  'pucpr': { type: 'Gravação de Locução', gender: 'Mulher' },
  'cana de açúcar': { type: 'Gravação de Locução', gender: 'Homem' },
  'cana de acucar': { type: 'Gravação de Locução', gender: 'Homem' },
  'mulher madura': { type: 'Gravação de Locução', gender: 'Mulher' },
  'liz manifesto - mulher madura': { type: 'Gravação de Locução', gender: 'Mulher' },
  
  // Locução em Alemão
  'linkedin - alemão': { type: 'Locução em Alemão', gender: 'Mulher' },
  'studio 750 - linkedin - alemão': { type: 'Locução em Alemão', gender: 'Mulher' },
  
  // Locução em Francês - Linkedin for Non-Profits
  'linkedin for non-profits - francês': { type: 'Locução em Francês', gender: 'Mulher' },
  'linkedin for non - profits': { type: 'Locução em Francês', gender: 'Mulher' },
  'studio 750 - linkedin for non-profits - francês': { type: 'Locução em Francês', gender: 'Mulher' },
  
  // Locução em Espanhol Nativo - Linkedin for Non-Profits e J&J
  'casa de vídeo - j&j_apertura up to date - fev 2025-esp': { type: 'Locução em Espanhol Nativo', gender: 'Homem' },
  'casa de vídeo - j&j': { type: 'Locução em Espanhol Nativo', gender: 'Homem' },
  'j&j_apertura up to date - fev 2025-esp': { type: 'Locução em Espanhol Nativo', gender: 'Homem' },
  'j&j - apertura up to date - fev 2025 - esp': { type: 'Locução em Espanhol Nativo', gender: 'Homem' },
  'studio 750 - linkedin for non-profits - espanhol': { type: 'Locução em Espanhol Nativo', gender: 'Mulher' },
  'linkedin for non-profits - espanhol': { type: 'Locução em Espanhol Nativo', gender: 'Mulher' },
  'linkedin for non - profits - espanhol': { type: 'Locução em Espanhol Nativo', gender: 'Mulher' },
  
  // Locução em Inglês Nativo - LinkedIn for Nonprofits
  'studio 750 - linkedin for nonprofits - inglês': { type: 'Locução em Inglês Nativo', gender: 'Mulher' },
  'linkedin for nonprofits - inglês': { type: 'Locução em Inglês Nativo', gender: 'Mulher' },
  
  // Locução em Francês - Linkedin for Non-Profits
  'studio 750 - linkedin for non-profits - francês': { type: 'Locução em Francês', gender: 'Mulher' },
  'linkedin for non-profits - francês': { type: 'Locução em Francês', gender: 'Mulher' },
  
  // Gravação de Locução - Linkedin (português)
  'studio 750 - linkedin - português': { type: 'Gravação de Locução', gender: 'Mulher' },
  'linkedin - português': { type: 'Gravação de Locução', gender: 'Mulher' },
  
  // Locução Português Portugal
  'pepsico_português de portugal': { type: 'Locução Português Portugal', gender: 'Mulher' },
  'pepsico': { type: 'Locução Português Portugal', gender: 'Mulher' },
  
  // Espera Telefônica e URA
  'espera telefônica p&g': { type: 'Espera Telefônica e URA', gender: 'Homem' },
  'foundever - espera telefônica p&g': { type: 'Espera Telefônica e URA', gender: 'Homem' },
  'espera telefônica': { type: 'Espera Telefônica e URA', gender: 'Homem' },
  'atala engenharia_ espera telefônica': { type: 'Espera Telefônica e URA', gender: 'Homem' },
  
  // Locução em Espanhol Nativo - arquivos adicionais
  'casa de vídeo - j&j': { type: 'Locução em Espanhol Nativo', gender: 'Homem' },
  'vediplast - es': { type: 'Locução em Espanhol Nativo', gender: 'Homem' },
  'vediplast': { type: 'Locução em Espanhol Nativo', gender: 'Homem' },
  
  // Gravação de Locução - adicionais encontrados (sem gênero na lista fornecida)
  'gaau': { type: 'Gravação de Locução', gender: null },
  'graphis': { type: 'Gravação de Locução', gender: null },
  'hoop': { type: 'Gravação de Locução', gender: null },
  'liz manifesto': { type: 'Gravação de Locução', gender: null },
  'mov locadora': { type: 'Gravação de Locução', gender: null },
  'movietwo': { type: 'Gravação de Locução', gender: null },
  'pucpr': { type: 'Gravação de Locução', gender: null },
  'uau hub': { type: 'Gravação de Locução', gender: null },
  'unica': { type: 'Gravação de Locução', gender: null },
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
  // Ordenar o mapeamento para verificar entradas mais específicas primeiro
  const sortedEntries = Object.entries(FILE_CATEGORY_MAP).sort((a, b) => {
    // Entradas mais longas (específicas) primeiro
    return b[0].length - a[0].length
  })
  
  for (const [mapKey, mapping] of sortedEntries) {
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
    // Verificar indicadores de idioma no nome (prioridade)
    // Verificar espanhol primeiro (pode ter "esp" que não é "es" completo)
    if (/espanhol|_espanhol|espanhol_|_es\b|es_|esp\b|_esp/i.test(nameWithoutExt)) {
      type = 'Locução em Espanhol Nativo'
    } else if (/inglês|ingles|inglés|_inglês|_ingles|_inglés|britânico|britanico|british|_en\b|en_|inglês britanico|inglês britânico/i.test(nameWithoutExt)) {
      type = 'Locução em Inglês Nativo'
    } else if (/alemão|alemao|alemán|_de\b|de_|german/i.test(nameWithoutExt)) {
      type = 'Locução em Alemão'
    } else if (/francês|frances|français|_fr\b|fr_|french/i.test(nameWithoutExt)) {
      type = 'Locução em Francês'
    } else if (/português de portugal|portugues de portugal|português portugal|pt-pt/i.test(nameWithoutExt)) {
      type = 'Locução Português Portugal'
    } else if (/espera telefônica|espera telefonica|ura/i.test(nameWithoutExt)) {
      type = 'Espera Telefônica e URA'
      // Definir gênero padrão para Espera Telefônica se não encontrado no mapa
      if (!gender) {
        if (/p&g/i.test(nameWithoutExt)) {
          gender = 'Homem'
        } else if (/atala/i.test(nameWithoutExt)) {
          gender = 'Homem'
        } else {
          gender = 'Homem' // Padrão conforme solicitado
        }
      }
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
