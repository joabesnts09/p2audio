import { createClient } from '@sanity/client'
import imageUrlBuilder from '@sanity/image-url'

// Configuração do cliente Sanity
export const sanityClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  useCdn: true, // Usa CDN para melhor performance
  apiVersion: '2024-01-01', // Data da API mais recente
})

// Builder para URLs de imagens do Sanity
const builder = imageUrlBuilder(sanityClient)

export function urlFor(source: any) {
  return builder.image(source)
}
