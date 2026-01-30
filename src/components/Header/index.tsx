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
        icon: 'EN',
    },
    {
        title: 'Locução em Espanhol Nativo',
        href: '/servicos/locucao-em-espanhol-nativo',
        icon: 'ES',
    },
    {
        title: 'Locução em Outros Idiomas',
        href: '/servicos/locucao-em-outros-idiomas',
        icon: '🌍',
    },
]

export const Header = () => {
    useScroll()
    const pathname = usePathname()
    const [isServicesDropdownOpen, setIsServicesDropdownOpen] = useState(false)
    const [isMobileServicesOpen, setIsMobileServicesOpen] = useState(false)
    const [isMounted, setIsMounted] = useState(false)

    // Marcar como montado após hidratação para evitar mismatch de classes
    useEffect(() => {
        setIsMounted(true)
    }, [])

    // Função para obter classe "active" apenas após hidratação
    const getActiveClass = (isActive: boolean) => {
        return isMounted && isActive ? 'active' : ''
    }

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
        setIsServicesDropdownOpen(false)
    }, [pathname])
    
    // Fechar dropdown ao clicar fora (desktop)
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as HTMLElement
            if (isServicesDropdownOpen && !target.closest('li.relative')) {
                setIsServicesDropdownOpen(false)
            }
        }
        
        if (isServicesDropdownOpen) {
            document.addEventListener('mousedown', handleClickOutside)
        }
        
        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [isServicesDropdownOpen])

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
                    <Image 
                        src={logo} 
                        alt="Logo P2 Áudio - Produtora de Áudio Profissional" 
                        width={50} 
                        height={50}
                        priority
                        style={{ height: 'auto' }}
                    />
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
                                    getActiveClass(pathname === '/' && !pathname?.startsWith('/servicos'))
                                }`}
                            >
                                Home
                            </a>
                        </li>
                        <li className="relative group">
                            <div className="flex items-center gap-0">
                                <Link
                                    href="/servicos"
                                    className={`text-white hover:text-gold-yellow transition-colors text-base font-medium relative py-2 px-1 uppercase ${
                                        getActiveClass(pathname === '/servicos' || pathname?.startsWith('/servicos/'))
                                    }`}
                                >
                                    Serviços
                                </Link>
                                <button
                                    onClick={(e) => {
                                        e.preventDefault()
                                        e.stopPropagation()
                                        setIsServicesDropdownOpen(!isServicesDropdownOpen)
                                    }}
                                    className={`transition-colors p-2 flex items-center touch-manipulation group-hover:text-gold-yellow ${
                                        pathname === '/servicos' || pathname?.startsWith('/servicos/') 
                                            ? 'text-gold-yellow hover:text-gold-yellow' 
                                            : 'text-white hover:text-gold-yellow'
                                    }`}
                                    aria-label="Abrir menu de serviços"
                                >
                                    <motion.svg
                                        animate={{ rotate: isServicesDropdownOpen ? 180 : 0 }}
                                        transition={{ duration: 0.3 }}
                                        className="w-5 h-5"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </motion.svg>
                                </button>
                            </div>
                            
                            {/* Dropdown Menu */}
                            {isServicesDropdownOpen && (
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
                                                onClick={() => setIsServicesDropdownOpen(false)}
                                                className={`flex items-center gap-3 px-4 py-3 text-sm text-white hover:bg-gold-yellow/20 hover:text-gold-yellow transition-colors ${
                                                    pathname === service.href ? 'bg-gold-yellow/30 text-gold-yellow font-medium' : ''
                                                }`}
                                            >
                                                {service.icon === 'EN' || service.icon === 'ES' ? (
                                                    <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                                                        pathname === service.href 
                                                            ? 'bg-gold-yellow/60 text-white' 
                                                            : 'bg-gold-yellow/40 text-white'
                                                    }`}>{service.icon}</span>
                                                ) : (
                                                    <span className="text-xl">{service.icon}</span>
                                                )}
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
                                    getActiveClass(pathname === '/portfolio')
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
                                getActiveClass(pathname === '/' && !pathname?.startsWith('/servicos'))
                            }`}
                        >
                            Home
                        </a>
                    </li>
                    <li className="w-full group">
                        <div className="flex flex-col items-center w-full">
                            <div className="flex items-center gap-0">
                                <Link
                                    href="/servicos"
                                    onClick={useMenuMobile}
                                    className={`text-white text-2xl font-medium hover:text-gold-yellow transition-colors relative py-2 px-1 uppercase ${
                                        getActiveClass(pathname === '/servicos' || pathname?.startsWith('/servicos/'))
                                    }`}
                                >
                                    Serviços
                                </Link>
                                <button
                                    onClick={(e) => {
                                        e.preventDefault()
                                        e.stopPropagation()
                                        setIsMobileServicesOpen(!isMobileServicesOpen)
                                    }}
                                    className={`transition-colors p-2 flex items-center touch-manipulation group-hover:text-gold-yellow ${
                                        pathname === '/servicos' || pathname?.startsWith('/servicos/') 
                                            ? 'text-gold-yellow hover:text-gold-yellow' 
                                            : 'text-white hover:text-gold-yellow'
                                    }`}
                                    aria-label="Abrir menu de serviços"
                                >
                                    <motion.svg
                                        animate={{ rotate: isMobileServicesOpen ? 180 : 0 }}
                                        transition={{ duration: 0.3 }}
                                        className="w-6 h-6"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </motion.svg>
                                </button>
                            </div>
                            
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
                                            className={`flex items-center gap-3 px-4 py-3 text-lg text-white hover:bg-gold-yellow/20 hover:text-gold-yellow transition-colors rounded-lg ${
                                                pathname === service.href ? 'bg-gold-yellow/30 text-gold-yellow font-medium' : ''
                                            }`}
                                        >
                                            {service.icon === 'EN' || service.icon === 'ES' ? (
                                                <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
                                                    pathname === service.href 
                                                        ? 'bg-gold-yellow/50 text-white' 
                                                        : 'bg-gold-yellow/30 text-white'
                                                }`}>{service.icon}</span>
                                            ) : (
                                                <span className="text-2xl">{service.icon}</span>
                                            )}
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
                                getActiveClass(pathname === '/portfolio')
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
                    background-color: #C8C034;
                    border-radius: 2px;
                }
                /* Dropdown de serviços */
                #navigation li.relative:hover > a {
                    color: #C8C034;
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
                    background-color: #C8C034;
                    border-radius: 2px;
                }
                #navigation a.active,
                #mobileNav a.active {
                    color: #C8C034;
                }
            `}</style>
        </motion.header>
    )
}
