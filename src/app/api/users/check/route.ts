import { NextResponse } from 'next/server'

// NOTA: Verificação de usuários não disponível em modo demonstração

// GET - Verificar se existe algum usuário (não disponível em modo demonstração)
export async function GET() {
  return NextResponse.json(
    { hasUsers: false, count: 0, error: 'Verificação de usuários não disponível em modo demonstração' },
    { status: 501 }
  )
}
