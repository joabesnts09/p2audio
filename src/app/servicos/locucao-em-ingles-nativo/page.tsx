import { Header } from "@/components/Header"
import { ServicePage } from "@/components/Services/ServicePage"
import { Footer } from "@/components/Footer"
import { BoxArrowUp } from "@/components/Main/BoxArrowUp"
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Locução em Inglês Nativo - P2 Áudio',
  description: 'Locuções em inglês nativo com locutores profissionais dos Estados Unidos e Inglaterra. Qualidade internacional para seus projetos audiovisuais.',
  openGraph: {
    title: 'Locução em Inglês Nativo - P2 Áudio',
    description: 'Locuções em inglês nativo com locutores profissionais dos Estados Unidos e Inglaterra.',
    type: 'website',
  },
}

export default function LocucaoInglesNativoPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen pt-32 bg-white">
          <ServicePage
            serviceTitle="Locução em Inglês Nativo"
            serviceDescription="Seja bem-vindo(a) à nossa página de locução em inglês nativo. Aqui você poderá conferir alguns locutores do nosso banco de vozes profissionais dos Estados Unidos e Inglaterra. Trabalhamos exclusivamente com locutores nativos, garantindo pronúncia perfeita, sotaque autêntico e naturalidade na comunicação. Nossos profissionais são experientes em diversos segmentos: institucional, comercial, educacional e muito mais."
            serviceIcon="🌎"
            serviceType="Locução em Inglês Nativo"
            metaDescription="Locuções em inglês nativo com locutores profissionais dos Estados Unidos e Inglaterra."
          />
          <Footer />
          <BoxArrowUp />
      </main>
    </>
  )
}
