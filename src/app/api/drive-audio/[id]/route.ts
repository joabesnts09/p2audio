import { NextRequest, NextResponse } from 'next/server'

/**
 * Proxy para servir áudios do Google Drive com headers corretos para streaming
 * Suporta Range requests para streaming eficiente de arquivos grandes
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const fileId = params.id

  if (!fileId) {
    return NextResponse.json({ error: 'File ID is required' }, { status: 400 })
  }

  try {
    // Verificar se há Range header (para streaming)
    const rangeHeader = request.headers.get('range')
    
    // Tentar usar a API do Google Drive primeiro (se API key estiver configurada)
    const API_KEY = process.env.GOOGLE_DRIVE_API_KEY
    
    let response: Response
    
    if (API_KEY) {
      // Usar API do Google Drive para obter link de download direto
      try {
        const apiUrl = `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media&key=${API_KEY}`
        
        const apiHeaders: HeadersInit = {}
        if (rangeHeader) {
          apiHeaders['Range'] = rangeHeader
        }
        
        response = await fetch(apiUrl, {
          headers: apiHeaders,
        })
        
        // Se a API funcionar, usar ela
        if (response.ok || response.status === 206) {
          // Continuar com a resposta da API
        } else {
          // Se falhar, tentar método alternativo
          throw new Error('API failed, trying alternative method')
        }
      } catch (apiError) {
        // Se API falhar, tentar método direto
        console.log('API method failed, trying direct download')
        const driveUrl = `https://drive.google.com/uc?export=download&id=${fileId}`
        
        const driveHeaders: HeadersInit = {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        }
        
        if (rangeHeader) {
          driveHeaders['Range'] = rangeHeader
        }
        
        response = await fetch(driveUrl, {
          headers: driveHeaders,
        })
        
        // Se retornar HTML (página de confirmação), tentar formato alternativo
        const responseContentType = response.headers.get('content-type') || ''
        if (responseContentType.includes('text/html')) {
          const altUrl = `https://drive.google.com/uc?export=download&confirm=t&id=${fileId}`
          response = await fetch(altUrl, {
            headers: driveHeaders,
          })
        }
      }
    } else {
      // Sem API key, usar método direto
      const driveUrl = `https://drive.google.com/uc?export=download&id=${fileId}`
      
      const driveHeaders: HeadersInit = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      }
      
      if (rangeHeader) {
        driveHeaders['Range'] = rangeHeader
      }
      
      response = await fetch(driveUrl, {
        headers: driveHeaders,
      })
      
      // Se retornar HTML (página de confirmação), tentar formato alternativo
      const responseContentType = response.headers.get('content-type') || ''
      if (responseContentType.includes('text/html')) {
        const altUrl = `https://drive.google.com/uc?export=download&confirm=t&id=${fileId}`
        response = await fetch(altUrl, {
          headers: driveHeaders,
        })
      }
    }

    if (!response.ok && response.status !== 206) {
      // Tentar ler o conteúdo da resposta para diagnóstico
      let errorText = ''
      let responseContentType = response.headers.get('content-type') || ''
      
      try {
        const text = await response.text()
        errorText = text.substring(0, 500)
      } catch (e) {
        // Ignorar erro ao ler texto
      }
      
      console.error(`[Drive Audio Proxy] Erro ao buscar arquivo:`, {
        fileId,
        status: response.status,
        statusText: response.statusText,
        contentType: responseContentType,
        hasErrorText: errorText.length > 0,
        errorPreview: errorText.substring(0, 200)
      })
      
      // Se retornar HTML, provavelmente é página de confirmação do Google Drive
      if (responseContentType.includes('text/html')) {
        return NextResponse.json(
          { 
            error: 'Arquivo requer confirmação do Google Drive',
            message: 'O arquivo pode estar muito grande ou requer permissão especial. Certifique-se de que está público.',
            fileId
          },
          { 
            status: 403,
            headers: {
              'Content-Type': 'application/json',
            }
          }
        )
      }
      
      return NextResponse.json(
        { 
          error: 'Erro ao buscar arquivo do Google Drive',
          message: `Status ${response.status}: ${response.statusText}`,
          fileId
        },
        { 
          status: response.status,
          headers: {
            'Content-Type': 'application/json',
          }
        }
      )
    }

    // Obter o conteúdo do arquivo
    const arrayBuffer = await response.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    // Detectar tipo MIME baseado no conteúdo ou usar audio/mpeg como padrão
    const contentType = response.headers.get('content-type') || 'audio/mpeg'
    
    // Obter Content-Range se disponível (para Range requests)
    const contentRange = response.headers.get('content-range')
    const contentLength = response.headers.get('content-length') || buffer.length.toString()

    // Headers de resposta
    const responseHeaders: HeadersInit = {
      'Content-Type': contentType,
      'Accept-Ranges': 'bytes',
      'Cache-Control': 'public, max-age=3600',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, HEAD, OPTIONS',
      'Access-Control-Allow-Headers': 'Range',
    }

    // Se for uma resposta parcial (206), incluir Content-Range
    if (response.status === 206 && contentRange) {
      responseHeaders['Content-Range'] = contentRange
      responseHeaders['Content-Length'] = contentLength
      
      return new NextResponse(buffer, {
        status: 206,
        headers: responseHeaders,
      })
    }

    // Resposta completa
    responseHeaders['Content-Length'] = buffer.length.toString()

    return new NextResponse(buffer, {
      status: 200,
      headers: responseHeaders,
    })
  } catch (error: any) {
    console.error('Erro no proxy de áudio:', error)
    console.error('File ID:', fileId)
    return NextResponse.json(
      { 
        error: 'Erro ao processar requisição de áudio',
        message: error?.message || 'Erro desconhecido'
      },
      { status: 500 }
    )
  }
}

// Suportar HEAD requests para obter informações do arquivo sem baixar
export async function HEAD(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const fileId = params.id

  if (!fileId) {
    return new NextResponse(null, { status: 400 })
  }

  try {
    const driveUrl = `https://drive.google.com/uc?export=download&id=${fileId}`
    
    const response = await fetch(driveUrl, {
      method: 'HEAD',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
    })

    if (!response.ok) {
      return new NextResponse(null, { status: response.status })
    }

    const contentType = response.headers.get('content-type') || 'audio/mpeg'
    const contentLength = response.headers.get('content-length') || '0'

    return new NextResponse(null, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Content-Length': contentLength,
        'Accept-Ranges': 'bytes',
        'Cache-Control': 'public, max-age=3600',
        'Access-Control-Allow-Origin': '*',
      },
    })
  } catch (error) {
    console.error('Erro no HEAD do proxy de áudio:', error)
    return new NextResponse(null, { status: 500 })
  }
}
