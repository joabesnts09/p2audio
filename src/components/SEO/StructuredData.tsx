export function StructuredData() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://p2audio.vercel.app'

  // LocalBusiness Schema - Melhora resultados locais
  const localBusinessSchema = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': `${baseUrl}#organization`,
    name: 'p2audio',
    description: 'Produtora de áudio profissional especializada em locuções, dublagem, spots publicitários e produção de áudio de alta qualidade.',
    url: baseUrl,
    logo: `${baseUrl}/assets/logoP2.png`,
    image: `${baseUrl}/assets/logoP2.png`,
    telephone: '+553598397070',
    priceRange: '$$',
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'BR',
      addressLocality: 'Brasil',
    },
    areaServed: {
      '@type': 'Country',
      name: 'Brasil',
    },
    sameAs: [
      // Adicione aqui suas redes sociais quando disponíveis
    ],
  }

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

  // Breadcrumb Schema - Para navegação hierárquica (mesmo sendo single page, ajuda SEO)
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Início',
        item: baseUrl,
      },
    ],
  }

  // FAQ Schema - Para perguntas frequentes
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'Quais serviços a p2audio oferece?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'A p2audio oferece locuções institucionais e instrucionais, espera telefônica e URA, e-learning e e-book, dublagem, spots publicitários, e serviços de revisão e tradução de textos.',
        },
      },
      {
        '@type': 'Question',
        name: 'Como contratar os serviços da p2audio?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Entre em contato através do telefone (35) 98397-070 ou utilize o formulário de contato em nosso site. Nossa equipe entrará em contato para entender suas necessidades e apresentar um orçamento personalizado.',
        },
      },
      {
        '@type': 'Question',
        name: 'A p2audio trabalha com quais tipos de projetos de áudio?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Trabalhamos com diversos tipos de projetos: vídeos institucionais, treinamentos corporativos, materiais educacionais, audiolivros, spots publicitários, dublagem, espera telefônica, URA e muito mais.',
        },
      },
      {
        '@type': 'Question',
        name: 'A p2audio oferece casting de vozes?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Sim, oferecemos casting de vozes profissionais adequadas ao público-alvo de cada projeto, garantindo comunicação eficaz e profissional.',
        },
      },
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
    </>
  )
}
