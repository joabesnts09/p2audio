export function StructuredData() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://p2audio.com.br'

  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'p2audio',
    description: 'Produtora de áudio profissional especializada em locuções, dublagem, spots publicitários e produção de áudio de alta qualidade.',
    url: baseUrl,
    logo: `${baseUrl}/assets/logoP2.png`,
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer service',
      availableLanguage: ['Portuguese', 'English', 'Spanish'],
    },
    sameAs: [
      // Adicione aqui suas redes sociais quando disponíveis
      // 'https://www.facebook.com/p2audio',
      // 'https://www.instagram.com/p2audio',
      // 'https://www.linkedin.com/company/p2audio',
    ],
  }

  const serviceSchema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    serviceType: 'Audio Production Services',
    provider: {
      '@type': 'Organization',
      name: 'p2audio',
    },
    areaServed: {
      '@type': 'Country',
      name: 'Brazil',
    },
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Serviços de Produção de Áudio',
      itemListElement: [
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Locuções Institucionais e Instrucionais',
            description: 'Narração profissional para vídeos institucionais, treinamentos corporativos e materiais educacionais.',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Espera Telefônica e URA',
            description: 'Produção de mensagens de espera telefônica e sistemas de URA.',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'E-learning e E-book',
            description: 'Narração especializada para cursos online e audiolivros.',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Dublagem',
            description: 'Serviços completos de dublagem para vídeos, animações e conteúdos audiovisuais.',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Spot Publicitário',
            description: 'Criação e produção de spots publicitários para rádio, TV e mídias digitais.',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Revisão e Tradução de Texto',
            description: 'Serviços de revisão e tradução de textos em múltiplos idiomas.',
          },
        },
      ],
    },
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />
    </>
  )
}
