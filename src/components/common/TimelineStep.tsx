'use client'

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { LucideIcon } from 'lucide-react'

interface TimelineStepProps {
  icon: LucideIcon
  title: string
  description: string
  index: number
  isLast?: boolean
}

export function TimelineStep({ icon: Icon, title, description, index, isLast }: TimelineStepProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1 }}
      viewport={{ once: true }}
      className="relative flex items-start gap-4"
    >
      <div className="flex flex-col items-center">
        <motion.div
          whileHover={{ scale: 1.1, rotate: 5 }}
          className="glass-effect flex h-12 w-12 items-center justify-center rounded-full glow-blue"
        >
          <Icon className="h-6 w-6 text-brand-blue" />
        </motion.div>
        {!isLast && (
          <motion.div
            initial={{ height: 0 }}
            whileInView={{ height: '100%' }}
            transition={{ delay: index * 0.1 + 0.2, duration: 0.5 }}
            className="mt-2 w-0.5 flex-1 bg-gradient-to-b from-brand-blue to-brand-cyan"
          />
        )}
      </div>
      <div className="flex-1 pb-8">
        <h3 className="mb-1 text-lg font-semibold text-brand-secondary">{title}</h3>
        <p className="text-sm text-brand-primary">{description}</p>
      </div>
    </motion.div>
  )
}
