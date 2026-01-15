'use client'
import { motion } from 'framer-motion'
import Link from 'next/link'

export const ServicesPreview = () => {
    return (
        <section className="py-16 px-4 md:px-8 lg:px-16 bg-white">
            <div className="container mx-auto">
                <div className="grid md:grid-cols-2 gap-8 items-center">
                    {/* Conteúdo */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.3 }}
                    >
                        <h2 className="text-3xl md:text-4xl font-bold text-black mb-4">
                            Nossos Serviços
                        </h2>
                        <p className="text-gray-700 text-lg leading-relaxed mb-6">
                            Oferecemos uma ampla gama de serviços de produção de áudio profissional, 
                            incluindo locuções institucionais, spots publicitários, dublagem, 
                            e-learning e muito mais. Cada projeto é tratado com dedicação e qualidade.
                        </p>
                        <Link
                            href="/servicos"
                            className="inline-block px-6 py-3 bg-gold-yellow text-black font-semibold rounded-lg hover:bg-gold transition-colors duration-200 shadow-md hover:shadow-lg"
                        >
                            Saiba Mais
                        </Link>
                    </motion.div>

                    {/* Ícone/Visual */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.3 }}
                        className="flex justify-center md:justify-end"
                    >
                        <div className="text-8xl md:text-9xl opacity-60 text-gray-400">
                            🎙️
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    )
}
