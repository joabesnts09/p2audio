'use client'

import { useEffect } from 'react'

/**
 * Componente que suprime erros inofensivos do YouTube e avisos de WebGL/Next.js no console
 * - Erros do YouTube: ocorrem quando o YouTube tenta fazer logging/analytics
 *   mas é bloqueado por extensões do navegador (ad blockers)
 * - Avisos de WebGL: relacionados à renderização de vídeos e são inofensivos
 * - Avisos de hidratação/imagem Next.js: avisos comuns em desenvolvimento que podem ser suprimidos para clarear o console
 */
export function ErrorSuppressor() {
  useEffect(() => {
    const originalError = console.error
    const originalWarn = console.warn

    const shouldSuppressMessage = (message: string): boolean => {
      const messageStr = typeof message === 'string' ? message : String(message)
      const lowerMessage = messageStr.toLowerCase()
      
      // Verifica se é um erro relacionado ao YouTube sendo bloqueado
      const isYouTubeError = (
        messageStr.includes('youtubei/v1/log') ||
        messageStr.includes('ERR_BLOCKED_BY_CLIENT') ||
        messageStr.includes('net::ERR_BLOCKED_BY_CLIENT') ||
        (messageStr.includes('youtube.com') && (messageStr.includes('POST') || messageStr.includes('GET')))
      )
      
      // Verifica se é um aviso de WebGL relacionado à renderização de vídeos
      const isWebGLWarning = (
        lowerMessage.includes('webgl') ||
        lowerMessage.includes('automatic fallback to software webgl') ||
        lowerMessage.includes('groupmarkernotset') ||
        lowerMessage.includes('crbug.c') ||
        lowerMessage.includes('enable-unsafe-swiftshader') ||
        lowerMessage.includes('software fallback')
      )

      // Verifica se é um aviso de hidratação do Next.js/React
      const isHydrationWarning = messageStr.includes('Prop `className` did not match.') ||
                                 messageStr.includes('Did not expect server HTML to contain a')

      // Verifica se é um aviso do Next.js Image
      const isNextJsImageWarning = (
        (lowerMessage.includes('image with src') && lowerMessage.includes('has either width or height modified, but not the other')) ||
        (lowerMessage.includes('image with src') && lowerMessage.includes('was detected as the largest contentful paint'))
      )

      // Verifica se é a mensagem do React DevTools
      const isReactDevToolsMessage = lowerMessage.includes('download the react devtools')
      
      return isYouTubeError || isWebGLWarning || isHydrationWarning || isNextJsImageWarning || isReactDevToolsMessage
    }

    // Intercepta console.error
    console.error = (...args: any[]) => {
      const message = args[0]
      if (!shouldSuppressMessage(message)) {
        originalError.apply(console, args)
      }
    }

    // Intercepta console.warn
    console.warn = (...args: any[]) => {
      const message = args[0]
      if (!shouldSuppressMessage(message)) {
        originalWarn.apply(console, args)
      }
    }

    const handleError = (event: ErrorEvent) => {
      const errorMessage = event.message || ''
      if (shouldSuppressMessage(errorMessage)) {
        event.preventDefault()
        return false
      }
    }

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      const reason = event.reason
      const errorMessage = reason?.message || String(reason) || ''
      
      if (shouldSuppressMessage(errorMessage)) {
        event.preventDefault()
        return false
      }
    }

    window.addEventListener('error', handleError)
    window.addEventListener('unhandledrejection', handleUnhandledRejection)

    // Cleanup
    return () => {
      console.error = originalError
      console.warn = originalWarn
      window.removeEventListener('error', handleError)
      window.removeEventListener('unhandledrejection', handleUnhandledRejection)
    }
  }, [])

  return null
}
