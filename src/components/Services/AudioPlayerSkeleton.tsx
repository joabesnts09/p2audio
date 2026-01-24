'use client'
import { motion } from 'framer-motion'

export const AudioPlayerSkeleton = () => {
    return (
        <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.15 }}
            className="bg-white rounded-lg p-4 border border-gray-200"
        >
            {/* Título e Descrição Skeleton */}
            <div className="mb-3">
                <div className="h-5 bg-gray-200 rounded w-3/4 mb-2 animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse"></div>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
                {/* Tag do tipo Skeleton */}
                <div className="h-6 bg-gray-200 rounded-full w-24 animate-pulse"></div>
                
                {/* Tag do gênero Skeleton */}
                <div className="h-6 bg-gray-200 rounded-full w-20 animate-pulse"></div>

                {/* Botão Play/Pause Skeleton */}
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-200 animate-pulse"></div>

                {/* Barra de progresso Skeleton */}
                <div className="flex-1">
                    <div className="flex items-center gap-1.5">
                        <div className="h-3 bg-gray-200 rounded w-8 animate-pulse"></div>
                        <div className="flex-1 h-2 bg-gray-200 rounded-full animate-pulse"></div>
                        <div className="h-3 bg-gray-200 rounded w-8 animate-pulse"></div>
                    </div>
                </div>

                {/* Botão de volume Skeleton */}
                <div className="w-7 h-7 bg-gray-200 rounded animate-pulse"></div>

                {/* Botão de Download Skeleton */}
                <div className="w-7 h-7 bg-gray-200 rounded animate-pulse"></div>
            </div>
        </motion.div>
    )
}
