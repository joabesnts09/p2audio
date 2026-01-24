import { Header } from "@/components/Header"
import { ServicePage } from "@/components/Services/ServicePage"
import { Footer } from "@/components/Footer"
import { BoxArrowUp } from "@/components/Main/BoxArrowUp"
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Gravação de Locução - P2 Áudio',
  description: 'Gravação profissional de locuções para vídeos institucionais, treinamentos corporativos e materiais educacionais. Vozes claras e adequadas ao público-alvo.',
  openGraph: {
    title: 'Gravação de Locução - P2 Áudio',
    description: 'Gravação profissional de locuções com vozes adequadas ao seu projeto.',
    type: 'website',
  },
}

export default function GravacaoLocucaoPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen pt-32 bg-white">
          <ServicePage
            serviceTitle="Gravação de Locução"
            serviceDescription="Narração profissional para vídeos institucionais, treinamentos corporativos e materiais educacionais. Oferecemos vozes claras e adequadas ao público-alvo, garantindo comunicação eficaz e profissional. Nossa equipe de locutores experientes está pronta para dar vida ao seu projeto com qualidade excepcional."
            serviceIcon="🎙️"
            serviceType="Gravação de Locução"
            metaDescription="Gravação profissional de locuções com vozes adequadas ao seu projeto."
          />
          <Footer />
          <BoxArrowUp />
      </main>
    </>
  )
}
