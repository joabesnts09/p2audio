'use client'
import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

export const ScrollToSection = () => {
    const pathname = usePathname()

    useEffect(() => {
        // Aguardar um pouco para garantir que a página carregou completamente
        const timer = setTimeout(() => {
            const hash = window.location.hash
            
            if (hash && pathname === '/') {
                const sectionId = hash.substring(1) // Remove o #
                const element = document.getElementById(sectionId)
                
                if (element) {
                    // Calcular offset considerando o header fixo
                    const headerHeight = 80 // Altura aproximada do header
                    const elementPosition = element.getBoundingClientRect().top + window.pageYOffset
                    const offsetPosition = elementPosition - headerHeight
                    
                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    })
                }
            }
        }, 300) // Aumentado para garantir que a página carregou

        return () => clearTimeout(timer)
    }, [pathname])

    return null
}
