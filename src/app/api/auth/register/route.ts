import { NextRequest, NextResponse } from 'next/server'

// NOTA: Registro não disponível em modo demonstração (sem banco de dados)

export async function POST(request: NextRequest) {
  return NextResponse.json(
    { error: 'Registro não disponível em modo demonstração' },
    { status: 501 }
  )
}
