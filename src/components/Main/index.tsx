import { Hero } from '../Hero'
import { About } from '../About'
import { Footer } from '../Footer'
import { Contact } from '../Contact'
import { BoxArrowUp } from './BoxArrowUp'
import { ServicesPreview } from './ServicesPreview'
import { PortfolioPreview } from './PortfolioPreview'

export const Main = () => {
    return (
        <main className="min-h-screen">
            <Hero />
            <ServicesPreview />
            <PortfolioPreview />
            <About />
            <Contact />
            <Footer />
            <BoxArrowUp />
        </main>
    )
}
