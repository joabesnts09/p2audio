import { NextRequest, NextResponse } from 'next/server'

// NOTA: Esta rota não está implementada
// Use /api/audios/[id] para áudios e /api/youtube/[id] para vídeos do YouTube

// GET - Buscar projeto por ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return NextResponse.json(
    { error: 'Esta rota não está implementada. Use /api/audios/[id] ou /api/youtube/[id]' },
    { status: 501 }
  )
}

// PUT - Atualizar projeto
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return NextResponse.json(
    { error: 'Esta rota não está implementada. Use /api/audios/[id] ou /api/youtube/[id]' },
    { status: 501 }
  )
}

// DELETE - Deletar projeto
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return NextResponse.json(
    { error: 'Esta rota não está implementada. Use /api/audios/[id] ou /api/youtube/[id]' },
    { status: 501 }
  )
}
