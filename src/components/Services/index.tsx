'use client'
import { motion } from 'framer-motion'
import Link from 'next/link'

interface Service {
    title: string
    description: string
    icon: string
    slug?: string // Slug para página individual
    serviceType?: string // Tipo de áudio para filtrar na página individual
}

const services: Service[] = [
    {
        title: 'Espera Telefônica e URA',
        description:
            'Produção de mensagens de espera telefônica e sistemas de URA (Unidade de Resposta Audível). Áudios claros e profissionais que melhoram a experiência do cliente durante a espera.',
        icon: '📞',
        slug: 'espera-telefonica',
        serviceType: 'Espera Telefônica e URA',
    },
    {
        title: 'Locução em Português',
        description:
            'Narração profissional para vídeos institucionais, treinamentos corporativos, e-learning, dublagens, Voice Over, Spots, dentre outros. Confira alguns talentos do nosso banco de vozes.',
        icon: '🎙️',
        slug: 'locucao-em-portugues',
        serviceType: 'Gravação de Locução',
    },
    {
        title: 'Locução em Inglês Nativo',
        description:
            'Locuções em inglês nativo com locutores profissionais dos Estados Unidos e Inglaterra. Qualidade internacional para seus projetos audiovisuais.',
        icon: 'EN',
        slug: 'locucao-em-ingles-nativo',
        serviceType: 'Locução em Inglês Nativo',
    },
    {
        title: 'Locução em Espanhol Nativo',
        description:
            'Locuções em espanhol nativo com locutores profissionais de diversos países de língua espanhola. Qualidade internacional para seus projetos.',
        icon: 'ES',
        slug: 'locucao-em-espanhol-nativo',
        serviceType: 'Locução em Espanhol Nativo',
    },
    {
        title: 'Locução em Outros Idiomas',
        description:
            'Locuções profissionais em alemão, francês, árabe, cantonês e outros idiomas. Locutores nativos especializados para projetos internacionais de alta qualidade.',
        icon: '🌍',
        slug: 'locucao-em-outros-idiomas',
        serviceType: 'Locução em Outros Idiomas',
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
            'Criação e produção de spots publicitários para rádio, TV e mídias digitais. Produzimos áudio de alta qualidade que impacta e converte.',
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

    return (
        <section id="servicos" className="relative">
            {/* Header com Background */}
            <div 
                className="relative py-20 md:py-32 px-4 md:px-8 lg:px-16"
                style={{
                    backgroundImage: 'url(/assets/bg-servicos.png)',
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
                        Serviços<span className="sr-only"> - P2 Áudio</span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: 0.1 }}
                        className="text-gray-200 text-lg md:text-xl text-center max-w-3xl mx-auto"
                    >
                        Conheça nossos serviços de produção de áudio profissional. 
                        Cada projeto é tratado com dedicação e qualidade excepcional.
                    </motion.p>
                </div>
            </div>

            {/* Seção de Cards */}
            <div className="py-20 px-4 md:px-8 lg:px-16 bg-white">
                <div className="container mx-auto">

                    {/* Grid de Cards de Serviços */}
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                        {services.map((service, index) => {
                            const CardContent = (
                                <div className="flex flex-col items-center text-center h-full">
                                    {service.icon === 'EN' || service.icon === 'ES' ? (
                                        <div className="w-16 h-16 md:w-20 md:h-20 mb-4 rounded-full bg-gold-yellow flex items-center justify-center">
                                            <span className="text-2xl md:text-3xl font-bold text-black">{service.icon}</span>
                                        </div>
                                    ) : (
                                        <div className="text-4xl md:text-5xl mb-4">{service.icon}</div>
                                    )}
                                    <h3 className="text-xl md:text-2xl font-bold text-black mb-3">
                                        {service.title}
                                    </h3>
                                    <p className="text-gray-600 text-base leading-relaxed mb-6">
                                        {service.description}
                                    </p>
                                    {service.slug && (
                                        <span className="text-gold-yellow text-base font-semibold mt-auto inline-flex items-center gap-2">
                                            Saiba mais
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                            </svg>
                                        </span>
                                    )}
                                </div>
                            )

                            return service.slug ? (
                                <Link
                                    key={index}
                                    href={`/servicos/${service.slug}`}
                                >
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true, margin: '-50px' }}
                                        transition={{ duration: 0.3, delay: index * 0.05 }}
                                        className="bg-white rounded-xl p-6 md:p-8 border-2 border-gray-200 hover:border-gold-yellow transition-all duration-300 hover:shadow-xl cursor-pointer h-full flex flex-col"
                                    >
                                        {CardContent}
                                    </motion.div>
                                </Link>
                            ) : (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true, margin: '-50px' }}
                                    transition={{ duration: 0.3, delay: index * 0.05 }}
                                    className="bg-white rounded-xl p-6 md:p-8 border-2 border-gray-200 hover:border-gold-yellow transition-all duration-300 hover:shadow-xl h-full flex flex-col"
                                >
                                    {CardContent}
                                </motion.div>
                            )
                        })}
                    </div>
                </div>
            </div>
        </section>
    )
}
