import { NextRequest, NextResponse } from 'next/server'

// NOTA: Autenticação não disponível em modo demonstração (sem banco de dados)

export async function POST(request: NextRequest) {
  return NextResponse.json(
    { error: 'Autenticação não disponível em modo demonstração' },
    { status: 501 }
  )
}
