'use client'

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { Button, ButtonProps } from '@/components/ui/button'

interface GlowButtonProps extends ButtonProps {
  glowColor?: 'blue' | 'cyan'
}

export function GlowButton({ children, className, glowColor = 'blue', ...props }: GlowButtonProps) {
  return (
    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
      <Button
        className={cn(
          'button-primary relative overflow-hidden',
          glowColor === 'blue' ? 'glow-blue' : 'glow-cyan',
          className
        )}
        {...props}
      >
        <span className="relative z-10 flex items-center">{children}</span>
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-brand-blue/20 to-brand-cyan/20"
          animate={{
            x: ['-100%', '100%'],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
      </Button>
    </motion.div>
  )
}
