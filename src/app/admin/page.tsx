'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { isAuthenticated, clearAuthData, getAuthData } from '@/lib/auth'
import toast from 'react-hot-toast'

interface Audio {
  id: string
  title: string
  description: string
  audioUrl: string
  type: string | null
  client: string | null
  duration: string | null
  coverImage: string | null
}

interface YouTubeVideo {
  id: string
  title: string
  description: string
  youtubeUrl: string
  type: string | null
  client: string | null
  duration: string | null
  coverImage: string | null
}

interface User {
  id: string
  username: string
  email: string
  role: string
  createdAt: string
  updatedAt: string
}

export default function AdminPage() {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isCheckingAuth, setIsCheckingAuth] = useState(true)
  const [activeTab, setActiveTab] = useState<'audios' | 'youtube' | 'users'>('audios')
  
  // Áudios
  const [audios, setAudios] = useState<Audio[]>([])
  const [loadingAudios, setLoadingAudios] = useState(true)
  const [editingAudio, setEditingAudio] = useState<Audio | null>(null)
  const [uploadingAudio, setUploadingAudio] = useState(false)
  const [audioFormData, setAudioFormData] = useState({
    title: '',
    description: '',
    audioUrl: '',
    type: '',
  })

  // YouTube Videos
  const [videos, setVideos] = useState<YouTubeVideo[]>([])
  const [loadingVideos, setLoadingVideos] = useState(true)
  const [editingVideo, setEditingVideo] = useState<YouTubeVideo | null>(null)
  const [videoFormData, setVideoFormData] = useState({
    title: '',
    description: '',
    youtubeUrl: '',
    type: '',
  })

  // Users
  const [users, setUsers] = useState<User[]>([])
  const [loadingUsers, setLoadingUsers] = useState(true)
  const [userFormData, setUserFormData] = useState({
    username: '',
    email: '',
    password: '',
  })

  useEffect(() => {
    // Pequeno delay para garantir que o localStorage foi atualizado após login
    const timer = setTimeout(() => {
      checkAuth()
    }, 100)
    
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (isAuthenticated) {
      if (activeTab === 'audios') {
        loadAudios()
      } else if (activeTab === 'youtube') {
        loadVideos()
      } else if (activeTab === 'users') {
        loadUsers()
      }
    }
  }, [isAuthenticated, activeTab])

  const checkAuth = async () => {
    // Garantir que só executa no cliente
    if (typeof window === 'undefined') {
      setIsCheckingAuth(false)
      return
    }

    try {
      // Primeiro verificar se existe algum usuário no banco
      const usersCheck = await fetch('/api/users/check')
      const usersData = await usersCheck.json()
      
      if (!usersData.hasUsers) {
        // Não há usuários, redirecionar para setup
        router.push('/admin/setup')
        setIsCheckingAuth(false)
        return
      }

      // Verificar autenticação - versão simplificada primeiro
      const token = localStorage.getItem('admin_token')
      const user = localStorage.getItem('admin_user')
      const expireToken = localStorage.getItem('admin_token_expires')
      
      console.log('[Admin Page] Verificação simplificada:', {
        hasToken: !!token,
        hasUser: !!user,
        hasExpireToken: !!expireToken,
        tokenLength: token?.length,
        tokenPreview: token ? `${token.substring(0, 30)}...` : null,
        expireToken: expireToken,
        userPreview: user ? JSON.parse(user).username : null
      })
      
      // Verificação básica: se tem token e user, permite acesso
      // A validação completa do JWT pode ser feita depois
      if (token && user && expireToken) {
        // Verificar se não expirou
        try {
          const expirationDate = new Date(expireToken)
          const now = new Date()
          
          console.log('[Admin Page] Comparando datas:', {
            now: now.toISOString(),
            expiration: expirationDate.toISOString(),
            diff: expirationDate.getTime() - now.getTime(),
            isValid: now < expirationDate
          })
          
          if (now < expirationDate) {
            console.log('[Admin Page] ✅ Token válido, permitindo acesso')
            setIsAuthenticated(true)
          } else {
            console.log('[Admin Page] ❌ Token expirado')
            clearAuthData()
            window.location.href = '/admin/login'
          }
        } catch (error) {
          console.error('[Admin Page] Erro ao verificar expiração:', error)
          // Se houver erro na data, ainda permite acesso se tiver token e user
          console.log('[Admin Page] ⚠️ Erro na verificação de data, mas tem token e user - permitindo acesso')
          setIsAuthenticated(true)
        }
      } else {
        console.log('[Admin Page] ❌ Faltando dados de autenticação')
        console.log('[Admin Page] Detalhes:', {
          token: token ? 'existe' : 'FALTANDO',
          user: user ? 'existe' : 'FALTANDO',
          expireToken: expireToken ? 'existe' : 'FALTANDO'
        })
        window.location.href = '/admin/login'
      }
    } catch (error) {
      console.error('Erro ao verificar autenticação:', error)
      clearAuthData()
      router.push('/admin/login')
    } finally {
      setIsCheckingAuth(false)
    }
  }

  const handleLogout = () => {
    clearAuthData()
    router.push('/admin/login')
  }

  // ========== ÁUDIOS ==========
  const loadAudios = async () => {
    try {
      const response = await fetch('/api/audios')
      const data = await response.json()
      setAudios(data)
    } catch (error) {
      console.error('Erro ao carregar áudios:', error)
    } finally {
      setLoadingAudios(false)
    }
  }

  const handleAudioFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploadingAudio(true)
    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()
      if (data.url) {
        setAudioFormData({ ...audioFormData, audioUrl: data.url })
        toast.success('Arquivo enviado com sucesso!')
      } else {
        toast.error('Erro ao fazer upload: ' + (data.error || 'Erro desconhecido'))
      }
    } catch (error) {
      console.error('Erro ao fazer upload:', error)
      toast.error('Erro ao fazer upload do arquivo')
    } finally {
      setUploadingAudio(false)
    }
  }

  const handleAudioSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!audioFormData.title || !audioFormData.description || !audioFormData.audioUrl) {
      toast.error('Preencha título, descrição e faça upload do áudio')
      return
    }

    try {
      const url = editingAudio ? `/api/audios/${editingAudio.id}` : '/api/audios'
      const method = editingAudio ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: audioFormData.title,
          description: audioFormData.description,
          audioUrl: audioFormData.audioUrl,
          type: audioFormData.type || null,
        }),
      })

      if (response.ok) {
        toast.success(editingAudio ? 'Áudio atualizado!' : 'Áudio criado!')
        resetAudioForm()
        loadAudios()
      } else {
        const error = await response.json()
        toast.error('Erro: ' + (error.error || 'Erro desconhecido'))
      }
    } catch (error) {
      console.error('Erro ao salvar áudio:', error)
      toast.error('Erro ao salvar áudio')
    }
  }

  const handleAudioEdit = (audio: Audio) => {
    setEditingAudio(audio)
    setAudioFormData({
      title: audio.title,
      description: audio.description,
      audioUrl: audio.audioUrl,
      type: audio.type || '',
    })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleAudioDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja deletar este áudio?')) return

    try {
      const response = await fetch(`/api/audios/${id}`, { method: 'DELETE' })
      if (response.ok) {
        toast.success('Áudio deletado!')
        loadAudios()
      } else {
        toast.error('Erro ao deletar áudio')
      }
    } catch (error) {
      console.error('Erro ao deletar áudio:', error)
      toast.error('Erro ao deletar áudio')
    }
  }

  const resetAudioForm = () => {
    setEditingAudio(null)
    setAudioFormData({
      title: '',
      description: '',
      audioUrl: '',
      type: '',
    })
  }

  // ========== YOUTUBE VIDEOS ==========
  const loadVideos = async () => {
    try {
      setLoadingVideos(true)
      const response = await fetch('/api/youtube')
      
      if (!response.ok) {
        throw new Error(`Erro HTTP: ${response.status}`)
      }
      
      const data = await response.json()
      // Garantir que sempre seja um array
      setVideos(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error('Erro ao carregar vídeos:', error)
      // Em caso de erro, garantir que seja um array vazio
      setVideos([])
    } finally {
      setLoadingVideos(false)
    }
  }

  const handleVideoSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!videoFormData.title || !videoFormData.description || !videoFormData.youtubeUrl) {
      toast.error('Preencha título, descrição e link do YouTube')
      return
    }

    try {
      const url = editingVideo ? `/api/youtube/${editingVideo.id}` : '/api/youtube'
      const method = editingVideo ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: videoFormData.title,
          description: videoFormData.description,
          youtubeUrl: videoFormData.youtubeUrl,
          type: videoFormData.type || null,
        }),
      })

      if (response.ok) {
        toast.success(editingVideo ? 'Vídeo atualizado!' : 'Vídeo criado!')
        resetVideoForm()
        loadVideos()
      } else {
        const error = await response.json()
        toast.error('Erro: ' + (error.error || 'Erro desconhecido'))
      }
    } catch (error) {
      console.error('Erro ao salvar vídeo:', error)
      toast.error('Erro ao salvar vídeo')
    }
  }

  const handleVideoEdit = (video: YouTubeVideo) => {
    setEditingVideo(video)
    setVideoFormData({
      title: video.title,
      description: video.description,
      youtubeUrl: video.youtubeUrl,
      type: video.type || '',
    })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleVideoDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja deletar este vídeo?')) return

    try {
      const response = await fetch(`/api/youtube/${id}`, { method: 'DELETE' })
      if (response.ok) {
        toast.success('Vídeo deletado!')
        loadVideos()
      } else {
        toast.error('Erro ao deletar vídeo')
      }
    } catch (error) {
      console.error('Erro ao deletar vídeo:', error)
      toast.error('Erro ao deletar vídeo')
    }
  }

  const resetVideoForm = () => {
    setEditingVideo(null)
    setVideoFormData({
      title: '',
      description: '',
      youtubeUrl: '',
      type: '',
    })
  }

  const extractYouTubeId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/
    const match = url.match(regExp)
    return match && match[2].length === 11 ? match[2] : null
  }

  // ========== USUÁRIOS ADMIN ==========
  const loadUsers = async () => {
    try {
      setLoadingUsers(true)
      const response = await fetch('/api/users')
      const data = await response.json()
      setUsers(data)
    } catch (error) {
      console.error('Erro ao carregar usuários:', error)
      toast.error('Erro ao carregar usuários')
    } finally {
      setLoadingUsers(false)
    }
  }

  const handleUserSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!userFormData.username || !userFormData.email || !userFormData.password) {
      toast.error('Preencha todos os campos')
      return
    }

    // Validação básica de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(userFormData.email)) {
      toast.error('Email inválido')
      return
    }

    // Validação de senha (mínimo 6 caracteres)
    if (userFormData.password.length < 6) {
      toast.error('A senha deve ter no mínimo 6 caracteres')
      return
    }

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: userFormData.username,
          email: userFormData.email,
          password: userFormData.password,
        }),
      })

      if (response.ok) {
        toast.success('Usuário admin criado com sucesso!')
        resetUserForm()
        loadUsers()
      } else {
        const error = await response.json()
        toast.error('Erro: ' + (error.error || 'Erro desconhecido'))
      }
    } catch (error) {
      console.error('Erro ao criar usuário:', error)
      toast.error('Erro ao criar usuário')
    }
  }

  const handleUserDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja deletar este usuário admin?')) return

    try {
      const response = await fetch(`/api/users/${id}`, { method: 'DELETE' })
      if (response.ok) {
        toast.success('Usuário deletado!')
        loadUsers()
      } else {
        const error = await response.json()
        toast.error('Erro: ' + (error.error || 'Erro ao deletar usuário'))
      }
    } catch (error) {
      console.error('Erro ao deletar usuário:', error)
      toast.error('Erro ao deletar usuário')
    }
  }

  const resetUserForm = () => {
    setUserFormData({
      username: '',
      email: '',
      password: '',
    })
  }

  if (isCheckingAuth) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Verificando autenticação...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Painel Administrativo</h1>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
          >
            Sair
          </button>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="flex gap-4 border-b border-gray-200">
            <button
              onClick={() => setActiveTab('audios')}
              className={`px-6 py-3 font-semibold transition-colors ${
                activeTab === 'audios'
                  ? 'border-b-2 border-gold-yellow text-gold-yellow'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Áudios
            </button>
            <button
              onClick={() => setActiveTab('youtube')}
              className={`px-6 py-3 font-semibold transition-colors ${
                activeTab === 'youtube'
                  ? 'border-b-2 border-gold-yellow text-gold-yellow'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Vídeos do YouTube
            </button>
            <button
              onClick={() => setActiveTab('users')}
              className={`px-6 py-3 font-semibold transition-colors ${
                activeTab === 'users'
                  ? 'border-b-2 border-gold-yellow text-gold-yellow'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Usuários Admin
            </button>
          </div>
        </div>

        {/* Formulário de Áudios */}
        {activeTab === 'audios' && (
          <>
            <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                {editingAudio ? 'Editar Áudio' : 'Adicionar Novo Áudio'}
              </h2>

              <form onSubmit={handleAudioSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Título *
                  </label>
                  <input
                    type="text"
                    value={audioFormData.title}
                    onChange={(e) => setAudioFormData({ ...audioFormData, title: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-yellow focus:border-transparent text-gray-900"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Descrição *
                  </label>
                  <textarea
                    value={audioFormData.description}
                    onChange={(e) => setAudioFormData({ ...audioFormData, description: e.target.value })}
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-yellow focus:border-transparent text-gray-900"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Upload de Áudio *
                  </label>
                  <input
                    type="file"
                    accept="audio/*"
                    onChange={handleAudioFileUpload}
                    disabled={uploadingAudio}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-yellow focus:border-transparent"
                  />
                  {uploadingAudio && <p className="text-sm text-gray-500 mt-1">Enviando...</p>}
                  {audioFormData.audioUrl && (
                    <p className="text-sm text-green-600 mt-1">✓ Arquivo: {audioFormData.audioUrl}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tipo de Serviço
                  </label>
                  <select
                    value={audioFormData.type}
                    onChange={(e) => setAudioFormData({ ...audioFormData, type: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-yellow focus:border-transparent text-gray-900"
                  >
                    <option value="">Selecione...</option>
                    <option value="Locução">Locução</option>
                    <option value="Spot Publicitário">Spot Publicitário</option>
                    <option value="Produção de Áudio">Produção de Áudio</option>
                    <option value="Dublagem">Dublagem</option>
                    <option value="Narração">Narração</option>
                    <option value="Podcast">Podcast</option>
                  </select>
                </div>

                <div className="flex gap-4">
                  <button
                    type="submit"
                    className="px-6 py-3 bg-gold-yellow text-black font-semibold rounded-lg hover:bg-gold transition-colors"
                  >
                    {editingAudio ? 'Atualizar' : 'Criar'} Áudio
                  </button>
                  {editingAudio && (
                    <button
                      type="button"
                      onClick={resetAudioForm}
                      className="px-6 py-3 bg-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-400 transition-colors"
                    >
                      Cancelar
                    </button>
                  )}
                </div>
              </form>
            </div>

            {/* Lista de Áudios */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Áudios Cadastrados</h2>
              {loadingAudios ? (
                <p className="text-gray-500 text-center py-8">Carregando...</p>
              ) : audios.length === 0 ? (
                <p className="text-gray-500 text-center py-8">Nenhum áudio cadastrado ainda.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Título</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Tipo</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      {audios.map((audio) => (
                        <tr key={audio.id} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="py-3 px-4 text-gray-900">{audio.title}</td>
                          <td className="py-3 px-4 text-gray-900">{audio.type || '-'}</td>
                          <td className="py-3 px-4">
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleAudioEdit(audio)}
                                className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors text-sm"
                              >
                                Editar
                              </button>
                              <button
                                onClick={() => handleAudioDelete(audio.id)}
                                className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors text-sm"
                              >
                                Deletar
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        )}

        {/* Formulário de Vídeos do YouTube */}
        {activeTab === 'youtube' && (
          <>
            <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                {editingVideo ? 'Editar Vídeo do YouTube' : 'Adicionar Novo Vídeo do YouTube'}
              </h2>

              <form onSubmit={handleVideoSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Título *
                  </label>
                  <input
                    type="text"
                    value={videoFormData.title}
                    onChange={(e) => setVideoFormData({ ...videoFormData, title: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-yellow focus:border-transparent text-gray-900"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Descrição *
                  </label>
                  <textarea
                    value={videoFormData.description}
                    onChange={(e) => setVideoFormData({ ...videoFormData, description: e.target.value })}
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-yellow focus:border-transparent text-gray-900"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Link do YouTube *
                  </label>
                  <input
                    type="url"
                    value={videoFormData.youtubeUrl}
                    onChange={(e) => setVideoFormData({ ...videoFormData, youtubeUrl: e.target.value })}
                    placeholder="https://www.youtube.com/watch?v=..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-yellow focus:border-transparent text-gray-900"
                    required
                  />
                  {videoFormData.youtubeUrl && extractYouTubeId(videoFormData.youtubeUrl) && (
                    <div className="mt-2">
                      <iframe
                        width="100%"
                        height="200"
                        src={`https://www.youtube.com/embed/${extractYouTubeId(videoFormData.youtubeUrl)}`}
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="rounded-lg"
                      />
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tipo de Serviço
                  </label>
                  <select
                    value={videoFormData.type}
                    onChange={(e) => setVideoFormData({ ...videoFormData, type: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-yellow focus:border-transparent text-gray-900"
                  >
                    <option value="">Selecione...</option>
                    <option value="Locução">Locução</option>
                    <option value="Spot Publicitário">Spot Publicitário</option>
                    <option value="Produção de Áudio">Produção de Áudio</option>
                    <option value="Dublagem">Dublagem</option>
                    <option value="Narração">Narração</option>
                    <option value="Podcast">Podcast</option>
                  </select>
                </div>

                <div className="flex gap-4">
                  <button
                    type="submit"
                    className="px-6 py-3 bg-gold-yellow text-black font-semibold rounded-lg hover:bg-gold transition-colors"
                  >
                    {editingVideo ? 'Atualizar' : 'Criar'} Vídeo
                  </button>
                  {editingVideo && (
                    <button
                      type="button"
                      onClick={resetVideoForm}
                      className="px-6 py-3 bg-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-400 transition-colors"
                    >
                      Cancelar
                    </button>
                  )}
                </div>
              </form>
            </div>

            {/* Lista de Vídeos */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Vídeos do YouTube Cadastrados</h2>
              {loadingVideos ? (
                <p className="text-gray-500 text-center py-8">Carregando...</p>
              ) : videos.length === 0 ? (
                <p className="text-gray-500 text-center py-8">Nenhum vídeo cadastrado ainda.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Título</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Tipo</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Array.isArray(videos) && videos.length > 0 ? (
                        videos.map((video) => (
                          <tr key={video.id} className="border-b border-gray-100 hover:bg-gray-50">
                            <td className="py-3 px-4 text-gray-900">{video.title}</td>
                            <td className="py-3 px-4 text-gray-900">{video.type || '-'}</td>
                            <td className="py-3 px-4">
                              <div className="flex gap-2">
                                <button
                                  onClick={() => handleVideoEdit(video)}
                                  className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors text-sm"
                                >
                                  Editar
                                </button>
                                <button
                                  onClick={() => handleVideoDelete(video.id)}
                                  className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors text-sm"
                                >
                                  Deletar
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={3} className="py-8 text-center text-gray-500">
                            Nenhum vídeo encontrado
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        )}

        {/* Formulário de Usuários Admin */}
        {activeTab === 'users' && (
          <>
            <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Criar Novo Usuário Admin
              </h2>

              <form onSubmit={handleUserSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nome de Usuário *
                  </label>
                  <input
                    type="text"
                    value={userFormData.username}
                    onChange={(e) => setUserFormData({ ...userFormData, username: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-yellow focus:border-transparent text-gray-900"
                    required
                    placeholder="Digite o nome de usuário"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    value={userFormData.email}
                    onChange={(e) => setUserFormData({ ...userFormData, email: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-yellow focus:border-transparent text-gray-900"
                    required
                    placeholder="usuario@exemplo.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Senha * (mínimo 6 caracteres)
                  </label>
                  <input
                    type="password"
                    value={userFormData.password}
                    onChange={(e) => setUserFormData({ ...userFormData, password: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-yellow focus:border-transparent text-gray-900"
                    required
                    minLength={6}
                    placeholder="Digite a senha"
                  />
                </div>

                <div className="flex gap-4">
                  <button
                    type="submit"
                    className="px-6 py-3 bg-gold-yellow text-black font-semibold rounded-lg hover:bg-gold transition-colors"
                  >
                    Criar Usuário Admin
                  </button>
                  <button
                    type="button"
                    onClick={resetUserForm}
                    className="px-6 py-3 bg-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-400 transition-colors"
                  >
                    Limpar
                  </button>
                </div>
              </form>
            </div>

            {/* Lista de Usuários Admin */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Usuários Admin Cadastrados</h2>
              {loadingUsers ? (
                <p className="text-gray-500 text-center py-8">Carregando...</p>
              ) : users.length === 0 ? (
                <p className="text-gray-500 text-center py-8">Nenhum usuário admin cadastrado ainda.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Usuário</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Email</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Função</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Criado em</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((user) => (
                        <tr key={user.id} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="py-3 px-4 font-medium text-gray-900">{user.username}</td>
                          <td className="py-3 px-4 text-gray-900">{user.email}</td>
                          <td className="py-3 px-4">
                            <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm">
                              {user.role}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-sm text-gray-600">
                            {new Date(user.createdAt).toLocaleDateString('pt-BR')}
                          </td>
                          <td className="py-3 px-4">
                            <button
                              onClick={() => handleUserDelete(user.id)}
                              className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors text-sm"
                            >
                              Deletar
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
