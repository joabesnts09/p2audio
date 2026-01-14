import { defineConfig } from 'sanity'
import { deskTool } from 'sanity/desk'
import { visionTool } from '@sanity/vision'

// Importe seu schema aqui quando criar o Sanity Studio
// import audioProjectSchema from './sanity/schema'

export default defineConfig({
  name: 'p2audio',
  title: 'p2audio CMS',
  
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  
  plugins: [deskTool(), visionTool()],
  
  schema: {
    types: [
      // Adicione seus schemas aqui
      // audioProjectSchema,
    ],
  },
})
