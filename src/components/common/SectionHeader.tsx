'use client'

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface SectionHeaderProps {
  title: string
  subtitle?: string
  className?: string
  centered?: boolean
}

export function SectionHeader({ title, subtitle, className, centered = false }: SectionHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className={cn('mb-12', centered && 'text-center', className)}
    >
      <h2 className="mb-3 text-4xl font-bold text-brand-secondary md:text-5xl">
        <span className="text-gradient">{title}</span>
      </h2>
      {subtitle && <p className="text-lg text-brand-primary md:text-xl">{subtitle}</p>}
    </motion.div>
  )
}
