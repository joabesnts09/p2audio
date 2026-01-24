import { Header } from "@/components/Header"
import { ServicePage } from "@/components/Services/ServicePage"
import { Footer } from "@/components/Footer"
import { BoxArrowUp } from "@/components/Main/BoxArrowUp"
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Espera Telefônica e URA - P2 Áudio',
  description: 'Produção de mensagens de espera telefônica e sistemas de URA (Unidade de Resposta Audível). Áudios claros e profissionais que melhoram a experiência do cliente durante a espera.',
  openGraph: {
    title: 'Espera Telefônica e URA - P2 Áudio',
    description: 'Produção de mensagens de espera telefônica e sistemas de URA profissionais.',
    type: 'website',
  },
}

export default function EsperaTelefonicaPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen pt-32 bg-white">
        <ServicePage
          serviceTitle="Espera Telefônica e URA"
          serviceDescription="Produção de mensagens de espera telefônica e sistemas de URA (Unidade de Resposta Audível). Nossos áudios são claros, profissionais e melhoram significativamente a experiência do cliente durante a espera. Trabalhamos com vozes adequadas ao perfil da sua empresa, garantindo que cada mensagem transmita confiança e profissionalismo."
          serviceIcon="📞"
          serviceType="Espera Telefônica e URA"
          metaDescription="Produção de mensagens de espera telefônica e sistemas de URA profissionais."
        />
        <Footer />
        <BoxArrowUp />
      </main>
    </>
  )
}
