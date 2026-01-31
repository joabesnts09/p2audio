'use client'
import { motion } from 'framer-motion'
import { AudioPlayer } from './AudioPlayer'
import { AudioPlayerSkeleton } from './AudioPlayerSkeleton'
import { useEffect, useState } from 'react'
import Link from 'next/link'

interface AudioProject {
    id: string | number
    title: string
    description: string
    audioUrl: string
    type: string
    client?: string
    gender?: 'Homem' | 'Mulher'
    duration?: string
    coverImage?: string
    fallbackUrl?: string
}

interface ServicePageProps {
    serviceTitle: string
    serviceDescription: string
    serviceIcon: string
    serviceType: string // Tipo de áudio para filtrar
    metaDescription?: string
    sectionTitle?: string // Título customizado para a seção de áudios
}

export const ServicePage = ({
    serviceTitle,
    serviceDescription,
    serviceIcon,
    serviceType,
    metaDescription,
    sectionTitle,
}: ServicePageProps) => {
    const [audios, setAudios] = useState<AudioProject[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [selectedGenderFilter, setSelectedGenderFilter] = useState<string>('Todos')
    const [isGenderFilterOpen, setIsGenderFilterOpen] = useState(false)

    useEffect(() => {
        async function loadAudios() {
            try {
                // Carregar via API route para evitar cache
                let audiosData = []
                try {
                    const response = await fetch('/api/data/services-audio-projects.json', { 
                        cache: 'no-store',
                    })
                    if (response.ok) {
                        audiosData = await response.json()
                    }
                } catch (error) {
                    console.error('Erro ao carregar áudios de serviços:', error)
                }

                // Filtrar apenas áudios do tipo deste serviço
                const filteredAudios = audiosData
                    .filter((audio: any) => {
                        // Normalizar strings para comparação
                        const normalizeString = (str: string): string => {
                            return str.toLowerCase()
                                .normalize('NFD')
                                .replace(/[\u0300-\u036f]/g, '')
                                .trim()
                        }
                        const audioTypeNormalized = normalizeString(audio.type || '')
                        const serviceTypeNormalized = normalizeString(serviceType)
                        const matches = audioTypeNormalized === serviceTypeNormalized
                        
                        return matches
                    })
                    .map((audio: any) => ({
                        id: audio.id,
                        title: audio.title,
                        description: audio.description,
                        audioUrl: audio.audioUrl || '',
                        fallbackUrl: audio.fallbackUrl,
                        type: audio.type || '',
                        client: audio.client,
                        gender: audio.gender,
                        duration: audio.duration,
                        coverImage: audio.coverImage,
                    }))

                setAudios(filteredAudios)
            } catch (error) {
                console.error('Erro ao carregar áudios de serviços:', error)
            } finally {
                setIsLoading(false)
            }
        }
        loadAudios()
    }, [serviceType])

    // Filtrar por gênero
    const getFilteredAudios = (): AudioProject[] => {
        let filtered = audios
        if (selectedGenderFilter !== 'Todos') {
            filtered = audios.filter(audio => audio.gender === selectedGenderFilter)
        }
        return filtered
    }

    const filteredAudios = getFilteredAudios()

    return (
        <section className="relative">
            {/* Header sem Background */}
            <div className="py-12 md:py-16 px-4 md:px-8 lg:px-16 bg-white">
                <div className="container mx-auto">
                    {/* Breadcrumb */}
                    <nav className="mb-6 text-sm text-gray-600">
                        <Link href="/" className="hover:text-gold-yellow transition-colors">Home</Link>
                        <span className="mx-2">/</span>
                        <Link href="/servicos" className="hover:text-gold-yellow transition-colors">Serviços</Link>
                        <span className="mx-2">/</span>
                        <span className="text-black font-medium">{serviceTitle}</span>
                    </nav>

                    {/* Header do Serviço */}
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <div className="flex items-center gap-4 mb-6">
                            {serviceIcon === 'EN' || serviceIcon === 'ES' ? (
                                <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-gold-yellow flex items-center justify-center flex-shrink-0">
                                    <span className="text-4xl md:text-5xl font-bold text-black">{serviceIcon}</span>
                                </div>
                            ) : (
                                <div className="text-6xl md:text-7xl">{serviceIcon}</div>
                            )}
                            <div>
                                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-black mb-4">
                                    {serviceTitle}
                                </h1>
                                <p className="text-gray-700 text-lg md:text-xl leading-relaxed max-w-3xl">
                                    {serviceDescription}
                                </p>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Seção de Conteúdo */}
            <div className="py-20 px-4 md:px-8 lg:px-16 bg-white">
                <div className="container mx-auto">
                    {/* Filtro de Gênero (se houver áudios) */}
                    {audios.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.2 }}
                            className="mb-6 flex items-center justify-between"
                        >
                            <h2 className="text-2xl md:text-3xl font-bold text-black">
                                {sectionTitle || `${serviceTitle}`}
                            </h2>

                            {/* Filtro de Gênero */}
                            <div className="relative">
                                <button
                                    onClick={() => setIsGenderFilterOpen(!isGenderFilterOpen)}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                                        selectedGenderFilter === 'Todos'
                                            ? 'bg-gray-200 text-gray-700'
                                            : 'bg-gold-yellow text-black shadow-md'
                                    }`}
                                >
                                    <span>{selectedGenderFilter === 'Todos' ? 'Gênero' : selectedGenderFilter}</span>
                                    <svg
                                        className={`w-4 h-4 transition-transform duration-200 ${
                                            isGenderFilterOpen ? 'rotate-180' : ''
                                        }`}
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M19 9l-7 7-7-7"
                                        />
                                    </svg>
                                </button>

                                {isGenderFilterOpen && (
                                    <div className="absolute top-full right-0 mt-2 w-40 bg-white border-2 border-gray-300 rounded-lg shadow-lg z-50">
                                        <div className="py-2">
                                            {['Todos', 'Homem', 'Mulher'].map((gender) => (
                                                <button
                                                    key={gender}
                                                    onClick={() => {
                                                        setSelectedGenderFilter(gender)
                                                        setIsGenderFilterOpen(false)
                                                    }}
                                                    className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 transition-colors ${
                                                        selectedGenderFilter === gender
                                                            ? 'bg-gold-yellow/20 text-black font-medium'
                                                            : 'text-gray-700'
                                                    }`}
                                                >
                                                    {gender}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    )}

                    {/* Fechar dropdown ao clicar fora */}
                    {isGenderFilterOpen && (
                        <div
                            className="fixed inset-0 z-40"
                            onClick={() => setIsGenderFilterOpen(false)}
                        ></div>
                    )}

                    {/* Lista de Áudios */}
                    {isLoading ? (
                        <div className="grid md:grid-cols-2 gap-4">
                            {[1, 2, 3, 4, 5, 6].map((index) => (
                                <AudioPlayerSkeleton key={index} />
                            ))}
                        </div>
                    ) : filteredAudios.length === 0 ? (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.3 }}
                            className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300"
                        >
                            <div className="text-6xl mb-4">{serviceIcon}</div>
                            <p className="text-gray-700 text-lg mb-2">
                                Ainda não temos locutores deste serviço disponíveis.
                            </p>
                            <p className="text-gray-600">
                                Em breve, nossos locutores estarão disponíveis aqui.
                            </p>
                        </motion.div>
                    ) : (
                        <motion.div
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.3 }}
                            className="grid md:grid-cols-2 gap-4"
                        >
                            {filteredAudios.map((audio) => (
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
                        </motion.div>
                    )}

                    {/* Call to Action */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.3, delay: 0.2 }}
                        className="mt-16 bg-gradient-to-r from-gold-yellow/10 to-gold/10 rounded-xl p-8 border border-gold-yellow/20"
                    >
                        <div className="text-center">
                            <h3 className="text-2xl md:text-3xl font-bold text-black mb-4">
                                Interessado em {serviceTitle}?
                            </h3>
                            <p className="text-gray-700 text-lg mb-6 max-w-2xl mx-auto">
                                Entre em contato conosco e solicite um orçamento personalizado. 
                                Nossa equipe está pronta para transformar suas ideias em áudio profissional.
                            </p>
                            <div className="flex flex-wrap gap-4 justify-center">
                                <Link
                                    href="/#contato"
                                    className="px-6 py-3 bg-gold-yellow text-black font-semibold rounded-lg hover:bg-gold transition-colors duration-200 shadow-md hover:shadow-lg"
                                >
                                    Solicitar Orçamento
                                </Link>
                                <Link
                                    href="/servicos"
                                    className="px-6 py-3 bg-white text-black font-semibold rounded-lg border-2 border-gray-300 hover:border-gold-yellow transition-colors duration-200"
                                >
                                    Ver Todos os Serviços
                                </Link>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    )
}
