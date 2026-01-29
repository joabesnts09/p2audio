/**
 * Script para gerar lista de áudios de serviços em build time
 * Execute: node scripts/generate-services-audio-list.js
 */
const { readdir, stat } = require('fs/promises')
const { join } = require('path')
const { existsSync } = require('fs')
const { writeFileSync } = require('fs')

// Mapeamento de pastas para tipos de serviço
const FOLDER_TYPE_MAP = {
  'ura_e_espera_telefonica': 'Espera Telefônica e URA',
  'internacionais_espanhol': 'Locução em Espanhol Nativo',
  'internacionais _ingles': 'Locução em Inglês Nativo',
  'internacionais_gerais': 'Locução em Outros Idiomas', // Alemão, Francês, Árabe, Cantonês, etc.
  'nacionais': 'Gravação de Locução',
}

// Mapeamento de subpastas de nacionais para gênero
const GENDER_MAP = {
  'fem': 'Mulher',
  'masc': 'Homem',
}

/**
 * Detecta o gênero baseado no nome do arquivo
 * Procura por palavras-chave como "locutora", "locutor", nomes de artistas, etc.
 */
function detectGender(fileName) {
  const nameLower = fileName.toLowerCase()
  
  // Primeiro, verificar especificamente por "locutora" (feminino)
  // Isso tem prioridade para evitar falsos positivos com "locutor"
  if (nameLower.includes('locutora') || nameLower.includes('narradora')) {
    return 'Mulher'
  }
  
  // Depois verificar por "locutor" (masculino)
  // Mas só se não contiver "locutora" (para evitar falsos positivos)
  if ((nameLower.includes('locutor') || nameLower.includes('narrador')) && 
      !nameLower.includes('locutora') && !nameLower.includes('narradora')) {
    return 'Homem'
  }
  
  // Palavras-chave que indicam gênero feminino (sem "locutora" que já foi verificado)
  const femaleKeywords = [
    'mulher', 'woman', 'female', 'feminina', 'feminino', 
    'fem', 'voz feminina', 'voz de mulher', 'voz mulher'
  ]
  
  // Palavras-chave que indicam gênero masculino (sem "locutor" que já foi verificado)
  const maleKeywords = [
    'homem', 'man', 'male', 'masculino', 'masc', 
    'voz masculina', 'voz de homem', 'voz homem'
  ]
  
  // Verificar palavras-chave femininas
  for (const keyword of femaleKeywords) {
    if (nameLower.includes(keyword)) {
      return 'Mulher'
    }
  }
  
  // Verificar palavras-chave masculinas
  for (const keyword of maleKeywords) {
    if (nameLower.includes(keyword)) {
      return 'Homem'
    }
  }
  
  // Lista de nomes próprios conhecidos e seus gêneros
  const femaleNames = [
    'wanessa', 'carol', 'diana', 'elizabeth', 'emma', 'genevieve',
    'jennifer', 'jessica', 'karen', 'laura', 'maria', 'patricia',
    'sarah', 'sophia', 'vanessa', 'victoria', 'ana', 'beatriz',
    'carla', 'fernanda', 'gabriela', 'juliana', 'luciana', 'mariana',
    'natalia', 'rafaela', 'renata', 'tatiana', 'valeria'
  ]
  
  const maleNames = [
    'giovane', 'brad', 'colin', 'david', 'drew', 'jason', 'michael',
    'robert', 'thomas', 'william', 'alex', 'bruno', 'carlos', 'daniel',
    'eduardo', 'felipe', 'gabriel', 'henrique', 'ivan', 'joao', 'lucas',
    'marcos', 'paulo', 'rafael', 'ricardo', 'rodrigo', 'thiago', 'vinicius'
  ]
  
  // Tentar detectar pelo padrão do nome do artista
  // Padrões comuns: "Locutor Nome", "Nome Locutor", "Locutora Nome", etc.
  const parts = nameLower.split(/[-–—_\s]+/).map(p => p.trim()).filter(p => p && p.length > 2)
  
  // Verificar se alguma parte contém indicadores de gênero
  for (let i = 0; i < parts.length; i++) {
    const part = parts[i]
    
    // Verificar padrão "Locutora Nome" ou "Nome Locutora"
    if (part === 'locutora' || part === 'narradora') {
      return 'Mulher'
    }
    
    // Verificar padrão "Locutor Nome" ou "Nome Locutor" (mas não "Locutora")
    if ((part === 'locutor' || part === 'narrador') && 
        !parts.some(p => p.includes('locutora') || p.includes('narradora'))) {
      return 'Homem'
    }
    
    // Verificar se a parte é um nome próprio conhecido
    // Remover caracteres especiais e números para comparar apenas o nome
    const cleanPart = part.replace(/[^a-z]/g, '')
    
    // Primeiro verificar correspondência exata (mais confiável)
    if (maleNames.includes(cleanPart)) {
      return 'Homem'
    }
    
    if (femaleNames.includes(cleanPart)) {
      return 'Mulher'
    }
    
    // Depois verificar correspondências parciais, mas com cuidado
    // Verificar se contém parte de um nome masculino conhecido (prioridade)
    for (const name of maleNames) {
      // Só considerar se o nome completo ou parte significativa está presente
      if (cleanPart === name || (cleanPart.length >= 4 && (cleanPart.includes(name) || name.includes(cleanPart)))) {
        return 'Homem'
      }
    }
    
    // Verificar se contém parte de um nome feminino conhecido
    for (const name of femaleNames) {
      // Só considerar se o nome completo ou parte significativa está presente
      if (cleanPart === name || (cleanPart.length >= 4 && (cleanPart.includes(name) || name.includes(cleanPart)))) {
        return 'Mulher'
      }
    }
  }
  
  // Casos especiais conhecidos
  if (nameLower.includes('es_al') || nameLower.includes('roche')) {
    // URA_Roche - ES_AL é Mulher conforme especificado
    return 'Mulher'
  }
  
  // Não foi possível determinar o gênero
  return null
}

