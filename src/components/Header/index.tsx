'use client'
import { useScroll } from '../../hooks/useScroll'
import { motion } from 'framer-motion'
import logo from '../../../public/assets/logoP2.png'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import Link from 'next/link'

const servicesDropdown = [
    {
        title: 'Espera Telefônica e URA',
        href: '/servicos/espera-telefonica',
        icon: '📞',
    },
    {
        title: 'Gravação de Locução',
        href: '/servicos/gravacao-de-locucao',
        icon: '🎙️',
    },
    {
        title: 'Locução em Inglês Nativo',
        href: '/servicos/locucao-em-ingles-nativo',
        icon: '🌎',
    },
    {
        title: 'Locução em Espanhol Nativo',
        href: '/servicos/locucao-em-espanhol-nativo',
        icon: '🌎',
    },
]

export const Header = () => {
    useScroll()
    const pathname = usePathname()
    const [isServicesHovered, setIsServicesHovered] = useState(false)
    const [isMobileServicesOpen, setIsMobileServicesOpen] = useState(false)

    // Função para retornar o href correto para seções da home
    const getSectionHref = (section: string) => {
        // Se estiver na home, usa apenas a âncora
        // Se estiver em outra página, redireciona para home com a âncora
        return pathname === '/' ? `#${section}` : `/#${section}`
    }

    // Handler para navegar para seções quando estiver em outra página
    const handleSectionClick = (e: React.MouseEvent<HTMLAnchorElement>, section: string) => {
        if (pathname !== '/') {
            // Se não estiver na home, deixa o link redirecionar normalmente
            // O Next.js vai navegar para /#section e depois podemos rolar
            return
        }
        // Se estiver na home, previne o comportamento padrão e rola suavemente
        e.preventDefault()
        const element = document.getElementById(section)
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }
    }

    const useMenuMobile = () => {
        const mobileMenu = document.querySelector(
            '#mobileMenu'
        ) as HTMLButtonElement

        const navList = document.querySelector(
            '#mobileNav'
        ) as HTMLElement

        const isActive = mobileMenu?.classList.contains('active')
        
        mobileMenu?.classList.toggle('active')
        navList?.classList.toggle('active')
        
        // Se o menu está fechando, também fecha o dropdown de serviços
        if (isActive) {
            setIsMobileServicesOpen(false)
        }
    }
    
    // Fechar dropdown quando o pathname mudar (navegação)
    useEffect(() => {
        setIsMobileServicesOpen(false)
    }, [pathname])

    return (
        <motion.header
            initial={{ opacity: 0, y: -100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -100 }}
            transition={{ duration: 0.5 }}
            id="top"
            className="fixed top-0 left-0 w-full z-50 bg-dark-charcoal/80 backdrop-blur-md"
        >
            <div id="header" className="container mx-auto px-4 md:px-8 lg:px-16 py-6 flex items-center justify-between">
                <a href="/" className="flex items-center gap-3" aria-label="P2 Áudio - Página inicial">
                    <Image src={logo} alt="Logo P2 Áudio - Produtora de Áudio Profissional" width={50} height={50} />
                    <span className="text-white font-bold text-xl">P2Audio</span>
                </a>

                <div className="flex items-center gap-4">
                    <nav>
                        <ul 
                            id="navigation" 
                            className="hidden md:flex items-center gap-8 list-none"
                        >
                        <li>
                            <a 
                                id="nav-inicio"
                                href="/" 
                                className={`text-white hover:text-gold-yellow transition-colors text-base font-medium relative py-2 px-1 uppercase ${
                                    pathname === '/' && !pathname?.startsWith('/servicos') ? 'active' : ''
                                }`}
                            >
                                Home
                            </a>
                        </li>
                        <li 
                            className="relative"
                            onMouseEnter={() => setIsServicesHovered(true)}
                            onMouseLeave={() => setIsServicesHovered(false)}
                        >
                            <a 
                                id="nav-servicos"
                                href="/servicos" 
                                className={`text-white hover:text-gold-yellow transition-colors text-base font-medium relative py-2 px-1 uppercase ${
                                    pathname === '/servicos' || pathname?.startsWith('/servicos/') ? 'active' : ''
                                }`}
                            >
                                Serviços
                            </a>
                            
                            {/* Dropdown Menu */}
                            {isServicesHovered && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    transition={{ duration: 0.2 }}
                                    className="absolute top-full left-0 mt-2 w-64 bg-dark-charcoal rounded-lg shadow-xl border-2 border-gold-yellow/30 z-50 overflow-hidden backdrop-blur-md"
                                >
                                    <div className="py-2">
                                        {servicesDropdown.map((service) => (
                                            <Link
                                                key={service.href}
                                                href={service.href}
                                                className={`flex items-center gap-3 px-4 py-3 text-sm text-white hover:bg-gold-yellow hover:text-black transition-colors ${
                                                    pathname === service.href ? 'bg-gold-yellow/30 text-gold-yellow font-medium' : ''
                                                }`}
                                            >
                                                <span className="text-xl">{service.icon}</span>
                                                <span>{service.title}</span>
                                            </Link>
                                        ))}
                                    </div>
                                </motion.div>
                            )}
                        </li>
                        <li>
                            <a 
                                id="nav-portfolio"
                                href="/portfolio" 
                                className={`text-white hover:text-gold-yellow transition-colors text-base font-medium relative py-2 px-1 uppercase ${
                                    pathname === '/portfolio' ? 'active' : ''
                                }`}
                            >
                                Portfólio
                            </a>
                        </li>
                        <li>
                            <a 
                                id="nav-sobre"
                                href={getSectionHref('sobre')} 
                                onClick={(e) => handleSectionClick(e, 'sobre')}
                                className="text-white hover:text-gold-yellow transition-colors text-base font-medium relative py-2 px-1 uppercase"
                            >
                                Sobre
                            </a>
                        </li>
                        <li>
                            <a 
                                id="nav-contato"
                                href={getSectionHref('contato')} 
                                onClick={(e) => handleSectionClick(e, 'contato')}
                                className="text-white hover:text-gold-yellow transition-colors text-base font-medium relative py-2 px-1 uppercase"
                            >
                                Contato
                            </a>
                        </li>
                        </ul>
                    </nav>

                    <button
                        id="mobileMenu"
                        onClick={useMenuMobile}
                        className="md:hidden flex flex-col gap-1.5 w-8 h-8 justify-center items-center z-50 relative"
                    >
                        <span className="w-6 h-0.5 bg-white transition-all duration-300 origin-center"></span>
                        <span className="w-6 h-0.5 bg-white transition-all duration-300 origin-center"></span>
                        <span className="w-6 h-0.5 bg-white transition-all duration-300 origin-center"></span>
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            <div 
                id="mobileNav"
                className="fixed top-0 left-0 w-full h-screen bg-dark-charcoal z-40 md:hidden opacity-0 pointer-events-none transition-opacity duration-300"
            >
                <ul className="flex flex-col items-center justify-center h-full gap-8 list-none">
                    <li>
                        <a 
                            id="mobile-nav-inicio"
                            href="/" 
                            onClick={useMenuMobile} 
                            className={`text-white text-2xl font-medium hover:text-gold-yellow transition-colors relative py-2 px-1 uppercase ${
                                pathname === '/' && !pathname?.startsWith('/servicos') ? 'active' : ''
                            }`}
                        >
                            Home
                        </a>
                    </li>
                    <li className="w-full">
                        <div className="flex flex-col items-center w-full">
                            <button
                                onClick={() => setIsMobileServicesOpen(!isMobileServicesOpen)}
                                className={`text-white text-2xl font-medium hover:text-gold-yellow transition-colors relative py-2 px-1 uppercase flex items-center gap-2 ${
                                    pathname === '/servicos' || pathname?.startsWith('/servicos/') ? 'active' : ''
                                }`}
                            >
                                <span>Serviços</span>
                                <motion.svg
                                    animate={{ rotate: isMobileServicesOpen ? 180 : 0 }}
                                    transition={{ duration: 0.3 }}
                                    className="w-5 h-5"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </motion.svg>
                            </button>
                            
                            {/* Dropdown de Serviços Mobile */}
                            <motion.div
                                initial={false}
                                animate={{
                                    height: isMobileServicesOpen ? 'auto' : 0,
                                    opacity: isMobileServicesOpen ? 1 : 0,
                                }}
                                transition={{ duration: 0.3, ease: 'easeInOut' }}
                                className="overflow-hidden w-full max-w-xs"
                            >
                                <div className="pt-4 pb-2 space-y-2">
                                    {servicesDropdown.map((service) => (
                                        <Link
                                            key={service.href}
                                            href={service.href}
                                            onClick={() => {
                                                setIsMobileServicesOpen(false)
                                                useMenuMobile()
                                            }}
                                            className={`flex items-center gap-3 px-4 py-3 text-lg text-white hover:bg-gold-yellow hover:text-black transition-colors rounded-lg ${
                                                pathname === service.href ? 'bg-gold-yellow/30 text-gold-yellow font-medium' : ''
                                            }`}
                                        >
                                            <span className="text-2xl">{service.icon}</span>
                                            <span>{service.title}</span>
                                        </Link>
                                    ))}
                                </div>
                            </motion.div>
                        </div>
                    </li>
                    <li>
                        <a 
                            id="mobile-nav-portfolio"
                            href="/portfolio" 
                            onClick={useMenuMobile} 
                            className={`text-white text-2xl font-medium hover:text-gold-yellow transition-colors relative py-2 px-1 uppercase ${
                                pathname === '/portfolio' ? 'active' : ''
                            }`}
                        >
                            Portfólio
                        </a>
                    </li>
                    <li>
                        <a 
                            id="mobile-nav-sobre"
                            href={getSectionHref('sobre')} 
                            onClick={(e) => {
                                handleSectionClick(e, 'sobre')
                                useMenuMobile()
                            }}
                            className="text-white text-2xl font-medium hover:text-gold-yellow transition-colors relative py-2 px-1 uppercase"
                        >
                            Sobre
                        </a>
                    </li>
                    <li>
                        <a 
                            id="mobile-nav-contato"
                            href={getSectionHref('contato')} 
                            onClick={(e) => {
                                handleSectionClick(e, 'contato')
                                useMenuMobile()
                            }}
                            className="text-white text-2xl font-medium hover:text-gold-yellow transition-colors relative py-2 px-1 uppercase"
                        >
                            Contato
                        </a>
                    </li>
                </ul>
            </div>

            <style jsx global>{`
                #mobileMenu {
                    position: relative;
                }
                #mobileMenu.active span:nth-child(1) {
                    position: absolute;
                    transform: rotate(45deg);
                    top: 50%;
                    left: 50%;
                    margin-left: -12px;
                    margin-top: -1px;
                }
                #mobileMenu.active span:nth-child(2) {
                    opacity: 0;
                    transform: scaleX(0);
                }
                #mobileMenu.active span:nth-child(3) {
                    position: absolute;
                    transform: rotate(-45deg);
                    top: 50%;
                    left: 50%;
                    margin-left: -12px;
                    margin-top: -1px;
                }
                #mobileNav.active {
                    opacity: 1 !important;
                    pointer-events: all !important;
                }
                /* Estilo para link ativo no desktop */
                #navigation a.active::after {
                    content: '';
                    position: absolute;
                    bottom: 0;
                    left: 0;
                    width: 100%;
                    height: 3px;
                    background-color: #FFD700;
                    border-radius: 2px;
                }
                /* Dropdown de serviços */
                #navigation li.relative:hover > a {
                    color: #FFD700;
                }
                /* Estilo para link ativo no mobile */
                #mobileNav a.active::after {
                    content: '';
                    position: absolute;
                    bottom: 0;
                    left: 50%;
                    transform: translateX(-50%);
                    width: 80%;
                    height: 3px;
                    background-color: #FFD700;
                    border-radius: 2px;
                }
                #navigation a.active,
                #mobileNav a.active {
                    color: #FFD700;
                }
            `}</style>
        </motion.header>
    )
}
