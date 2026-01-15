'use client'
import { motion } from 'framer-motion'
import { VideoCard } from './VideoCard'
import { useEffect, useState } from 'react'

interface VideoProject {
    id: string | number
    title: string
    description: string
    youtubeUrl: string
    type: string
}

// Função auxiliar para converter ID do Sanity para número (se necessário)
function normalizeId(id: string | number, index: number): number {
    if (typeof id === 'number') return id
    // Usa o índice como fallback para garantir um número único
    return index + 1
}

export const Portfolio = () => {
    const [videos, setVideos] = useState<VideoProject[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        async function loadProjects() {
            try {
                // Buscar apenas vídeos do YouTube
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
            } catch (error) {
                console.error('Erro ao carregar projetos:', error)
            } finally {
                setIsLoading(false)
            }
        }
        loadProjects()
    }, [])
    return (
        <section id="portfolio" className="py-20 px-4 md:px-8 lg:px-16 bg-white">
            <div className="container mx-auto">
                <motion.h1
                    initial={{ opacity: 0, y: -20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="text-4xl md:text-5xl font-bold text-black mb-4 text-center"
                >
                    Portfólio - <span className="text-gold-yellow">P2 Áudio</span>
                </motion.h1>

                {isLoading ? (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="text-center py-12"
                    >
                        <p className="text-gray-700 text-lg">Carregando projetos...</p>
                    </motion.div>
                ) : (
                    <>
                        {/* Seção de Vídeos */}
                        {videos.length > 0 && (
                            <div className="mt-12">
                                <motion.h3
                                    initial={{ opacity: 0, y: -20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.5 }}
                                    className="text-3xl md:text-4xl font-bold text-black mb-8 text-center"
                                >
                                    Vídeos do YouTube
                                </motion.h3>
                                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                                    {videos.map((video, index) => (
                                        <motion.div
                                            key={video.id}
                                            initial={{ opacity: 0, y: 50 }}
                                            whileInView={{ opacity: 1, y: 0 }}
                                            viewport={{ once: true }}
                                            transition={{ duration: 0.5, delay: index * 0.1 }}
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
                        {videos.length === 0 && (
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
        </section>
    )
}
