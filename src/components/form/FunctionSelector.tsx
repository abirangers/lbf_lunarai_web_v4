'use client'

import { Sparkles, Shield, Droplets, Sun, Zap, Heart, Wind, Leaf, Star, Flame, Moon, CloudRain, Snowflake, Sunrise, Sunset, Coffee, Check } from 'lucide-react'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'

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
]

interface FunctionSelectorProps {
  value: string[]
  onChange: (value: string[]) => void
  error?: string
}

export function FunctionSelector({ value, onChange, error }: FunctionSelectorProps) {
  const toggleFunction = (func: string) => {
    if (value.includes(func)) {
      onChange(value.filter((f) => f !== func))
    } else if (value.length < 6) {
      onChange([...value, func])
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Label className="text-sm font-medium text-gray-700">Product Functions *</Label>
        <span className="text-xs text-blue-600 font-medium">{value.length} dipilih</span>
      </div>
      <div className="overflow-x-auto scrollbar-hide pb-2">
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
              <span className={cn(
                'text-sm font-medium text-center',
                value.includes(funcValue) ? 'text-blue-700' : 'text-gray-700'
              )}>{label}</span>
            </motion.button>
          ))}
        </div>
      </div>
      <p className="text-xs text-gray-500">💡 Scroll horizontal untuk melihat lebih banyak fungsi</p>
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  )
}
