// Schema do Sanity para projetos de áudio
// Este arquivo será usado quando você inicializar o Sanity Studio

export default {
  name: 'audioProject',
  title: 'Projeto de Áudio',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Título',
      type: 'string',
      validation: (Rule: any) => Rule.required().error('O título é obrigatório'),
    },
    {
      name: 'description',
      title: 'Descrição',
      type: 'text',
      validation: (Rule: any) => Rule.required().error('A descrição é obrigatória'),
    },
    {
      name: 'audioFile',
      title: 'Arquivo de Áudio',
      type: 'file',
      options: {
        accept: 'audio/*',
      },
      validation: (Rule: any) => Rule.required().error('O arquivo de áudio é obrigatório'),
    },
    {
      name: 'type',
      title: 'Tipo de Serviço',
      type: 'string',
      options: {
        list: [
          { title: 'Locução', value: 'Locução' },
          { title: 'Spot Publicitário', value: 'Spot Publicitário' },
          { title: 'Produção de Áudio', value: 'Produção de Áudio' },
          { title: 'Dublagem', value: 'Dublagem' },
          { title: 'Narração', value: 'Narração' },
          { title: 'Podcast', value: 'Podcast' },
        ],
      },
      validation: (Rule: any) => Rule.required().error('O tipo de serviço é obrigatório'),
    },
    {
      name: 'client',
      title: 'Cliente',
      type: 'string',
      description: 'Nome do cliente (opcional)',
    },
    {
      name: 'duration',
      title: 'Duração',
      type: 'string',
      description: 'Duração no formato MM:SS (ex: 02:30)',
      validation: (Rule: any) =>
        Rule.regex(/^\d{2}:\d{2}$/).error('Formato inválido. Use MM:SS (ex: 02:30)'),
    },
    {
      name: 'coverImage',
      title: 'Imagem de Capa',
      type: 'image',
      description: 'Imagem de capa do projeto (opcional)',
      options: {
        hotspot: true,
      },
    },
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'type',
      media: 'coverImage',
    },
  },
}
