import { MetadataRoute } from 'next'

interface BreadcrumbItem {
  name: string
  url: string
}

interface BreadcrumbsProps {
  items?: BreadcrumbItem[]
}

export function Breadcrumbs({ items = [] }: BreadcrumbsProps) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://p2audio.vercel.app'
  
  // Breadcrumbs padrão para a página inicial
  const defaultItems: BreadcrumbItem[] = [
    { name: 'Início', url: baseUrl },
  ]

  const breadcrumbItems = items.length > 0 ? items : defaultItems

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbItems.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  }

  return (
    <nav aria-label="Breadcrumb" className="mb-4">
      <ol className="flex items-center space-x-2 text-sm text-gray-600">
        {breadcrumbItems.map((item, index) => (
          <li key={index} className="flex items-center">
            {index > 0 && <span className="mx-2">/</span>}
            {index === breadcrumbItems.length - 1 ? (
              <span className="text-gray-900 font-medium" aria-current="page">
                {item.name}
              </span>
            ) : (
              <a
                href={item.url}
                className="hover:text-gold-yellow transition-colors"
              >
                {item.name}
              </a>
            )}
          </li>
        ))}
      </ol>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
    </nav>
  )
}
