import { NextRequest, NextResponse } from 'next/server'

// NOTA: Gerenciamento de usuários não disponível em modo demonstração

// GET - Listar todos os usuários (não disponível em modo demonstração)
export async function GET() {
  return NextResponse.json(
    { error: 'Gerenciamento de usuários não disponível em modo demonstração' },
    { status: 501 }
  )
}
