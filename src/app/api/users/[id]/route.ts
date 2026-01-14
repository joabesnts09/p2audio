import { NextRequest, NextResponse } from 'next/server'

// NOTA: Gerenciamento de usuários não disponível em modo demonstração

// DELETE - Deletar usuário (não disponível em modo demonstração)
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return NextResponse.json(
    { error: 'Gerenciamento de usuários não disponível em modo demonstração' },
    { status: 501 }
  )
}
