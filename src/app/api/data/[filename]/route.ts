import { NextRequest, NextResponse } from 'next/server'
import { readFileSync } from 'fs'
import { join } from 'path'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET(
  request: NextRequest,
  { params }: { params: { filename: string } }
) {
  try {
    const { filename } = params
    
    // Só permite arquivos JSON específicos
    const allowedFiles = ['audio-projects.json', 'services-audio-projects.json']
    
    if (!allowedFiles.includes(filename)) {
      return NextResponse.json({ error: 'File not found' }, { status: 404 })
    }
    
    const filePath = join(process.cwd(), 'public', 'data', filename)
    const fileContent = readFileSync(filePath, 'utf-8')
    const data = JSON.parse(fileContent)
    
    return NextResponse.json(data, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
        'Surrogate-Control': 'no-store',
      },
    })
  } catch (error) {
    console.error('Error reading JSON file:', error)
    return NextResponse.json({ error: 'Error reading file' }, { status: 500 })
  }
}
