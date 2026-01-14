import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Toaster } from 'react-hot-toast'

const inter = Inter({ 
  weight: ['400', '500', '700'],
  subsets: ['latin'] 
})

export const metadata: Metadata = {
  title: 'p2audio - Produtora de Áudio Profissional',
  description: 'Produção de áudio de alta qualidade. Casting de vozes, tradução, revisão de textos e produção completa de áudio para seu projeto.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="32x32"/>
      </head>
      <body className={inter.className}>
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#1a1a1a',
              color: '#fff',
              border: '1px solid #FFD700',
              borderRadius: '0.5rem',
            },
            success: {
              iconTheme: {
                primary: '#FFD700',
                secondary: '#1a1a1a',
              },
              style: {
                border: '1px solid #FFD700',
              },
            },
            error: {
              iconTheme: {
                primary: '#ef4444',
                secondary: '#1a1a1a',
              },
              style: {
                border: '1px solid #ef4444',
              },
            },
          }}
        />
      </body>
    </html>
  )
}
