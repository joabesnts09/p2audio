'use client'
import { motion } from 'framer-motion'

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
                <motion.h2
                    initial={{ opacity: 0, y: -20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="text-4xl md:text-5xl font-bold text-black mb-12"
                >
                    Serviços
                </motion.h2>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                    {services.map((service, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className="flex flex-col items-center text-center bg-gray-50 rounded-xl p-6 border border-gray-200 hover:border-gold-yellow transition-all duration-300 hover:shadow-lg hover:shadow-gold-yellow/20"
                        >
                            <div className="text-5xl mb-4">{service.icon}</div>
                            <h3 className="text-2xl font-bold text-black mb-4">
                                {service.title}
                            </h3>
                            <p className="text-gray-700 leading-relaxed">
                                {service.description}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}
