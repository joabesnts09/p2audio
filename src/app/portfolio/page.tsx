import { Header } from "@/components/Header"
import { Portfolio } from "@/components/Portfolio"
import { Footer } from "@/components/Footer"
import { BoxArrowUp } from "@/components/Main/BoxArrowUp"
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Portfólio - p2audio',
  description: 'Conheça nosso portfólio de projetos de áudio profissional. Áudios institucionais, spots publicitários, dublagens e muito mais.',
  openGraph: {
    title: 'Portfólio - p2audio',
    description: 'Conheça nossos projetos de produção de áudio profissional.',
    type: 'website',
  },
}

export default function PortfolioPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen pt-32">
        <Portfolio />
        <Footer />
        <BoxArrowUp />
      </main>
    </>
  )
}
