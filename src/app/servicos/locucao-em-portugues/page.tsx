import { Header } from "@/components/Header"
import { ServicePage } from "@/components/Services/ServicePage"
import { Footer } from "@/components/Footer"
import { BoxArrowUp } from "@/components/Main/BoxArrowUp"
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Locução em Português - P2 Áudio',
  description: 'Locução profissional em português para vídeos institucionais, treinamentos corporativos, e-learning, dublagens, Voice Over e Spots. Banco de vozes de locutores profissionais.',
  openGraph: {
    title: 'Locução em Português - P2 Áudio',
    description: 'Locução profissional em português com vozes adequadas ao seu projeto.',
    type: 'website',
  },
}

export default function GravacaoLocucaoPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen pt-32 bg-white">
          <ServicePage
            serviceTitle="Locução em Português"
            serviceDescription="Narração profissional para vídeos institucionais, treinamentos corporativos, e-learning, dublagens, Voice Over, Spots, dentre outros. Confira alguns talentos do nosso banco de vozes de locutores, dubladores e atores, ou solicite um casting personalizado através do nosso whatsapp ou e-mail."
            serviceIcon="🎙️"
            serviceType="Gravação de Locução"
            metaDescription="Locução profissional em português com vozes adequadas ao seu projeto."
          />
          <Footer />
          <BoxArrowUp />
      </main>
    </>
  )
}
