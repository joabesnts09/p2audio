import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Toaster } from 'react-hot-toast'
import { StructuredData } from '@/components/SEO/StructuredData'
import { ErrorSuppressor } from '@/components/ErrorSuppressor'

const inter = Inter({ 
  weight: ['400', '500', '700'],
  subsets: ['latin'] 
})

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://p2audio.vercel.app/'),
  title: {
    default: 'p2audio - Produtora de Áudio Profissional',
    template: '%s | p2audio'
  },
  description: 'Produção de áudio de alta qualidade. Locuções institucionais, spots publicitários, dublagem, e-learning e muito mais. Casting de vozes profissionais, tradução e revisão de textos.',
  keywords: [
    'produtora de áudio',
    'locução profissional',
    'dublagem',
    'spot publicitário',
    'e-learning',
    'narração',
    'casting de vozes',
    'tradução de textos',
    'produção de áudio',
    'áudio profissional',
    'espera telefônica',
    'URA',
    'audiolivro',
    'podcast'
  ],
  authors: [{ name: 'p2audio' }],
  creator: 'p2audio',
  publisher: 'p2audio',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    url: '/',
    siteName: 'p2audio',
    title: 'p2audio - Produtora de Áudio Profissional',
    description: 'Produção de áudio de alta qualidade. Locuções institucionais, spots publicitários, dublagem, e-learning e muito mais.',
    images: [
      {
        url: '/assets/logoP2.png',
        width: 1200,
        height: 630,
        alt: 'p2audio - Produtora de Áudio Profissional',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'p2audio - Produtora de Áudio Profissional',
    description: 'Produção de áudio de alta qualidade. Locuções institucionais, spots publicitários, dublagem, e-learning e muito mais.',
    images: ['/assets/logoP2.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    // Adicione aqui quando tiver Google Search Console
    // google: 'seu-codigo-de-verificacao',
  },
  alternates: {
    canonical: '/',
  },
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
        <ErrorSuppressor />
        <StructuredData />
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#1a1a1a',
              color: '#fff',
              border: '1px solid #FDD600',
              borderRadius: '0.5rem',
            },
            success: {
              iconTheme: {
                primary: '#FDD600',
                secondary: '#1a1a1a',
              },
              style: {
                border: '1px solid #FDD600',
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
