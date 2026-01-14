import { NextRequest, NextResponse } from 'next/server'

// NOTA: Esta rota não está implementada porque o modelo audioProject não existe no schema do Prisma
// Use /api/audios para áudios e /api/youtube para vídeos do YouTube

// GET - Listar todos os projetos
export async function GET() {
  return NextResponse.json(
    { error: 'Esta rota não está implementada. Use /api/audios ou /api/youtube' },
    { status: 501 }
  )
}

// POST - Criar novo projeto
export async function POST(request: NextRequest) {
  return NextResponse.json(
    { error: 'Esta rota não está implementada. Use /api/audios ou /api/youtube' },
    { status: 501 }
  )
}
