'use client'
import { motion } from 'framer-motion'
import Image from 'next/image'

export const Hero = () => {
    return (
        <section 
            id="inicio" 
            className="min-h-screen flex items-center justify-center pt-32 pb-16 px-4 md:px-8 lg:px-16 relative overflow-hidden"
        >
            {/* Background Image */}
            <div className="absolute inset-0 z-0">
                <Image
                    src="/assets/bg-home.jpg"
                    alt="Estúdio de produção de áudio profissional p2audio - Equipamentos de gravação e edição de alta qualidade"
                    fill
                    className="object-cover"
                    priority
                    quality={90}
                    sizes="100vw"
                />
                {/* Dark overlay para legibilidade */}
                <div className="absolute inset-0 bg-dark-charcoal/50"></div>
                {/* Gradient overlay para mais profundidade e foco no centro */}
                <div className="absolute inset-0 bg-gradient-to-b from-dark-charcoal/65 via-dark-charcoal/40 to-dark-charcoal/65"></div>
                {/* Vignette effect - radial gradient para efeito de foco */}
                <div 
                    className="absolute inset-0"
                    style={{
                        background: 'radial-gradient(ellipse at center, transparent 0%, rgba(26, 26, 26, 0.3) 100%)'
                    }}
                ></div>
            </div>

            <div className="container mx-auto relative z-10">
                {/* White frame container */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6 }}
                    className="border-2 border-white p-8 md:p-16 lg:p-20 relative bg-dark-charcoal/85 backdrop-blur-sm shadow-2xl ring-4 ring-white/10"
                >
                    {/* Main headline */}
                    <motion.h1
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="text-white text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-center mb-8 md:mb-12 leading-tight"
                    >
                        <span className="text-gold-yellow">P2 Produtora de Áudio</span> - Som profissional que transforma ideias em experiências sonoras memoráveis
                    </motion.h1>

                    {/* Subheadline */}
                    <motion.p
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                        className="text-gray-300 text-lg md:text-xl text-center mb-8 md:mb-12 max-w-3xl mx-auto"
                    >
                        Produção de áudio de alta qualidade, casting de vozes profissionais e soluções completas para seu projeto
                    </motion.p>

                    {/* REC Indicator */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                        className="flex items-center justify-center gap-4"
                    >
                        <div className="w-4 h-4 md:w-6 md:h-6 bg-gold-yellow rounded-full animate-pulse shadow-lg shadow-gold-yellow/50"></div>
                        <span className="text-white uppercase text-xl md:text-2xl font-bold tracking-wider">
                            REC
                        </span>
                    </motion.div>
                </motion.div>
            </div>
        </section>
    )
}
