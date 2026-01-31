'use client'
import { motion } from 'framer-motion'
import { VideoCard } from './VideoCard'
import { VideoCardSkeleton } from './VideoCardSkeleton'
import { AudioPlayer } from '../Services/AudioPlayer'
import { AudioPlayerSkeleton } from '../Services/AudioPlayerSkeleton'
import { useEffect, useState } from 'react'

interface VideoProject {
    id: string | number
    title: string
    description: string
    youtubeUrl: string
    type: string
}

interface AudioProject {
    id: string | number
    title: string
    description: string
    audioUrl: string
    type: string
    client?: string
    gender?: 'Homem' | 'Mulher'
    fallbackUrl?: string
}

// Função auxiliar para converter ID para número (se necessário)
function normalizeId(id: string | number, index: number): number {
    if (typeof id === 'number') return id
    // Usa o índice como fallback para garantir um número único
    return index + 1
}

// Ordem das seções de áudio
const AUDIO_SECTIONS_ORDER = [
    'Gravação de Locução',
    'Locução em Espanhol Nativo',
    'Locução em Inglês Nativo',
    'Locução em Alemão',
    'Locução em Francês',
    'Locução Português Portugal',
    'Espera Telefônica e URA',
]

export const Portfolio = () => {
    const [videos, setVideos] = useState<VideoProject[]>([])
    const [audios, setAudios] = useState<AudioProject[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        async function loadProjects() {
            try {
                // Buscar vídeos do YouTube
                const videosResponse = await fetch('/api/youtube', { cache: 'no-store' })
                const videosData = videosResponse.ok ? await videosResponse.json() : []

                // Formatar vídeos
                const formattedVideos = videosData.map((video: any, index: number) => ({
                    id: video.id,
                    title: video.title,
                    description: video.description,
                    youtubeUrl: video.youtubeUrl || '',
                    type: video.type || '',
                }))

                setVideos(formattedVideos)

                // Buscar áudios via API route para evitar cache
                let audiosData = []
                try {
                    const audiosResponse = await fetch('/api/data/audio-projects.json', { 
                        cache: 'no-store',
                    })
                    if (audiosResponse.ok) {
                        audiosData = await audiosResponse.json()
                    }
                } catch (error) {
                    console.error('Erro ao carregar áudios:', error)
                }

                // Formatar áudios
                const formattedAudios = audiosData.map((audio: any) => ({
                    id: audio.id,
                    title: audio.title,
                    description: audio.description,
                    audioUrl: audio.audioUrl || '',
                    fallbackUrl: audio.fallbackUrl,
                    type: audio.type || '',
                    client: audio.client,
                    gender: audio.gender,
                }))

                setAudios(formattedAudios)
            } catch (error) {
                console.error('Erro ao carregar projetos:', error)
            } finally {
                setIsLoading(false)
            }
        }
        loadProjects()
    }, [])

    // Agrupar áudios por tipo
    const groupAudiosByType = (): Record<string, AudioProject[]> => {
        const grouped: Record<string, AudioProject[]> = {}
        
        audios.forEach(audio => {
            if (audio.type) {
                if (!grouped[audio.type]) {
                    grouped[audio.type] = []
                }
                grouped[audio.type].push(audio)
            }
        })
        
        return grouped
    }

    const groupedAudios = groupAudiosByType()
    return (
        <section id="portfolio" className="relative">
            {/* Header com Background */}
            <div 
                className="relative py-20 md:py-32 px-4 md:px-8 lg:px-16"
                style={{
                    backgroundImage: 'url(/assets/bg-portifolio.png)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                }}
            >
                <div className="absolute inset-0 bg-black/50"></div>
                <div className="container mx-auto relative z-10">
                    <motion.h1
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className="text-4xl md:text-5xl lg:text-6xl font-bold text-gold-yellow mb-6 text-center"
                    >
                        Portfólio<span className="sr-only"> - P2 Áudio</span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: 0.1 }}
                        className="text-gray-200 text-lg md:text-xl text-center max-w-3xl mx-auto"
                    >
                        Conheça nossos projetos de produção de áudio profissional. 
                        Explore nossa galeria de trabalhos realizados.
                    </motion.p>
                </div>
            </div>

            {/* Seção de Conteúdo */}
            <div className="py-20 px-4 md:px-8 lg:px-16 bg-white">
                <div className="container mx-auto">
                    {isLoading ? (
                        <>
                            {/* Skeleton para Áudios */}
                            <div className="mb-16">
                                <div className="h-10 bg-gray-200 rounded w-64 mx-auto mb-12 animate-pulse"></div>
                                <div className="space-y-12">
                                    {[1, 2].map((sectionIndex) => (
                                        <div key={sectionIndex} className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                                            <div className="h-8 bg-gray-200 rounded w-1/3 mb-6 pb-3 border-b-2 border-gray-300 animate-pulse"></div>
                                            <div className="grid md:grid-cols-2 gap-4">
                                                {[1, 2, 3, 4].map((index) => (
                                                    <AudioPlayerSkeleton key={index} />
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Skeleton para Vídeos */}
                            <div>
                                <div className="h-10 bg-gray-200 rounded w-64 mx-auto mb-8 animate-pulse"></div>
                                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                                    {[1, 2, 3, 4, 5, 6].map((index) => (
                                        <VideoCardSkeleton key={index} />
                                    ))}
                                </div>
                            </div>
                        </>
                    ) : (
                        <>
                            {/* Seção de Áudios */}
                            {Object.keys(groupedAudios).length > 0 && (
                                <div className="mb-16">
                                    <motion.h3
                                        initial={{ opacity: 0, y: -20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 0.5 }}
                                        className="text-3xl md:text-4xl font-bold text-black mb-12 text-center"
                                    >
                                        Projetos de Áudio
                                    </motion.h3>
                                    
                                    {/* Renderizar seções de áudio na ordem especificada */}
                                    <div className="space-y-12">
                                        {AUDIO_SECTIONS_ORDER.map((sectionType, sectionIndex) => {
                                            const sectionAudios = groupedAudios[sectionType] || []
                                            if (sectionAudios.length === 0) return null

                                            return (
                                                <motion.div
                                                    key={sectionType}
                                                    initial={{ opacity: 0, y: 20 }}
                                                    whileInView={{ opacity: 1, y: 0 }}
                                                    viewport={{ once: true }}
                                                    transition={{ duration: 0.3, delay: sectionIndex * 0.1 }}
                                                    className="bg-gray-50 rounded-xl p-6 border border-gray-200"
                                                >
                                                    <h4 className="text-2xl md:text-3xl font-bold text-black mb-6 pb-3 border-b-2 border-gray-300">
                                                        {sectionType}
                                                    </h4>
                                                    <div className="grid md:grid-cols-2 gap-4">
                                                        {sectionAudios.map((audio) => (
                                                            <AudioPlayer
                                                                key={audio.id}
                                                                id={audio.id}
                                                                audioUrl={audio.audioUrl}
                                                                type={audio.type}
                                                                title={audio.title}
                                                                description={audio.description}
                                                                gender={audio.gender}
                                                                fallbackUrl={audio.fallbackUrl}
                                                            />
                                                        ))}
                                                    </div>
                                                </motion.div>
                                            )
                                        })}
                                    </div>
                                </div>
                            )}

                            {/* Seção de Vídeos */}
                            {videos.length > 0 && (
                                <div>
                                    <motion.h3
                                        initial={{ opacity: 0, y: -20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 0.5 }}
                                        className="text-3xl md:text-4xl font-bold text-black mb-8 text-center"
                                    >
                                        Vídeos do YouTube
                                    </motion.h3>
                                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
                                        {videos.map((video, index) => (
                                            <motion.div
                                                key={video.id}
                                                initial={{ opacity: 0, y: 50 }}
                                                whileInView={{ opacity: 1, y: 0 }}
                                                viewport={{ once: true }}
                                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                                className="h-full"
                                            >
                                                <VideoCard 
                                                    {...video} 
                                                    id={normalizeId(video.id, index)}
                                                />
                                            </motion.div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Mensagem quando não há projetos */}
                            {videos.length === 0 && Object.keys(groupedAudios).length === 0 && (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.5, delay: 0.2 }}
                                    className="text-center py-12"
                                >
                                    <p className="text-gray-700 text-lg mb-4">
                                        Em breve, nossos projetos e trabalhos realizados estarão disponíveis aqui.
                                    </p>
                                    <div className="inline-block p-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                                        <div className="text-6xl mb-4">🎬</div>
                                        <p className="text-gray-600">Projetos em breve</p>
                                    </div>
                                </motion.div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </section>
    )
}