function parseFileName(fileName) {
  // Remover "_compressed" e extensão
  const nameWithoutCompressed = fileName.replace(/_compressed/gi, '')
  const nameWithoutExt = nameWithoutCompressed.replace(/\.(wav|mp3|aif|m4a)$/i, '')
  
  // Extrair informações do nome
  let title = nameWithoutExt
  let client = ''
  
  // Tentar extrair cliente se houver padrão "Cliente - Nome" ou "Nome - Cliente"
  const parts = nameWithoutExt.split(/[-–—]/).map(p => p.trim()).filter(p => p)
  
  if (parts.length > 1) {
    // Verificar se o primeiro ou último parte parece ser um cliente/nome
    title = parts.join(' - ')
  }
  
  return { title, client }
}

async function scanDirectory(dirPath, relativePath = '') {
  const files = []
  
  try {
    const entries = await readdir(dirPath, { withFileTypes: true })
    
    for (const entry of entries) {
      const fullPath = join(dirPath, entry.name)
      const relativeFilePath = relativePath ? `${relativePath}/${entry.name}` : entry.name
      
      if (entry.isDirectory()) {
        // Recursivamente escanear subdiretórios
        const subFiles = await scanDirectory(fullPath, relativeFilePath)
        files.push(...subFiles)
      } else if (entry.isFile()) {
        // Verificar se é arquivo de áudio
        if (/\.(wav|mp3|aif|m4a)$/i.test(entry.name)) {
          files.push({
            fileName: entry.name,
            relativePath: relativeFilePath,
            fullPath: fullPath,
          })
        }
      }
    }
  } catch (error) {
    console.error(`Erro ao escanear diretório ${dirPath}:`, error.message)
  }
  
  return files
}

async function generateServicesAudioList() {
  try {
    const servicosPath = join(process.cwd(), 'public', 'servicos')
    
    if (!existsSync(servicosPath)) {
      console.log('Pasta servicos não encontrada')
      return []
    }
    
    // Escanear todas as pastas de serviços
    const allFiles = await scanDirectory(servicosPath)
    
    const audios = []
    let index = 0
    
    for (const file of allFiles) {
      // Determinar tipo baseado na estrutura de pastas
      const pathParts = file.relativePath.split('/')
      const folderName = pathParts[0]
      const subFolder = pathParts[1]
      
      let type = FOLDER_TYPE_MAP[folderName] || 'Gravação de Locução'
      let gender = null
      
      // Para nacionais, verificar subpasta (fem/masc)
      if (folderName === 'nacionais' && subFolder) {
        gender = GENDER_MAP[subFolder] || null
      }
      
      // Para todos os serviços, tentar detectar gênero do nome do arquivo
      // Isso sobrescreve a detecção por pasta se encontrar no nome
      if (!gender) {
        gender = detectGender(file.fileName)
      } else {
        // Mesmo que tenha gênero da pasta, verificar se o nome do arquivo confirma
        // Se o nome do arquivo indicar algo diferente, usar o do nome (mais específico)
        const fileNameGender = detectGender(file.fileName)
        if (fileNameGender) {
          gender = fileNameGender
        }
      }
      
      // Parse do nome do arquivo
      const { title, client } = parseFileName(file.fileName)
      
      // Construir URL (manter nome original com _compressed para o arquivo)
      const encodedFileName = encodeURIComponent(file.fileName)
      const audioUrl = `/servicos/${file.relativePath.replace(/\\/g, '/')}`
      
      // Construir descrição
      const descriptionParts = [type]
      if (client) descriptionParts.push(`Cliente: ${client}`)
      if (gender) descriptionParts.push(`Voz: ${gender}`)
      
      audios.push({
        id: `service-${index}-${file.fileName.replace(/[^a-zA-Z0-9]/g, '-')}`,
        title: title || file.fileName.replace(/_compressed/gi, '').replace(/\.(wav|mp3|aif|m4a)$/i, ''),
        description: descriptionParts.join(' - '),
        audioUrl,
        type,
        client: client || undefined,
        gender: gender || undefined,
        duration: undefined,
        coverImage: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      })
      
      index++
    }
    
    // Salvar em arquivo JSON
    const outputPath = join(process.cwd(), 'public', 'data', 'services-audio-projects.json')
    writeFileSync(outputPath, JSON.stringify(audios, null, 2), 'utf-8')
    
    console.log(`✅ Gerado arquivo com ${audios.length} áudios de serviços: ${outputPath}`)
    return audios
  } catch (error) {
    console.error('Erro ao gerar lista de áudios de serviços:', error)
    return []
  }
}

generateServicesAudioList()
