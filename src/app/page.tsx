import { Main } from "@/components/Main"
import { Header } from "@/components/Header"
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Início',
  description: 'Produtora de áudio profissional especializada em locuções institucionais, spots publicitários, dublagem, e-learning e muito mais. Qualidade profissional para seu projeto.',
  openGraph: {
    title: 'p2audio - Produtora de Áudio Profissional',
    description: 'Produção de áudio de alta qualidade. Locuções institucionais, spots publicitários, dublagem, e-learning e muito mais.',
    type: 'website',
  },
}

export default function Home() {
  return (
    <>
      <Header />
      <Main />
    </>
  )
}
