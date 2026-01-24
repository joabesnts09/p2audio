/**
 * Esta função só é usada em desenvolvimento local
 * NUNCA é importada em produção para evitar que o Vercel inclua arquivos no bundle
 */
import { readdir } from 'fs/promises'
import { join } from 'path'
import { existsSync } from 'fs'

export async function getLocalAudiosDev(parseFileName: any): Promise<any[]> {
  try {
    const portfolioPath = join(process.cwd(), 'public', 'Portfólio')
    
    if (!existsSync(portfolioPath)) {
      console.log('[API] Pasta Portfólio não encontrada')
      return []
    }
    
    const files = await readdir(portfolioPath)
    const audioFiles = files.filter((file: string) => 
      /\.(wav|mp3|aif|m4a)$/i.test(file)
    )
    
    return audioFiles.map((fileName: string, index: number) => {
      const { type, client, title, gender } = parseFileName(fileName)
      const encodedFileName = encodeURIComponent(fileName)
      const audioUrl = `/Portfólio/${encodedFileName}`
      
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
