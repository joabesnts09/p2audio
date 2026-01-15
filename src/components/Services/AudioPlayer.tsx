'use client'
import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'

interface AudioPlayerProps {
    id: string | number
    audioUrl: string
    type: string
    title?: string
    description?: string
}

export const AudioPlayer = ({
    id,
    audioUrl,
    type,
    title,
    description,
}: AudioPlayerProps) => {
    const [isPlaying, setIsPlaying] = useState(false)
    const [currentTime, setCurrentTime] = useState(0)
    const [audioDuration, setAudioDuration] = useState(0)
    const [isMuted, setIsMuted] = useState(false)
    const [volume, setVolume] = useState(1)
    const [previousVolume, setPreviousVolume] = useState(1)
    const [isDragging, setIsDragging] = useState(false)
    const [dragTime, setDragTime] = useState(0)
    const audioRef = useRef<HTMLAudioElement>(null)
    const progressBarRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const audio = audioRef.current
        if (!audio) return

        audio.volume = isMuted ? 0 : volume

        const updateTime = () => {
            if (!isDragging) {
                setCurrentTime(audio.currentTime)
            }
        }
        const updateDuration = () => setAudioDuration(audio.duration)
        const handlePlay = () => setIsPlaying(true)
        const handlePause = () => setIsPlaying(false)
        const handleEnded = () => {
            setIsPlaying(false)
            setCurrentTime(0)
            setDragTime(0)
        }

        audio.addEventListener('timeupdate', updateTime)
        audio.addEventListener('loadedmetadata', updateDuration)
        audio.addEventListener('play', handlePlay)
        audio.addEventListener('pause', handlePause)
        audio.addEventListener('ended', handleEnded)

        return () => {
            audio.removeEventListener('timeupdate', updateTime)
            audio.removeEventListener('loadedmetadata', updateDuration)
            audio.removeEventListener('play', handlePlay)
            audio.removeEventListener('pause', handlePause)
            audio.removeEventListener('ended', handleEnded)
        }
    }, [volume, isMuted, isDragging])

    const togglePlay = () => {
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.pause()
            } else {
                audioRef.current.play()
            }
        }
    }

    const toggleMute = () => {
        if (audioRef.current) {
            if (isMuted) {
                const newVolume = previousVolume > 0 ? previousVolume : 0.5
                setIsMuted(false)
                setVolume(newVolume)
                setPreviousVolume(newVolume)
                audioRef.current.volume = newVolume
            } else {
                setPreviousVolume(volume > 0 ? volume : 0.5)
                setIsMuted(true)
                setVolume(0)
                audioRef.current.volume = 0
            }
        }
    }

    const formatTime = (seconds: number) => {
        if (isNaN(seconds)) return '0:00'
        const mins = Math.floor(seconds / 60)
        const secs = Math.floor(seconds % 60)
        return `${mins}:${secs.toString().padStart(2, '0')}`
    }

    // Função para calcular o tempo baseado na posição do mouse na barra de progresso
    const calculateTimeFromPosition = (clientX: number) => {
        if (!progressBarRef.current || !audioDuration) return 0
        
        const rect = progressBarRef.current.getBoundingClientRect()
        const clickX = clientX - rect.left
        const width = rect.width
        const percentage = Math.max(0, Math.min(1, clickX / width))
        return percentage * audioDuration
    }

    const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
        // Não fazer nada se estiver arrastando ou se o clique foi no thumb
        if (isDragging || (e.target as HTMLElement).closest('[data-thumb]')) return
        
        if (!audioRef.current) return
        
        const newTime = calculateTimeFromPosition(e.clientX)
        audioRef.current.currentTime = newTime
        setCurrentTime(newTime)
        setDragTime(newTime)
    }

    const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!audioRef.current || !audioDuration) return
        
        e.preventDefault()
        setIsDragging(true)
        
        const wasPlaying = isPlaying
        if (wasPlaying) {
            audioRef.current.pause()
        }
        
        const newTime = calculateTimeFromPosition(e.clientX)
        setDragTime(newTime)
        audioRef.current.currentTime = newTime
        setCurrentTime(newTime)
    }

    const handleMouseUp = () => {
        if (isDragging && audioRef.current) {
            audioRef.current.currentTime = dragTime
            setCurrentTime(dragTime)
            setIsDragging(false)
        }
    }

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (isDragging && audioDuration > 0) {
            e.preventDefault()
            const newTime = calculateTimeFromPosition(e.clientX)
            setDragTime(newTime)
            if (audioRef.current) {
                audioRef.current.currentTime = newTime
                setCurrentTime(newTime)
            }
        }
    }

    // Adicionar listeners globais para mouse move e mouse up quando estiver arrastando
    useEffect(() => {
        if (isDragging) {
            const handleGlobalMouseMove = (e: MouseEvent) => {
                if (!progressBarRef.current || !audioDuration) return
                
                const rect = progressBarRef.current.getBoundingClientRect()
                const clickX = e.clientX - rect.left
                const width = rect.width
                const percentage = Math.max(0, Math.min(1, clickX / width))
                const newTime = percentage * audioDuration
                
                setDragTime(newTime)
                if (audioRef.current) {
                    audioRef.current.currentTime = newTime
                    setCurrentTime(newTime)
                }
            }
            
            const handleGlobalMouseUp = () => {
                if (audioRef.current) {
                    audioRef.current.currentTime = dragTime
                    setCurrentTime(dragTime)
                }
                setIsDragging(false)
            }
            
            window.addEventListener('mousemove', handleGlobalMouseMove)
            window.addEventListener('mouseup', handleGlobalMouseUp)
            
            return () => {
                window.removeEventListener('mousemove', handleGlobalMouseMove)
                window.removeEventListener('mouseup', handleGlobalMouseUp)
            }
        }
    }, [isDragging, dragTime, audioDuration])

    // Função para baixar o áudio
    const handleDownload = () => {
        const link = document.createElement('a')
        link.href = audioUrl
        link.download = title ? `${title}.mp3` : `audio-${id}.mp3`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
    }

    // Atualizar dragTime quando currentTime mudar (quando não estiver arrastando)
    useEffect(() => {
        if (!isDragging) {
            setDragTime(currentTime)
        }
    }, [currentTime, isDragging])

    const displayTime = isDragging ? dragTime : currentTime
    const progress = audioDuration > 0 ? (displayTime / audioDuration) * 100 : 0

    return (
        <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.15 }}
            className="bg-white rounded-lg p-4 border border-gray-200 hover:border-gold-yellow transition-all duration-200"
        >
            <audio
                ref={audioRef}
                src={audioUrl}
                preload="metadata"
                className="hidden"
            />

            {/* Título e Descrição */}
            {(title || description) && (
                <div className="mb-3">
                    {title && (
                        <h4 className="text-base font-bold text-black mb-1 line-clamp-1">
                            {title}
                        </h4>
                    )}
                    {description && (
                        <p className="text-sm text-gray-600 line-clamp-1">
                            {description}
                        </p>
                    )}
                </div>
            )}

            <div className="flex items-center gap-3">
                {/* Tag do tipo */}
                {type && (
                    <span className="px-3 py-1 bg-gold-yellow text-black text-xs font-semibold rounded-full whitespace-nowrap">
                        {type}
                    </span>
                )}

                {/* Botão Play/Pause */}
                <button
                    onClick={togglePlay}
                    className="flex-shrink-0 w-8 h-8 rounded-full bg-gold-yellow hover:bg-gold transition-colors flex items-center justify-center text-black cursor-default"
                    aria-label={isPlaying ? 'Pausar' : 'Reproduzir'}
                >
                    {isPlaying ? (
                        <svg
                            className="w-4 h-4"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                        >
                            <path
                                fillRule="evenodd"
                                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z"
                                clipRule="evenodd"
                            />
                        </svg>
                    ) : (
                        <svg
                            className="w-4 h-4 ml-0.5"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                        >
                            <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                        </svg>
                    )}
                </button>

                {/* Barra de progresso interativa */}
                <div className="flex-1">
                    <div className="flex items-center gap-1.5">
                        <span className="text-xs text-gray-500">
                            {formatTime(displayTime)}
                        </span>
                        <div
                            ref={progressBarRef}
                            className="flex-1 h-2 bg-gray-200 rounded-full cursor-default relative group"
                            onClick={handleProgressClick}
                        >
                            {/* Barra de progresso preenchida */}
                            <div
                                className="h-full bg-gold-yellow transition-all duration-100 rounded-full"
                                style={{ width: `${progress}%` }}
                            />
                            
                            {/* Thumb (bolinha) arrastável */}
                            <div
                                data-thumb
                                className={`absolute top-1/2 w-3 h-3 bg-gold-yellow rounded-full cursor-grab active:cursor-grabbing transition-all shadow-md z-10 ${
                                    isDragging ? 'scale-125' : 'group-hover:scale-110'
                                }`}
                                style={{ 
                                    left: `calc(${progress}% - 6px)`,
                                    transform: 'translateY(-50%)'
                                }}
                                onMouseDown={(e) => {
                                    e.stopPropagation()
                                    e.preventDefault()
                                    handleMouseDown(e)
                                }}
                            />
                        </div>
                        <span className="text-xs text-gray-500">
                            {formatTime(audioDuration)}
                        </span>
                    </div>
                </div>

                {/* Botão de volume */}
                <button
                    onClick={toggleMute}
                    className="w-7 h-7 flex items-center justify-center text-gray-500 hover:text-black transition-colors flex-shrink-0 cursor-default"
                    aria-label={isMuted || volume === 0 ? 'Ativar som' : 'Silenciar'}
                >
                    {isMuted ? (
                        <svg
                            className="w-4 h-4"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                        >
                            <path
                                fillRule="evenodd"
                                d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.617.793L4.383 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.383l4.617-3.793a1 1 0 011.383.07zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z"
                                clipRule="evenodd"
                            />
                            <path
                                fillRule="evenodd"
                                d="M3.707 3.293a1 1 0 010 1.414l12 12a1 1 0 11-1.414 1.414l-12-12a1 1 0 011.414-1.414z"
                                clipRule="evenodd"
                            />
                        </svg>
                    ) : (
                        <svg
                            className="w-4 h-4"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                        >
                            <path
                                fillRule="evenodd"
                                d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.617.793L4.383 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.383l4.617-3.793a1 1 0 011.383.07zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z"
                                clipRule="evenodd"
                            />
                        </svg>
                    )}
                </button>

                {/* Botão de Download */}
                <button
                    onClick={handleDownload}
                    className="w-7 h-7 flex items-center justify-center text-gray-500 hover:text-black transition-colors flex-shrink-0 cursor-pointer"
                    aria-label="Baixar áudio"
                >
                    <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                        />
                    </svg>
                </button>
            </div>
        </motion.div>
    )
}
