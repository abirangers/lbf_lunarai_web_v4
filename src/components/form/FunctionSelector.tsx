'use client'

import {
  Sparkles,
  Shield,
  Droplets,
  Sun,
  Zap,
  Heart,
  Wind,
  Leaf,
  Star,
  Flame,
  Moon,
  CloudRain,
  Snowflake,
  Sunrise,
  Sunset,
  Coffee,
  Check,
  ChevronLeft,
  ChevronRight,
  Eye,
  Smile,
  Waves,
  Flower2,
  Scissors,
  Layers,
  CircleDot,
  Droplet,
} from 'lucide-react'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'
import { useRef } from 'react'

const functions = [
  { value: 'brightening', label: 'Brightening', icon: Sparkles },
  { value: 'anti-aging', label: 'Anti-Aging', icon: Shield },
  { value: 'hydrating', label: 'Hydrating', icon: Droplets },
  { value: 'sun-protection', label: 'Sun Protection', icon: Sun },
  { value: 'acne-treatment', label: 'Acne Treatment', icon: Zap },
  { value: 'soothing', label: 'Soothing', icon: Heart },
  { value: 'pore-minimizing', label: 'Pore Minimizing', icon: Wind },
  { value: 'anti-pollution', label: 'Anti-Pollution', icon: Leaf },
  { value: 'firming', label: 'Firming', icon: Star },
  { value: 'exfoliating', label: 'Exfoliating', icon: Flame },
  { value: 'night-repair', label: 'Night Repair', icon: Moon },
  { value: 'oil-control', label: 'Oil Control', icon: CloudRain },
  { value: 'cooling', label: 'Cooling', icon: Snowflake },
  { value: 'revitalizing', label: 'Revitalizing', icon: Sunrise },
  { value: 'calming', label: 'Calming', icon: Sunset },
  { value: 'energizing', label: 'Energizing', icon: Coffee },
  { value: 'moisturizing', label: 'Moisturizing', icon: Droplet },
  { value: 'anti-wrinkle', label: 'Anti-Wrinkle', icon: Smile },
  { value: 'dark-spot', label: 'Dark Spot', icon: CircleDot },
  { value: 'barrier-repair', label: 'Barrier Repair', icon: Shield },
  { value: 'sebum-control', label: 'Sebum Control', icon: Layers },
  { value: 'anti-redness', label: 'Anti-Redness', icon: Heart },
  { value: 'lifting', label: 'Lifting', icon: Star },
  { value: 'nourishing', label: 'Nourishing', icon: Flower2 },
  { value: 'whitening', label: 'Whitening', icon: Sparkles },
  { value: 'anti-blemish', label: 'Anti-Blemish', icon: Zap },
  { value: 'dark-circle', label: 'Dark Circle', icon: Eye },
  { value: 'smoothing', label: 'Smoothing', icon: Waves },
]

interface FunctionSelectorProps {
  value: string[]
  onChange: (value: string[]) => void
  error?: string
}

export function FunctionSelector({ value, onChange, error }: FunctionSelectorProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  const toggleFunction = (func: string) => {
    if (value.includes(func)) {
      onChange(value.filter((f) => f !== func))
    } else if (value.length < 6) {
      onChange([...value, func])
    }
  }

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -300, behavior: 'smooth' })
    }
  }

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 300, behavior: 'smooth' })
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Label className="text-sm font-medium text-gray-700">Product Functions *</Label>
        <div className="flex items-center gap-2">
          <span className="text-xs text-blue-600 font-medium">{value.length} dipilih</span>
          <div className="flex gap-1">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={scrollLeft}
              className="h-7 w-7 p-0"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={scrollRight}
              className="h-7 w-7 p-0"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
      <div ref={scrollContainerRef} className="overflow-x-auto scrollbar-hide pb-2">
        <div className="flex gap-3 min-w-max">
          {functions.map(({ value: funcValue, label, icon: Icon }) => (
            <motion.button
              key={funcValue}
              type="button"
              onClick={() => toggleFunction(funcValue)}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              className={cn(
                'relative flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all duration-200 shadow-sm min-w-[120px]',
                'hover:shadow-lg hover:border-blue-300',
                value.includes(funcValue)
                  ? 'bg-blue-50 border-blue-500 shadow-md'
                  : 'bg-white border-gray-200 hover:bg-gray-50'
              )}
            >
              {value.includes(funcValue) && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute top-2 right-2 h-5 w-5 rounded-full bg-blue-500 flex items-center justify-center"
                >
                  <Check className="h-3 w-3 text-white" />
                </motion.div>
              )}
              <div
                className={cn(
                  'p-3 rounded-lg transition-colors',
                  value.includes(funcValue) ? 'bg-blue-100' : 'bg-gray-100'
                )}
              >
                <Icon
                  className={cn(
                    'h-6 w-6 transition-colors',
                    value.includes(funcValue) ? 'text-blue-600' : 'text-gray-600'
                  )}
                />
              </div>
              <span
                className={cn(
                  'text-sm font-medium text-center',
                  value.includes(funcValue) ? 'text-blue-700' : 'text-gray-700'
                )}
              >
                {label}
              </span>
            </motion.button>
          ))}
        </div>
      </div>
      <p className="text-xs text-gray-500">
        💡 Pilih maksimal 6 fungsi utama produk. Scroll horizontal atau gunakan tombol navigasi
      </p>
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  )
}
