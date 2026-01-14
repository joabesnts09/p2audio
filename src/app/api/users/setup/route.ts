import { NextRequest, NextResponse } from 'next/server'

// NOTA: Setup de usuários não disponível em modo demonstração

// POST - Criar o primeiro usuário admin (não disponível em modo demonstração)
export async function POST(request: NextRequest) {
  return NextResponse.json(
    { error: 'Setup de usuários não disponível em modo demonstração' },
    { status: 501 }
  )
}
