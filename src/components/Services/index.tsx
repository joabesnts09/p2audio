'use client'
import { motion } from 'framer-motion'
import { AudioPlayer } from './AudioPlayer'
import { useEffect, useState } from 'react'

interface AudioProject {
    id: string | number
    title: string
    description: string
    audioUrl: string
    type: string
    client?: string
    duration?: string
    coverImage?: string
}

interface Service {
    title: string
    description: string
    icon: string
}

const services: Service[] = [
    {
        title: 'Locuções Institucionais e Instrucionais',
        description:
            'Narração profissional para vídeos institucionais, treinamentos corporativos e materiais educacionais. Vozes claras e adequadas ao público-alvo, garantindo comunicação eficaz e profissional.',
        icon: '🎙️',
    },
    {
        title: 'Espera Telefônica e URA',
        description:
            'Produção de mensagens de espera telefônica e sistemas de URA (Unidade de Resposta Audível). Áudios claros e profissionais que melhoram a experiência do cliente durante a espera.',
        icon: '📞',
    },
    {
        title: 'E-learning e E-book',
        description:
            'Narração especializada para cursos online e audiolivros. Produção de conteúdo educacional com vozes adequadas ao tema, garantindo engajamento e compreensão do conteúdo.',
        icon: '📚',
    },
    {
        title: 'Dublagem',
        description:
            'Serviços completos de dublagem para vídeos, animações e conteúdos audiovisuais. Sincronização perfeita com a imagem, mantendo a naturalidade e expressividade da obra original.',
        icon: '🎬',
    },
    {
        title: 'Spot Publicitário',
        description:
            'Criação e produção de spots publicitários para rádio, TV e mídias digitais. Desenvolvimento de roteiros criativos e produção de áudio de alta qualidade que impacta e converte.',
        icon: '📻',
    },
    {
        title: 'Revisão e Tradução de Texto',
        description:
            'Serviços de revisão e tradução de textos em múltiplos idiomas. Garantimos precisão linguística e adequação cultural, essenciais para produções de áudio de qualidade internacional.',
        icon: '🌐',
    },
]

