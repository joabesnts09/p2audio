'use client'
import { motion } from 'framer-motion'

export const VideoCardSkeleton = () => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-gray-50 rounded-xl p-6 border border-gray-200"
        >
            {/* Thumbnail Skeleton */}
            <div className="mb-4 rounded-lg bg-gray-200 h-48 animate-pulse"></div>

            {/* Tipo de serviço Skeleton */}
            <div className="mb-3">
                <div className="h-6 bg-gray-200 rounded-full w-32 animate-pulse"></div>
            </div>

            {/* Título Skeleton */}
            <div className="h-6 bg-gray-200 rounded w-3/4 mb-2 animate-pulse"></div>
            <div className="h-6 bg-gray-200 rounded w-1/2 mb-4 animate-pulse"></div>

            {/* Descrição Skeleton */}
            <div className="space-y-2 mb-4">
                <div className="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6 animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-4/6 animate-pulse"></div>
            </div>

            {/* Botão Skeleton */}
            <div className="h-10 bg-gray-200 rounded-lg w-40 animate-pulse"></div>
        </motion.div>
    )
}
