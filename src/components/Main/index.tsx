import { Hero } from '../Hero'
import { Services } from '../Services'
import { Portfolio } from '../Portfolio'
import { About } from '../About'
import { Footer } from '../Footer'
import { Contact } from '../Contact'
import { BoxArrowUp } from './BoxArrowUp'

export const Main = () => {
    return (
        <main className="min-h-screen">
            <Hero />
            <Services />
            <Portfolio />
            <About />
            <Contact />
            <Footer />
            <BoxArrowUp />
        </main>
    )
}
