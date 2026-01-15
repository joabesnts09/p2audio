'use client'
import { motion } from 'framer-motion'
import Link from 'next/link'

export const PortfolioPreview = () => {
    return (
        <section className="py-16 px-4 md:px-8 lg:px-16 bg-gray-50">
            <div className="container mx-auto">
                <div className="grid md:grid-cols-2 gap-8 items-center">
                    {/* Ícone/Visual */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.3 }}
                        className="flex justify-center md:justify-start order-2 md:order-1"
                    >
                        <div className="text-8xl md:text-9xl opacity-60 text-gray-400">
                            🎬
                        </div>
                    </motion.div>

                    {/* Conteúdo */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.3 }}
                        className="order-1 md:order-2"
                    >
                        <h2 className="text-3xl md:text-4xl font-bold text-black mb-4">
                            Nosso Portfólio
                        </h2>
                        <p className="text-gray-700 text-lg leading-relaxed mb-6">
                            Conheça alguns dos nossos projetos realizados. Explore nossa galeria de 
                            trabalhos em produção de áudio, locuções profissionais e vídeos do YouTube. 
                            Veja a qualidade do nosso trabalho em ação.
                        </p>
                        <Link
                            href="/portfolio"
                            className="inline-block px-6 py-3 bg-gold-yellow text-black font-semibold rounded-lg hover:bg-gold transition-colors duration-200 shadow-md hover:shadow-lg"
                        >
                            Ver Portfólio
                        </Link>
                    </motion.div>
                </div>
            </div>
        </section>
    )
}
