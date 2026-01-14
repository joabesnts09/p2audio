import jwt from 'jsonwebtoken'

// Chave secreta para assinar o JWT (deve estar em variável de ambiente)
const JWT_SECRET = process.env.JWT_SECRET || process.env.NEXT_PUBLIC_JWT_SECRET || 'sua-chave-secreta-super-segura-aqui-mude-em-producao'
const JWT_EXPIRES_IN = '3d' // 3 dias

if (!process.env.JWT_SECRET && process.env.NODE_ENV === 'production') {
  console.warn('⚠️  JWT_SECRET não está definido! Isso é um risco de segurança em produção.')
}

export interface TokenPayload {
  userId: string
  username: string
  email: string
  role: string
}

/**
 * Gera um token JWT para o usuário
 */
export function generateToken(payload: TokenPayload): string {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  })
}

/**
 * Verifica e decodifica um token JWT
 */
export function verifyToken(token: string): TokenPayload | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as TokenPayload
    return decoded
  } catch (error) {
    console.error('Erro ao verificar token:', error)
    return null
  }
}

/**
 * Calcula a data de expiração do token (3 dias a partir de agora)
 */
export function getTokenExpirationDate(): Date {
  const expirationDate = new Date()
  expirationDate.setDate(expirationDate.getDate() + 3) // Adiciona 3 dias
  return expirationDate
}
