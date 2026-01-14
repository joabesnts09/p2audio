import { sanityClient } from './sanity'

export interface AudioProject {
  _id: string
  title: string
  description: string
  audioFile: {
    asset: {
      _ref: string
      _type: string
    }
    url?: string
  }
  type: string
  client?: string
  duration?: string
  coverImage?: {
    asset: {
      _ref: string
      _type: string
    }
    url?: string
  }
}

// Query para buscar todos os projetos de áudio
const audioProjectsQuery = `*[_type == "audioProject"] | order(_createdAt desc) {
  _id,
  title,
  description,
  audioFile {
    asset-> {
      _id,
      url,
      originalFilename
    }
  },
  type,
  client,
  duration,
  coverImage {
    asset-> {
      _id,
      url
    }
  }
}`

export async function getAudioProjects() {
  try {
    const projects = await sanityClient.fetch(audioProjectsQuery)
    
    // Transforma os dados do Sanity para o formato esperado pelo componente
    return projects.map((project: any) => ({
      id: project._id,
      title: project.title || '',
      description: project.description || '',
      audioUrl: project.audioFile?.asset?.url || '',
      type: project.type || '',
      client: project.client || undefined,
      duration: project.duration || undefined,
      coverImage: project.coverImage?.asset?.url || undefined,
    }))
  } catch (error) {
    console.error('Erro ao buscar projetos do Sanity:', error)
    return []
  }
}
