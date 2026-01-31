'use client'
import { motion } from 'framer-motion'

export const About = () => {
    return (
        <section id="sobre" className="py-20 px-4 md:px-8 lg:px-16 bg-dark-charcoal texture-overlay">
            <div className="container mx-auto">
                <motion.h2
                    initial={{ opacity: 0, y: -20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="text-4xl md:text-5xl font-bold text-white mb-12 text-center"
                >
                    Sobre Nós
                </motion.h2>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="max-w-3xl mx-auto text-center"
                >
                    <p className="text-gray-300 text-lg md:text-xl leading-relaxed mb-6">
                        A <span className="text-gold-yellow font-semibold">P2</span> é uma produtora de áudio profissional dedicada a{' '}
                        <span className="text-white font-medium">transformar ideias em experiências sonoras memoráveis</span>.
                    </p>
                    <p className="text-gray-300 text-lg md:text-xl leading-relaxed mb-6">
                        Com <span className="text-gold-yellow font-semibold">10 anos de experiência</span> no mercado fonográfico, 
                        oferecemos soluções completas em produção de áudio, casting de vozes e tradução.
                    </p>
                    <p className="text-gray-300 text-lg md:text-xl leading-relaxed">
                        Nossa missão é entregar <span className="text-white font-medium">qualidade profissional</span> em cada projeto, 
                        sempre respeitando o orçamento e os prazos dos nossos clientes.
                    </p>
                </motion.div>
            </div>
        </section>
    )
}
