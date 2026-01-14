'use client'
import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'

interface AudioCardProps {
    id: number
    title: string
    description: string
    audioUrl: string
    type: string
    client?: string
    duration?: string
    coverImage?: string
}

export const AudioCard = ({
    id,
    title,
    description,
    audioUrl,
    type,
    client,
    duration: durationText,
    coverImage,
}: AudioCardProps) => {
    const [isPlaying, setIsPlaying] = useState(false)
    const [currentTime, setCurrentTime] = useState(0)
    const [audioDuration, setAudioDuration] = useState(0)
    const [volume, setVolume] = useState(1)
    const [isMuted, setIsMuted] = useState(false)
    const [previousVolume, setPreviousVolume] = useState(1) // Para restaurar quando desmutar
    const audioRef = useRef<HTMLAudioElement>(null)

    useEffect(() => {
        const audio = audioRef.current
        if (!audio) return

        // Configurar volume inicial
        audio.volume = isMuted ? 0 : volume

        const updateTime = () => setCurrentTime(audio.currentTime)
        const updateDuration = () => setAudioDuration(audio.duration)
        const handlePlay = () => setIsPlaying(true)
        const handlePause = () => setIsPlaying(false)
        const handleEnded = () => {
            setIsPlaying(false)
            setCurrentTime(0)
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
    }, [volume, isMuted])

    const togglePlay = () => {
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.pause()
            } else {
                audioRef.current.play()
            }
        }
    }

    const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newVolume = parseFloat(e.target.value)
        
        // Atualizar o volume do áudio imediatamente
        if (audioRef.current) {
            audioRef.current.volume = newVolume
        }
        
        // Se o volume for 0, considerar como mudo
        if (newVolume === 0) {
            setIsMuted(true)
            setVolume(0)
        } else {
            // Se estava mudo e agora tem volume, desmutar
            if (isMuted) {
                setIsMuted(false)
            }
            setVolume(newVolume)
            setPreviousVolume(newVolume) // Salvar o volume atual
        }
    }

    const toggleMute = () => {
        if (audioRef.current) {
            if (isMuted) {
                // Desmutar - restaurar volume anterior ou usar 0.5 como padrão
                const newVolume = previousVolume > 0 ? previousVolume : 0.5
                setIsMuted(false)
                setVolume(newVolume)
                setPreviousVolume(newVolume)
                audioRef.current.volume = newVolume
            } else {
                // Mutar - salvar o volume atual antes de mutar
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

    const progress = audioDuration > 0 ? (currentTime / audioDuration) * 100 : 0

    // Função para retornar o ícone SVG baseado no tipo
    const getTypeIcon = () => {
        switch (type?.toLowerCase()) {
            case 'locução':
                return (
                    <svg className="w-20 h-20 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                    </svg>
                )
            case 'spot publicitário':
            case 'spot publicitario':
                return (
                    <svg className="w-20 h-20 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                )
            case 'produção de áudio':
            case 'producao de audio':
                return (
                    <svg className="w-20 h-20 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                    </svg>
                )
            case 'dublagem':
                return (
                    <svg className="w-20 h-20 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 14v2m8-2v2" />
                    </svg>
                )
            case 'narração':
            case 'narracao':
                return (
                    <svg className="w-20 h-20 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                )
            case 'podcast':
                return (
                    <svg className="w-20 h-20 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 2" />
                    </svg>
                )
            default:
                return (
                    <svg className="w-20 h-20 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                    </svg>
                )
        }
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="bg-gray-50 rounded-xl p-6 border border-gray-200 hover:border-gold-yellow transition-all duration-300 hover:shadow-lg hover:shadow-gold-yellow/20 group"
        >
            {/* Cover Image ou Ícone */}
            {coverImage ? (
                <div className="mb-4 rounded-lg overflow-hidden">
                    <img
                        src={coverImage}
                        alt={title}
                        className="w-full h-48 object-cover"
                    />
                </div>
            ) : (
                <div className="mb-4 rounded-lg bg-gradient-to-br from-gold-yellow/20 to-gold-yellow/10 h-48 flex items-center justify-center">
                    {getTypeIcon()}
                </div>
            )}

            {/* Tipo de serviço */}
            {type && (
                <div className="mb-3">
                    <span className="inline-block px-3 py-1 bg-gold-yellow text-black text-sm font-semibold rounded-full">
                        {type}
                    </span>
                </div>
            )}

            {/* Título */}
            <h3 className="text-xl font-bold text-black mb-2 line-clamp-2">
                {title}
            </h3>

            {/* Descrição */}
            <p className="text-gray-700 text-sm mb-4 leading-relaxed line-clamp-3">
                {description}
            </p>

            {/* Informações adicionais */}
            {(client || durationText) && (
                <div className="flex items-center gap-4 mb-4 text-xs text-gray-600">
                    {client && <span>Cliente: {client}</span>}
                    {durationText && <span>• Duração: {durationText}</span>}
                </div>
            )}

            {/* Player de Áudio Customizado */}
            <div className="mt-4 bg-white rounded-lg p-3 border border-gray-200">
                <audio
                    ref={audioRef}
                    src={audioUrl}
                    preload="metadata"
                    className="hidden"
                />

                {/* Controles */}
                <div className="flex items-center gap-3">
                    <button
                        onClick={togglePlay}
                        className="flex-shrink-0 w-10 h-10 rounded-full bg-gold-yellow hover:bg-gold transition-colors flex items-center justify-center text-black"
                        aria-label={isPlaying ? 'Pausar' : 'Reproduzir'}
                    >
                        {isPlaying ? (
                            <svg
                                className="w-5 h-5"
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
                                className="w-5 h-5 ml-0.5"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                            >
                                <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                            </svg>
                        )}
                    </button>

                    {/* Barra de progresso */}
                    <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs text-gray-600">
                                {formatTime(currentTime)}
                            </span>
                            <div className="flex-1 h-1 bg-gray-200 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-gold-yellow transition-all duration-100"
                                    style={{ width: `${progress}%` }}
                                />
                            </div>
                            <span className="text-xs text-gray-600">
                                {formatTime(audioDuration)}
                            </span>
                        </div>
                    </div>

                    {/* Controlador de Volume */}
                    <div className="flex items-center gap-2 flex-shrink-0">
                        <button
                            onClick={toggleMute}
                            className="w-8 h-8 flex items-center justify-center text-gray-600 hover:text-black transition-colors"
                            aria-label={isMuted || volume === 0 ? 'Ativar som' : 'Silenciar'}
                        >
                            {isMuted ? (
                                <svg
                                    className="w-5 h-5"
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
                                    className="w-5 h-5"
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
                        <div className="w-14">
                            <input
                                type="range"
                                min="0"
                                max="1"
                                step="0.01"
                                value={isMuted ? 0 : volume}
                                onChange={handleVolumeChange}
                                className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                                style={{
                                    background: `linear-gradient(to right, #FFD700 0%, #FFD700 ${(isMuted ? 0 : volume) * 100}%, #e5e7eb ${(isMuted ? 0 : volume) * 100}%, #e5e7eb 100%)`
                                }}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Estilos para o slider de volume */}
            <style jsx>{`
                .slider::-webkit-slider-thumb {
                    appearance: none;
                    width: 14px;
                    height: 14px;
                    border-radius: 50%;
                    background: #FFD700;
                    cursor: pointer;
                    border: 2px solid #fff;
                    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
                }

                .slider::-moz-range-thumb {
                    width: 14px;
                    height: 14px;
                    border-radius: 50%;
                    background: #FFD700;
                    cursor: pointer;
                    border: 2px solid #fff;
                    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
                }

                .slider:focus {
                    outline: none;
                }

                .slider:focus::-webkit-slider-thumb {
                    box-shadow: 0 0 0 3px rgba(255, 215, 0, 0.3);
                }
            `}</style>
        </motion.div>
    )
}