export const Services = () => {
    const [audios, setAudios] = useState<AudioProject[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [selectedFilter, setSelectedFilter] = useState<string>('Todos')
    const [isFilterOpen, setIsFilterOpen] = useState(false)

    useEffect(() => {
        async function loadAudios() {
            try {
                const response = await fetch('/api/audios', { cache: 'no-store' })
                const audiosData = response.ok ? await response.json() : []

                const formattedAudios = audiosData.map((audio: any, index: number) => ({
                    id: audio.id,
                    title: audio.title,
                    description: audio.description,
                    audioUrl: audio.audioUrl || '',
                    type: audio.type || '',
                    client: audio.client,
                    duration: audio.duration,
                    coverImage: audio.coverImage,
                }))

                setAudios(formattedAudios)
            } catch (error) {
                console.error('Erro ao carregar áudios:', error)
            } finally {
                setIsLoading(false)
            }
        }
        loadAudios()
    }, [])

    // Obter todos os tipos únicos de áudio dos dados
    const getUniqueAudioTypes = (): string[] => {
        const types = audios.map(audio => audio.type).filter(Boolean)
        const uniqueTypes = Array.from(new Set(types))
        
        // Tipos possíveis do schema (caso não existam nos dados ainda)
        const possibleTypes = [
            'Locução',
            'Spot Publicitário',
            'Produção de Áudio',
            'Dublagem',
            'Narração',
            'Podcast',
            'E-book Narrado',
        ]
        
        // Combinar tipos únicos dos dados com tipos possíveis, removendo duplicatas
        const allTypes = Array.from(new Set([...uniqueTypes, ...possibleTypes]))
        return allTypes.sort()
    }

    // Função para normalizar strings para comparação
    const normalizeString = (str: string): string => {
        return str.toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '') // Remove acentos
            .trim()
    }

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

    // Obter tipos de áudio que devem ser exibidos (baseado no filtro)
    const getTypesToShow = (): string[] => {
        const grouped = groupAudiosByType()
        const allTypes = Object.keys(grouped).sort()
        
        if (selectedFilter === 'Todos') {
            return allTypes
        }
        
        // Se um filtro específico está selecionado, mostrar apenas aquele tipo
        return allTypes.filter(type => 
            normalizeString(type) === normalizeString(selectedFilter)
        )
    }

    return (
        <section id="servicos" className="py-20 px-4 md:px-8 lg:px-16 bg-white relative">
            {/* Decorative pattern - right side */}
            <div className="absolute right-0 top-0 w-32 h-full opacity-10 hidden lg:block z-0">
                <div className="w-full h-full bg-gradient-to-l from-black to-transparent">
                    <div className="w-full h-full" style={{
                        backgroundImage: `repeating-linear-gradient(
                            45deg,
                            transparent,
                            transparent 10px,
                            rgba(0,0,0,0.1) 10px,
                            rgba(0,0,0,0.1) 20px
                        )`,
                    }}></div>
                </div>
            </div>

            <div className="container mx-auto relative z-10">
                <motion.h1
                    initial={{ opacity: 0, y: -10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-50px' }}
                    transition={{ duration: 0.15 }}
                    className="text-4xl md:text-5xl font-bold text-black mb-12 text-center"
                >
                    Serviços - <span className="text-gold-yellow">P2 Áudio</span>
                </motion.h1>

                {/* Seção de Cards de Serviços */}
                <div className="mb-16">
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                        {services.map((service, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 10 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: '-50px' }}
                                transition={{ duration: 0.15, delay: index * 0.02 }}
                                className="bg-white rounded-lg p-4 md:p-5 border border-gray-200 hover:border-gold-yellow transition-all duration-200 hover:shadow-md"
                            >
                                <div className="flex flex-col items-center text-center">
                                    <div className="text-3xl md:text-4xl mb-3">{service.icon}</div>
                                    <h3 className="text-lg md:text-xl font-bold text-black mb-2">
                                        {service.title}
                                    </h3>
                                    <p className="text-gray-600 text-sm leading-relaxed">
                                        {service.description}
                                    </p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Cabeçalho da Listagem com Filtro */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true, margin: '-50px' }}
                    transition={{ duration: 0.1 }}
                    className="mb-6 pb-4 border-b-2 border-gray-300 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                >
                    {/* Título à Esquerda */}
                    <h3 className="text-2xl md:text-3xl font-bold text-black">
                        Projetos de Áudio
                    </h3>

                    {/* Filtro à Direita */}
                    <div className="relative">
                        <button
                            onClick={() => setIsFilterOpen(!isFilterOpen)}
                            className={`px-6 py-3 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2 min-w-[200px] justify-between ${
                                selectedFilter === 'Todos'
                                    ? 'bg-gold-yellow text-black shadow-md'
                                    : 'bg-white text-gray-700 border-2 border-gray-300 hover:border-gold-yellow'
                            }`}
                        >
                            <span>{selectedFilter}</span>
                            <svg
                                className={`w-5 h-5 transition-transform duration-200 ${
                                    isFilterOpen ? 'rotate-180' : ''
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

                        {/* Dropdown Menu */}
                        {isFilterOpen && (
                            <div className="absolute top-full right-0 mt-2 w-full bg-white border-2 border-gray-300 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
                                <div className="py-2">
                                    <button
                                        onClick={() => {
                                            setSelectedFilter('Todos')
                                            setIsFilterOpen(false)
                                        }}
                                        className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 transition-colors ${
                                            selectedFilter === 'Todos'
                                                ? 'bg-gold-yellow/20 text-black font-medium'
                                                : 'text-gray-700'
                                        }`}
                                    >
                                        Todos
                                    </button>
                                    <div className="border-t border-gray-200 my-1"></div>
                                    {getUniqueAudioTypes().map((type) => (
                                        <button
                                            key={type}
                                            onClick={() => {
                                                setSelectedFilter(type)
                                                setIsFilterOpen(false)
                                            }}
                                            className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 transition-colors ${
                                                selectedFilter === type
                                                    ? 'bg-gold-yellow/20 text-black font-medium'
                                                    : 'text-gray-700'
                                            }`}
                                        >
                                            {type}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </motion.div>

                {/* Fechar dropdown ao clicar fora */}
                {isFilterOpen && (
                    <div
                        className="fixed inset-0 z-40"
                        onClick={() => setIsFilterOpen(false)}
                    ></div>
                )}

                {/* Containers de Áudios Agrupados por Tipo */}
                {!isLoading && (() => {
                    const groupedAudios = groupAudiosByType()
                    const typesToShow = getTypesToShow()
                    
                    if (typesToShow.length === 0) {
                        return (
                            <div className="text-center py-12 text-gray-500">
                                <p>Nenhum projeto encontrado para o filtro selecionado.</p>
                            </div>
                        )
                    }
                    
                    return (
                        <div className="space-y-8">
                            {typesToShow.map((type, typeIndex) => {
                                const typeAudios = groupedAudios[type] || []
                                
                                if (typeAudios.length === 0) return null
                                
                                return (
                                    <motion.div
                                        key={type}
                                        initial={{ opacity: 0, y: 5 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true, margin: '-50px' }}
                                        transition={{ duration: 0.15, delay: typeIndex * 0.03 }}
                                        className="bg-gray-50 rounded-xl p-6 border border-gray-200"
                                    >
                                        {/* Título do Tipo */}
                                        <h4 className="text-xl md:text-2xl font-bold text-black mb-4 pb-3 border-b border-gray-300">
                                            {type}
                                        </h4>
                                        
                                        {/* Grid de Players de Áudio (2 colunas) */}
                                        <div className="grid md:grid-cols-2 gap-4 mt-4">
                                            {typeAudios.map((audio) => (
                                                <AudioPlayer
                                                    key={audio.id}
                                                    id={audio.id}
                                                    audioUrl={audio.audioUrl}
                                                    type={audio.type}
                                                    title={audio.title}
                                                    description={audio.description}
                                                />
                                            ))}
                                        </div>
                                    </motion.div>
                                )
                            })}
                        </div>
                    )
                })()}

                {/* Mensagem quando não há áudios */}
                {!isLoading && audios.length === 0 && (
                    <div className="text-center py-12 text-gray-500">
                        <p>Em breve, nossos projetos estarão disponíveis aqui.</p>
                    </div>
                )}
            </div>
        </section>
    )
}
