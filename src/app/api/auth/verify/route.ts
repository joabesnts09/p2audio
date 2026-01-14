import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/lib/jwt'

/**
 * GET - Verifica se o token JWT é válido
 */
export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { valid: false, error: 'Token não fornecido' },
        { status: 401 }
      )
    }

    const token = authHeader.substring(7) // Remove "Bearer "
    const payload = verifyToken(token)

    if (!payload) {
      return NextResponse.json(
        { valid: false, error: 'Token inválido ou expirado' },
        { status: 401 }
      )
    }

    return NextResponse.json({
      valid: true,
      user: {
        userId: payload.userId,
        username: payload.username,
        email: payload.email,
        role: payload.role,
      },
    })
  } catch (error) {
    console.error('Erro ao verificar token:', error)
    return NextResponse.json(
      { valid: false, error: 'Erro ao verificar token' },
      { status: 500 }
    )
  }
}
