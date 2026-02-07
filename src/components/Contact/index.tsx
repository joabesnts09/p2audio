'use client'
import { motion } from 'framer-motion'
import { useState, FormEvent } from 'react'
import emailjs from '@emailjs/browser'
import toast from 'react-hot-toast'

export const Contact = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    })
    const [isLoading, setIsLoading] = useState(false)

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
    }

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setIsLoading(true)

        try {
            const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || ''
            const templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID || ''
            const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || ''

            if (!serviceId || !templateId || !publicKey) {
                throw new Error('Configuração do EmailJS não encontrada. Verifique as variáveis de ambiente no arquivo .env.local')
            }

            // Preparar parâmetros do template - usar as variáveis exatas que o template espera
            const now = new Date()
            const tempo = now.toLocaleString('pt-BR', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            })

            const templateParams: Record<string, string> = {
                // Variáveis que o template está usando (baseado na imagem)
                title: formData.subject, // Template usa {{title}} no assunto
                name: formData.name, // Template usa {{name}}
                email: formData.email, // Template usa {{email}} no "Responder a"
                mensagem: formData.message, // Template usa {{mensagem}}
                tempo: tempo, // Template usa {{tempo}}
                
                // Variáveis padrão do EmailJS (para compatibilidade)
                from_name: formData.name,
                from_email: formData.email,
                subject: formData.subject,
                message: formData.message,
                
                // Variáveis alternativas
                user_name: formData.name,
                user_email: formData.email,
                'nome do usuário': formData.name,
                'email do usuário': formData.email,
                
                // Email de destino
                to_email: process.env.NEXT_PUBLIC_RECEIVER_EMAIL || '',
                reply_to: formData.email,
            }

            console.log('📧 Enviando email com parâmetros:', {
                serviceId,
                templateId,
                receiverEmail: process.env.NEXT_PUBLIC_RECEIVER_EMAIL,
                templateParams
            })

            const result = await emailjs.send(
                serviceId,
                templateId,
                templateParams,
                publicKey
            )

            console.log('✅ Resposta do EmailJS:', {
                status: result.status,
                text: result.text,
                response: result
            })
            
            // Verificar se realmente foi enviado
            if (result.status === 200) {
                toast.success('Mensagem enviada com sucesso! Entraremos em contato em breve.', {
                    duration: 5000,
                })
                console.log('✅ Email enviado com sucesso. Status:', result.status)
            } else {
                console.warn('⚠️ EmailJS retornou status diferente de 200:', result.status)
                toast.success('Mensagem enviada! Verifique sua caixa de entrada e spam.', {
                    duration: 5000,
                })
            }
            
            setFormData({
                name: '',
                email: '',
                subject: '',
                message: ''
            })
        } catch (error: any) {
            console.error('Erro ao enviar email:', error)
            
            let errorMsg = 'Erro ao enviar mensagem. '
            
            if (error?.text) {
                if (error.text.includes('Public Key is invalid') || error.text.includes('400')) {
                    errorMsg = 'Public Key inválida. Verifique o NEXT_PUBLIC_EMAILJS_PUBLIC_KEY no .env.local'
                } else if (error.text.includes('insufficient authentication scopes') || error.text.includes('412')) {
                    errorMsg = 'Erro de autenticação do Gmail. Verifique as configurações do EmailJS ou use outro provedor.'
                } else if (error.text.includes('Invalid template')) {
                    errorMsg = 'Template ID inválido. Verifique o NEXT_PUBLIC_EMAILJS_TEMPLATE_ID no .env.local'
                } else if (error.text.includes('Invalid service')) {
                    errorMsg = 'Service ID inválido. Verifique o NEXT_PUBLIC_EMAILJS_SERVICE_ID no .env.local'
                } else {
                    errorMsg = `Erro: ${error.text}`
                }
            } else if (error?.message) {
                errorMsg = error.message
            } else {
                errorMsg = 'Tente novamente ou entre em contato diretamente pelo telefone.'
            }
            
            toast.error(errorMsg, {
                duration: 6000,
            })
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <section id="contato" className="py-20 px-4 md:px-8 lg:px-16 bg-dark-charcoal texture-overlay">
            <div className="container mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="text-center mb-12"
                >
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                        Vamos conversar
                    </h2>
                    <p className="text-xl text-gray-300">
                        Pronto para levar seu projeto de áudio para o próximo nível?
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="max-w-2xl mx-auto"
                >
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <label htmlFor="name" className="block text-white mb-2 font-medium">
                                    Nome *
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-3 bg-dark-charcoal/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-gold-yellow transition-colors"
                                    placeholder="Seu nome"
                                />
                            </div>
                            <div>
                                <label htmlFor="email" className="block text-white mb-2 font-medium">
                                    Email *
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-3 bg-dark-charcoal/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-gold-yellow transition-colors"
                                    placeholder="seu@email.com"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="subject" className="block text-white mb-2 font-medium">
                                Título da Mensagem *
                            </label>
                            <input
                                type="text"
                                id="subject"
                                name="subject"
                                value={formData.subject}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-3 bg-dark-charcoal/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-gold-yellow transition-colors"
                                placeholder="Assunto da mensagem"
                            />
                        </div>

                        <div>
                            <label htmlFor="message" className="block text-white mb-2 font-medium">
                                Mensagem *
                            </label>
                            <textarea
                                id="message"
                                name="message"
                                value={formData.message}
                                onChange={handleChange}
                                required
                                rows={6}
                                className="w-full px-4 py-3 bg-dark-charcoal/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-gold-yellow transition-colors resize-none"
                                placeholder="Escreva sua mensagem aqui..."
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full px-8 py-4 bg-gradient-to-r from-gold-yellow to-gold text-black font-semibold rounded-lg hover:from-gold hover:to-gold-yellow transition-all duration-300 shadow-lg hover:shadow-gold-yellow/50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? 'Enviando...' : 'Enviar Mensagem'}
                        </button>
                    </form>
                </motion.div>
            </div>
        </section>
    )
}
