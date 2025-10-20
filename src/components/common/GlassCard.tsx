'use client'

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface GlassCardProps {
  children: React.ReactNode
  className?: string
  variant?: 'light' | 'dark'
  hover?: boolean
  glow?: boolean
}

export function GlassCard({
  children,
  className,
  variant = 'light',
  hover = true,
  glow = false,
}: GlassCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      whileHover={hover ? { y: -4, scale: 1.01 } : undefined}
      className={cn(
        'rounded-2xl p-6 transition-all duration-300',
        variant === 'light' ? 'glass-effect' : 'glass-dark',
        glow && 'glow-blue',
        className
      )}
    >
      {children}
    </motion.div>
  )
}
