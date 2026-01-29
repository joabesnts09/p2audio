import { Header } from "@/components/Header"
import { ServicePage } from "@/components/Services/ServicePage"
import { Footer } from "@/components/Footer"
import { BoxArrowUp } from "@/components/Main/BoxArrowUp"
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Locução em Outros Idiomas - P2 Áudio',
  description: 'Locuções profissionais em alemão, francês, árabe, cantonês e outros idiomas. Locutores nativos especializados para projetos internacionais de alta qualidade.',
  openGraph: {
    title: 'Locução em Outros Idiomas - P2 Áudio',
    description: 'Locuções profissionais em múltiplos idiomas com locutores nativos especializados.',
    type: 'website',
  },
}

export default function LocucaoOutrosIdiomasPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen pt-32 bg-white">
        <ServicePage
          serviceTitle="Locução em Outros Idiomas"
          serviceDescription="Locuções profissionais em alemão, francês, árabe, cantonês e outros idiomas com locutores nativos especializados. Trabalhamos com vozes autênticas de diversos países, garantindo pronúncia perfeita e adequação cultural para seus projetos internacionais. Nossos locutores são experientes e estão prontos para dar vida ao seu projeto com qualidade excepcional e autenticidade linguística."
          serviceIcon="🌍"
          serviceType="Locução em Outros Idiomas"
          metaDescription="Locuções profissionais em múltiplos idiomas com locutores nativos especializados."
        />
        <Footer />
        <BoxArrowUp />
      </main>
    </>
  )
}
