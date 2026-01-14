/**
 * Funções helper para autenticação no frontend
 */

export interface AuthData {
  token: string
  user: any
  expireToken: string
}

/**
 * Verifica se o token JWT está válido (não expirado)
 */
export function isTokenValid(): boolean {
  if (typeof window === 'undefined') {
    console.log('[Auth] Executando no servidor, retornando false')
    return false
  }

  const token = localStorage.getItem('admin_token')
  const expireToken = localStorage.getItem('admin_token_expires')

  console.log('[Auth] Verificando token:', { 
    hasToken: !!token, 
    hasExpireToken: !!expireToken,
    tokenLength: token?.length,
    tokenPreview: token ? `${token.substring(0, 30)}...` : null
  })

  if (!token || !expireToken) {
    console.log('[Auth] Token ou expireToken não encontrados')
    return false
  }

  // Verificar se o token expirou (usando expireToken do localStorage)
  try {
    const expirationDate = new Date(expireToken)
    const now = new Date()

    console.log('[Auth] Datas:', { 
      now: now.toISOString(), 
      expiration: expirationDate.toISOString(),
      isExpired: now >= expirationDate 
    })

    if (now >= expirationDate) {
      // Token expirado, limpar dados
      console.log('[Auth] Token expirado (data de expiração)')
      clearAuthData()
      return false
    }

    // Verificar se o token JWT tem estrutura válida
    const tokenParts = token.split('.')
    if (tokenParts.length !== 3) {
      // Token JWT inválido (deve ter 3 partes: header.payload.signature)
      console.log('[Auth] Token JWT inválido - não tem 3 partes')
      return false
    }

    // Decodificar o payload (sem verificar a assinatura, isso é feito no backend)
    try {
      const payload = JSON.parse(atob(tokenParts[1]))
      
      console.log('[Auth] Payload decodificado:', { 
        hasUserId: !!payload.userId, 
        hasUsername: !!payload.username, 
        hasExp: !!payload.exp,
        exp: payload.exp,
        iat: payload.iat
      })
      
      // Verificar se o payload tem os campos necessários
      if (!payload.userId || !payload.username) {
        console.log('[Auth] Payload incompleto - faltando userId ou username')
        return false
      }

      // Se tiver exp, verificar também
      if (payload.exp) {
        const tokenExpiration = new Date(payload.exp * 1000) // exp está em segundos
        console.log('[Auth] Token expiration (JWT):', { 
          tokenExpiration: tokenExpiration.toISOString(),
          now: now.toISOString(),
          isExpired: now >= tokenExpiration 
        })
        
        if (now >= tokenExpiration) {
          console.log('[Auth] Token expirado (JWT exp)')
          clearAuthData()
          return false
        }
      }

      console.log('[Auth] Token válido!')
      return true
    } catch (decodeError) {
      console.error('[Auth] Erro ao decodificar payload:', decodeError)
      return false
    }
  } catch (error) {
    console.error('[Auth] Erro ao verificar token:', error)
    return false
  }
}

/**
 * Obtém os dados de autenticação do localStorage
 */
export function getAuthData(): AuthData | null {
  if (typeof window === 'undefined') return null

  const token = localStorage.getItem('admin_token')
  const userStr = localStorage.getItem('admin_user')
  const expireToken = localStorage.getItem('admin_token_expires')

  if (!token || !userStr || !expireToken) {
    return null
  }

  try {
    const user = JSON.parse(userStr)
    return {
      token,
      user,
      expireToken,
    }
  } catch (error) {
    console.error('Erro ao parsear dados de autenticação:', error)
    return null
  }
}

/**
 * Limpa todos os dados de autenticação
 */
export function clearAuthData(): void {
  if (typeof window === 'undefined') return

  localStorage.removeItem('admin_token')
  localStorage.removeItem('admin_user')
  localStorage.removeItem('admin_token_expires')
}

/**
 * Verifica se o usuário está autenticado
 */
export function isAuthenticated(): boolean {
  return isTokenValid()
}
