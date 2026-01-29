import { Header } from "@/components/Header"
import { ServicePage } from "@/components/Services/ServicePage"
import { Footer } from "@/components/Footer"
import { BoxArrowUp } from "@/components/Main/BoxArrowUp"
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Locução em Espanhol Nativo - P2 Áudio',
  description: 'Locuções em espanhol nativo com locutores profissionais de diversos países de língua espanhola. Qualidade internacional para seus projetos.',
  openGraph: {
    title: 'Locução em Espanhol Nativo - P2 Áudio',
    description: 'Locuções em espanhol nativo com locutores profissionais de diversos países.',
    type: 'website',
  },
}

export default function LocucaoEspanholNativoPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen pt-32 bg-white">
          <ServicePage
            serviceTitle="Locução em Espanhol Nativo"
            serviceDescription="Locuções em espanhol nativo com locutores profissionais de diversos países de língua espanhola. Trabalhamos com vozes nativas da Espanha, México, Argentina, Colômbia e outros países, garantindo o sotaque e a pronúncia perfeitos para seu público-alvo. Nossos locutores são especializados em diferentes segmentos e estão prontos para dar vida ao seu projeto com autenticidade e profissionalismo."
            serviceIcon="ES"
            serviceType="Locução em Espanhol Nativo"
            metaDescription="Locuções em espanhol nativo com locutores profissionais de diversos países."
          />
          <Footer />
          <BoxArrowUp />
      </main>
    </>
  )
}
