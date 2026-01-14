'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import toast from 'react-hot-toast'
import { isAuthenticated } from '@/lib/auth'

export default function LoginPage() {
  const router = useRouter()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [hasUsers, setHasUsers] = useState<boolean | null>(null)
  const [checkingUsers, setCheckingUsers] = useState(true)
  const [checkingAuth, setCheckingAuth] = useState(true)

  useEffect(() => {
    checkIfAuthenticated()
    checkUsers()
  }, [])

  const checkIfAuthenticated = () => {
    // Verificar se o usuário já está autenticado
    if (typeof window === 'undefined') {
      setCheckingAuth(false)
      return
    }

    const token = localStorage.getItem('admin_token')
    const user = localStorage.getItem('admin_user')
    const expireToken = localStorage.getItem('admin_token_expires')

    if (token && user && expireToken) {
      // Verificar se não expirou
      try {
        const expirationDate = new Date(expireToken)
        const now = new Date()

        if (now < expirationDate && isAuthenticated()) {
          // Usuário já está autenticado, redirecionar para /admin
          console.log('[Login Page] Usuário já autenticado, redirecionando para /admin')
          window.location.href = '/admin'
          return
        }
      } catch (error) {
        console.error('[Login Page] Erro ao verificar autenticação:', error)
      }
    }

    setCheckingAuth(false)
  }

  const checkUsers = async () => {
    try {
      const response = await fetch('/api/users/check')
      const data = await response.json()
      setHasUsers(data.hasUsers)
    } catch (error) {
      console.error('Erro ao verificar usuários:', error)
      setHasUsers(true) // Assume que há usuários em caso de erro
    } finally {
      setCheckingUsers(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      })

      const data = await response.json()

      if (response.ok) {
        // Verificar se o token foi retornado
        if (!data.token) {
          console.error('Token não recebido da API:', data)
          setError('Erro: Token não recebido do servidor')
          return
        }

        // Salvar token JWT e dados do usuário
        localStorage.setItem('admin_token', data.token)
        localStorage.setItem('admin_user', JSON.stringify(data.user))
        localStorage.setItem('admin_token_expires', data.expireToken)
        
        console.log('Login bem-sucedido:', {
          token: data.token ? 'Token salvo' : 'Token não salvo',
          user: data.user ? 'Usuário salvo' : 'Usuário não salvo',
          expireToken: data.expireToken
        })
        
        toast.success('Login realizado com sucesso!')
        
        // Aguardar um pouco mais para garantir que o localStorage foi salvo
        setTimeout(() => {
          // Verificar se foi salvo antes de redirecionar
          const savedToken = localStorage.getItem('admin_token')
          const savedUser = localStorage.getItem('admin_user')
          const savedExpire = localStorage.getItem('admin_token_expires')
          
          console.log('Verificação antes de redirecionar:', {
            token: savedToken ? 'OK' : 'FALTANDO',
            user: savedUser ? 'OK' : 'FALTANDO',
            expire: savedExpire ? 'OK' : 'FALTANDO'
          })
          
          if (savedToken && savedUser && savedExpire) {
            console.log('Todos os dados salvos, redirecionando para /admin...')
            // Usar window.location.href para garantir reload completo
            window.location.href = '/admin'
          } else {
            console.error('Dados não foram salvos corretamente!')
            console.error('Token:', savedToken)
            console.error('User:', savedUser)
            console.error('Expire:', savedExpire)
            setError('Erro ao salvar dados de autenticação. Tente novamente.')
          }
        }, 1000)
      } else {
        console.error('Erro no login:', data)
        setError(data.error || 'Erro ao fazer login')
      }
    } catch (error) {
      console.error('Erro ao fazer login:', error)
      setError('Erro ao conectar com o servidor')
    } finally {
      setLoading(false)
    }
  }

  // Mostrar loading enquanto verifica autenticação
  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Verificando autenticação...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Painel Admin - Login
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Acesso restrito para administradores
          </p>
          {!checkingUsers && !hasUsers && (
            <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800 text-center mb-2">
                Nenhum usuário admin encontrado.
              </p>
              <Link
                href="/admin/setup"
                className="block text-center text-sm font-medium text-yellow-900 hover:text-yellow-700 underline"
              >
                Criar primeiro usuário admin →
              </Link>
            </div>
          )}
        </div>
        <form className="mt-8 space-y-6 bg-white p-8 rounded-lg shadow-lg" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}
          <div className="space-y-4">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                Usuário
              </label>
              <input
                id="username"
                name="username"
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-gold-yellow focus:border-gold-yellow focus:z-10 sm:text-sm"
                placeholder="Digite seu usuário"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Senha
              </label>
              <div className="mt-1 relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none relative block w-full px-3 py-2 pr-10 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-gold-yellow focus:border-gold-yellow sm:text-sm"
                  placeholder="Digite sua senha"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700 z-20"
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-lg text-black bg-gold-yellow hover:bg-gold focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gold-yellow disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Entrando...' : 'Entrar'}
            </button>
            <Link
              href="/"
              className="block w-full text-center py-2 px-4 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
            >
              ← Voltar para página inicial
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}
