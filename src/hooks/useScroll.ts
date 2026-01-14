export const useScroll = () => {
    if (typeof window !== 'undefined') {
        const handleScroll = () => {
            const headerElement = document.querySelector('#top') as HTMLElement
            const arrouUp = document.querySelector('#arrouUp') as HTMLElement

            if (headerElement) {
                if (window.scrollY > 0) {
                    headerElement.classList.remove('bg-dark-charcoal/80')
                    headerElement.classList.add('bg-dark-charcoal')
                } else {
                    headerElement.classList.remove('bg-dark-charcoal')
                    headerElement.classList.add('bg-dark-charcoal/80')
                }
            }

            const sections = ['inicio', 'servicos', 'portfolio', 'sobre', 'contato']
            const scrollPosition = window.scrollY + 150
            const scrollThreshold = 100

            if (window.scrollY < scrollThreshold) {
                sections.forEach((sectionId) => {
                    const navLink = document.querySelector(`#nav-${sectionId}`) as HTMLElement
                    const mobileNavLink = document.querySelector(`#mobile-nav-${sectionId}`) as HTMLElement
                    
                    if (navLink) {
                        navLink.classList.remove('active')
                    }
                    if (mobileNavLink) {
                        mobileNavLink.classList.remove('active')
                    }
                })
                return
            }

            let activeSection = 'inicio'

            // Verificar cada seção de trás para frente para pegar a última visível
            for (let i = sections.length - 1; i >= 0; i--) {
                const sectionId = sections[i]
                const section = document.getElementById(sectionId)
                
                if (section) {
                    const sectionTop = section.offsetTop
                    const sectionHeight = section.offsetHeight
                    const isLastSection = i === sections.length - 1

                    if (isLastSection) {
                        // Para a última seção, verificar se está visível ou próximo do final
                        const documentHeight = document.documentElement.scrollHeight
                        const windowHeight = window.innerHeight
                        const scrollBottom = window.scrollY + windowHeight
                        
                        // Se passou do início da seção ou está próximo do final da página
                        if (scrollPosition >= sectionTop - 200 || scrollBottom >= documentHeight - 100) {
                            activeSection = sectionId
                            break
                        }
                    } else {
                        // Para outras seções, verificar se está dentro da seção
                        if (scrollPosition >= sectionTop - 100) {
                            activeSection = sectionId
                            break
                        }
                    }
                }
            }

            sections.forEach((sectionId) => {
                const navLink = document.querySelector(`#nav-${sectionId}`) as HTMLElement
                const mobileNavLink = document.querySelector(`#mobile-nav-${sectionId}`) as HTMLElement
                
                if (navLink) {
                    navLink.classList.remove('active')
                }
                if (mobileNavLink) {
                    mobileNavLink.classList.remove('active')
                }
            })

            const activeNavLink = document.querySelector(`#nav-${activeSection}`) as HTMLElement
            const activeMobileNavLink = document.querySelector(`#mobile-nav-${activeSection}`) as HTMLElement

            if (activeNavLink) {
                activeNavLink.classList.add('active')
            }
            if (activeMobileNavLink) {
                activeMobileNavLink.classList.add('active')
            }
        }

        window.addEventListener('scroll', handleScroll)
        handleScroll()
    }
}
