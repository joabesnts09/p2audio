import { NextResponse } from 'next/server'

interface AudioProject {
  id: number
  title: string
  description: string
  audioUrl: string
  type: string
  duration?: string
}

export async function GET() {
  console.log('[API] Requisição recebida para /api/audio-projects')
  
  // ID da planilha do Google Sheets (configurado via variável de ambiente)
  const SHEET_ID = process.env.NEXT_PUBLIC_GOOGLE_SHEETS_ID || '1c8XYb1iLpQxU0CmEyTbJYBoZNc5Eus5BzkY2rwMHsKc'
  const SHEET_NAME = process.env.NEXT_PUBLIC_GOOGLE_SHEETS_NAME || 'Página1' // Nome da aba
  
  console.log('[API] Sheet ID:', SHEET_ID)
  console.log('[API] Sheet Name:', SHEET_NAME)
  
  if (!SHEET_ID || SHEET_ID === 'SEU_SHEET_ID_AQUI') {
    console.warn('[API] Google Sheets ID não configurado. Configure NEXT_PUBLIC_GOOGLE_SHEETS_ID no .env.local')
    return NextResponse.json({ error: 'Google Sheets ID não configurado' }, { status: 400 })
  }
  
  try {
    // Codifica o nome da aba para URL (importante para caracteres especiais e espaços)
    const encodedSheetName = encodeURIComponent(SHEET_NAME)
    
    // URL da API pública do Google Sheets
    const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json&sheet=${encodedSheetName}`
    
    console.log('Buscando dados do Google Sheets:', url)
    console.log('Sheet ID:', SHEET_ID)
    console.log('Sheet Name:', SHEET_NAME)
    
    // Tenta fazer a requisição sem User-Agent primeiro (alguns servidores bloqueiam User-Agent customizado)
    let response = await fetch(url, { 
      cache: 'no-store',
    })
    
    // Se falhar com 401, tenta com User-Agent
    if (!response.ok && response.status === 401) {
      console.warn('Primeira tentativa retornou 401, tentando com User-Agent...')
      response = await fetch(url, { 
        cache: 'no-store',
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        }
      })
    }
    
    if (!response.ok) {
      console.error('Erro na resposta do Google Sheets:', response.status, response.statusText)
      console.error('URL tentada:', url)
      const errorText = await response.text().catch(() => 'Não foi possível ler o corpo da resposta')
      console.error('Resposta de erro:', errorText.substring(0, 500))
      
      // Mensagem mais útil para o usuário
      let errorMessage = `Erro ao buscar dados: ${response.status} ${response.statusText}`
      if (response.status === 401) {
        errorMessage = 'A planilha do Google Sheets não está pública. Por favor, verifique as configurações de compartilhamento da planilha e certifique-se de que ela está configurada como "Qualquer pessoa com o link pode visualizar".'
      } else if (response.status === 404) {
        errorMessage = 'Planilha não encontrada. Verifique se o ID da planilha está correto nas variáveis de ambiente.'
      }
      
      return NextResponse.json(
        { error: errorMessage },
        { status: response.status }
      )
    }
    
    const text = await response.text()
    
    if (!text || text.length < 50) {
      console.error('Resposta do Google Sheets vazia ou inválida. Tamanho:', text?.length || 0)
      console.error('Primeiros caracteres:', text?.substring(0, 100))
      return NextResponse.json(
        { error: 'Resposta do Google Sheets vazia ou inválida' },
        { status: 500 }
      )
    }
    
    // Remove o prefixo que o Google Sheets adiciona de forma mais robusta
    // O formato é: google.visualization.Query.setResponse(...)
    // Precisamos extrair o JSON de dentro dos parênteses
    let jsonText = text.trim()
    
    // Procura pelo início do JSON (geralmente após "setResponse(")
    const startIndex = jsonText.indexOf('{')
    if (startIndex === -1) {
      console.error('Não foi possível encontrar o início do JSON na resposta')
      console.error('Resposta completa:', text.substring(0, 500))
      return NextResponse.json(
        { error: 'Formato de resposta inválido do Google Sheets' },
        { status: 500 }
      )
    }
    
    // Remove tudo antes do primeiro {
    jsonText = jsonText.substring(startIndex)
    
    // Remove o último caractere se for um ponto e vírgula ou parêntese de fechamento
    jsonText = jsonText.replace(/[;)]+$/, '')
    
    let json
    try {
      json = JSON.parse(jsonText)
    } catch (parseError) {
      console.error('Erro ao fazer parse do JSON:', parseError)
      console.error('Texto tentado:', jsonText.substring(0, 500))
      return NextResponse.json(
        { error: 'Erro ao processar resposta do Google Sheets' },
        { status: 500 }
      )
    }
    
    if (!json.table || !json.table.rows) {
      console.error('Estrutura de dados inválida do Google Sheets')
      console.error('JSON recebido:', JSON.stringify(json, null, 2).substring(0, 500))
      return NextResponse.json(
        { error: 'Estrutura de dados inválida do Google Sheets' },
        { status: 500 }
      )
    }
    
    const rows = json.table.rows
    
    console.log(`[API] Total de linhas encontradas: ${rows.length}`)
    console.log(`[API] Estrutura da primeira linha (cabeçalho):`, JSON.stringify(rows[0], null, 2))
    if (rows.length > 1) {
      console.log(`[API] Estrutura da segunda linha (primeira linha de dados):`, JSON.stringify(rows[1], null, 2))
    }
    
    if (rows.length === 0) {
      console.warn('[API] Nenhuma linha encontrada na planilha')
      return NextResponse.json([])
    }
    
    if (rows.length === 1) {
      console.warn('[API] Apenas o cabeçalho encontrado, nenhum dado na planilha')
      return NextResponse.json([])
    }
    
    // Mapeia as linhas para objetos AudioProject
    // Pula a primeira linha (cabeçalho) e processa os dados
    console.log('[API] Processando linhas da planilha...')
    const projects = rows.slice(1).map((row: any, index: number) => {
      const cells = row.c
      
      console.log(`[API] Linha ${index + 2} - Células:`, cells ? cells.length : 0, 'células')
      
      if (!cells || cells.length === 0) {
        console.log(`[API] Linha ${index + 2} está vazia, pulando...`)
        return null
      }
      
      // Mapeia as colunas: A=id, B=title, C=description, D=audioUrl, E=type, F=duration
      const project = {
        id: cells[0]?.v ? parseInt(cells[0].v) : index + 1, // Coluna A - id
        title: cells[1]?.v || '', // Coluna B - title
        description: cells[2]?.v || '', // Coluna C - description
        audioUrl: cells[3]?.v || '', // Coluna D - audioUrl
        type: cells[4]?.v || '', // Coluna E - type
        duration: cells[5]?.v || undefined, // Coluna F - duration
      }
      
      console.log(`[API] Linha ${index + 2} processada:`, {
        id: project.id,
        title: project.title,
        description: project.description,
        audioUrl: project.audioUrl ? `${project.audioUrl.substring(0, 50)}...` : '(vazio)',
        type: project.type,
        duration: project.duration
      })
      return project
    }).filter((project: AudioProject | null): project is AudioProject => {
      // Remove linhas vazias e nulls - verifica se tem título E audioUrl
      if (!project) {
        console.log('[API] Projeto null filtrado')
        return false
      }
      const hasTitle = !!project.title && project.title.trim().length > 0
      const hasAudioUrl = !!project.audioUrl && project.audioUrl.trim().length > 0
      const isValid = hasTitle && hasAudioUrl
      
      if (!isValid) {
        console.log('[API] Projeto filtrado:', {
          motivo: !hasTitle ? 'sem título' : 'sem audioUrl',
          projeto: {
            id: project.id,
            title: project.title,
            audioUrl: project.audioUrl ? `${project.audioUrl.substring(0, 30)}...` : '(vazio)'
          }
        })
      }
      return isValid
    })
    
    console.log(`[API] Projetos válidos encontrados: ${projects.length}`)
    console.log('[API] Projetos finais:', JSON.stringify(projects, null, 2))
    return NextResponse.json(projects)
  } catch (error) {
    console.error('Erro ao buscar dados do Google Sheets:', error)
    if (error instanceof Error) {
      console.error('Mensagem de erro:', error.message)
      console.error('Stack:', error.stack)
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      )
    }
    return NextResponse.json(
      { error: 'Erro desconhecido ao buscar dados' },
      { status: 500 }
    )
  }
}
