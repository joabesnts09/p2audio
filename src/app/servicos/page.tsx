import { Header } from "@/components/Header"
import { Services } from "@/components/Services"
import { Footer } from "@/components/Footer"
import { BoxArrowUp } from "@/components/Main/BoxArrowUp"
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Serviços - p2audio',
  description: 'Conheça nossos serviços de produção de áudio profissional: locuções institucionais, spots publicitários, dublagem, e-learning, espera telefônica e muito mais.',
  openGraph: {
    title: 'Serviços - p2audio',
    description: 'Produção de áudio de alta qualidade. Locuções institucionais, spots publicitários, dublagem, e-learning e muito mais.',
    type: 'website',
  },
}

export default function ServicosPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen pt-32">
        <Services />
        <Footer />
        <BoxArrowUp />
      </main>
    </>
  )
}
