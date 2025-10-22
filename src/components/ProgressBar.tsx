'use client'

import { motion } from 'framer-motion'

interface ProgressBarProps {
  completed: number
  total: number
  failed?: number
  className?: string
}

export function ProgressBar({ completed, total, failed = 0, className = '' }: ProgressBarProps) {
  const percentage = Math.round((completed / total) * 100)
  const successPercentage = Math.round(((completed - failed) / total) * 100)
  const failedPercentage = Math.round((failed / total) * 100)

  return (
    <div className={`w-full ${className}`}>
      {/* Header */}
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-900">Generating Report</span>
          {completed > 0 && completed < total && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="flex items-center gap-1"
            >
              <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse" />
              <span className="text-xs text-gray-500">Processing...</span>
            </motion.div>
          )}
          {completed === total && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="flex items-center gap-1"
            >
              <svg
                className="w-4 h-4 text-green-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <span className="text-xs text-green-600 font-medium">Complete!</span>
            </motion.div>
          )}
        </div>

        <div className="flex items-center gap-3">
          <span className="text-sm font-semibold text-gray-900">
            {completed}/{total}
          </span>
          <span className="text-xs text-gray-500">({percentage}%)</span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="relative w-full h-3 bg-gray-100 rounded-full overflow-hidden shadow-inner">
        {/* Success Progress */}
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${successPercentage}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full"
        />

        {/* Failed Progress */}
        {failed > 0 && (
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${failedPercentage}%` }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="absolute top-0 h-full bg-red-500 rounded-full"
            style={{ left: `${successPercentage}%` }}
          />
        )}

        {/* Shimmer Effect (while processing) */}
        {completed > 0 && completed < total && (
          <motion.div
            animate={{
              x: ['-100%', '200%'],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: 'linear',
            }}
            className="absolute top-0 left-0 h-full w-1/3 bg-gradient-to-r from-transparent via-white/30 to-transparent"
          />
        )}
      </div>

      {/* Section Breakdown */}
      {failed > 0 && (
        <div className="mt-2 flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-blue-600 rounded-full" />
            <span className="text-gray-600">{completed - failed} completed</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-red-500 rounded-full" />
            <span className="text-gray-600">{failed} failed</span>
          </div>
        </div>
      )}

      {/* Estimated Time */}
      {completed > 0 && completed < total && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-2 text-xs text-gray-500"
        >
          Estimated time remaining: ~{Math.max(1, Math.ceil((total - completed) * 3))} seconds
        </motion.div>
      )}
    </div>
  )
}
