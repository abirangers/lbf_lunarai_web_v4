'use client'

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface NeonBadgeProps {
  children: React.ReactNode
  className?: string
  variant?: 'blue' | 'cyan' | 'gray'
  pulse?: boolean
}

export function NeonBadge({ children, className, variant = 'blue', pulse = false }: NeonBadgeProps) {
  const colors = {
    blue: 'bg-brand-blue/20 text-brand-blue border-brand-blue/30',
    cyan: 'bg-brand-cyan/20 text-brand-cyan border-brand-cyan/30',
    gray: 'bg-brand-primary/20 text-brand-primary border-brand-primary/30',
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      className={cn(
        'inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium backdrop-blur-sm',
        colors[variant],
        pulse && 'animate-glow-pulse',
        className
      )}
    >
      {pulse && (
        <span className={cn('h-2 w-2 rounded-full', variant === 'blue' && 'bg-brand-blue', variant === 'cyan' && 'bg-brand-cyan', variant === 'gray' && 'bg-brand-primary')} />
      )}
      {children}
    </motion.div>
  )
}
