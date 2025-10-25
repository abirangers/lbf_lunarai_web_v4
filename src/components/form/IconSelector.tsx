'use client'

import { motion } from 'framer-motion'
import { Check, ChevronLeft, ChevronRight } from 'lucide-react'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import type { LucideIcon } from 'lucide-react'
import { useRef } from 'react'

interface Option {
  value: string
  label: string
  labelId?: string
  icon?: LucideIcon
  description?: string
}

interface IconSelectorProps {
  label: string
  value: string | string[]
  onChange: (value: string | string[]) => void
  options: Option[]
  multiple?: boolean
  error?: string
  helperText?: string
  columns?: 2 | 3 | 4
  horizontal?: boolean
}

export function IconSelector({
  label,
  value,
  onChange,
  options,
  multiple = false,
  error,
  helperText,
  columns = 3,
  horizontal = false,
}: IconSelectorProps) {
  const isSelected = (optionValue: string) => {
    if (multiple && Array.isArray(value)) {
      return value.includes(optionValue)
    }
    return value === optionValue
  }

  const handleSelect = (optionValue: string) => {
    if (multiple && Array.isArray(value)) {
      if (value.includes(optionValue)) {
        onChange(value.filter((v) => v !== optionValue))
      } else {
        onChange([...value, optionValue])
      }
    } else {
      onChange(optionValue)
    }
  }

  const gridCols = {
    2: 'grid-cols-2',
    3: 'grid-cols-2 md:grid-cols-3',
    4: 'grid-cols-2 md:grid-cols-4',
  }

  const scrollContainerRef = useRef<HTMLDivElement>(null)

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

  if (horizontal) {
    return (
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label className="text-sm font-medium text-gray-700">{label}</Label>
          <div className="flex items-center gap-2">
            {multiple && Array.isArray(value) && (
              <span className="text-xs text-blue-600 font-medium">{value.length} dipilih</span>
            )}
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
            {options.map((option) => {
              const Icon = option.icon
              const selected = isSelected(option.value)

              return (
                <motion.button
                  key={option.value}
                  type="button"
                  onClick={() => handleSelect(option.value)}
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  className={cn(
                    'relative flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all duration-200 shadow-sm min-w-[120px]',
                    'hover:shadow-lg hover:border-blue-300',
                    selected
                      ? 'bg-blue-50 border-blue-500 shadow-md'
                      : 'bg-white border-gray-200 hover:bg-gray-50'
                  )}
                >
                  {selected && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute top-2 right-2 h-5 w-5 rounded-full bg-blue-500 flex items-center justify-center"
                    >
                      <Check className="h-3 w-3 text-white" />
                    </motion.div>
                  )}

                  {Icon && (
                    <div
                      className={cn(
                        'p-3 rounded-lg transition-colors',
                        selected ? 'bg-blue-100' : 'bg-gray-100'
                      )}
                    >
                      <Icon
                        className={cn(
                          'h-6 w-6 transition-colors',
                          selected ? 'text-blue-600' : 'text-gray-600'
                        )}
                      />
                    </div>
                  )}

                  <div className="text-center">
                    <div
                      className={cn(
                        'text-sm font-medium transition-colors',
                        selected ? 'text-blue-700' : 'text-gray-700'
                      )}
                    >
                      {option.labelId || option.label}
                    </div>
                  </div>
                </motion.button>
              )
            })}
          </div>
        </div>
        <p className="text-xs text-gray-500">💡 Scroll horizontal atau gunakan tombol navigasi</p>
        {error && <p className="text-xs text-red-500">{error}</p>}
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Label className="text-sm font-medium text-gray-700">{label}</Label>
        {multiple && Array.isArray(value) && (
          <span className="text-xs text-gray-500">{value.length} dipilih</span>
        )}
      </div>

      <div className={cn('grid gap-3', gridCols[columns])}>
        {options.map((option) => {
          const Icon = option.icon
          const selected = isSelected(option.value)

          return (
            <motion.button
              key={option.value}
              type="button"
              onClick={() => handleSelect(option.value)}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              className={cn(
                'relative flex flex-col items-center gap-3 p-4 rounded-xl border-2 transition-all duration-200',
                'hover:shadow-lg hover:border-blue-300',
                selected
                  ? 'bg-blue-50 border-blue-500 shadow-md'
                  : 'bg-white border-gray-200 hover:bg-gray-50'
              )}
            >
              {selected && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute top-2 right-2 h-5 w-5 rounded-full bg-blue-500 flex items-center justify-center"
                >
                  <Check className="h-3 w-3 text-white" />
                </motion.div>
              )}

              {Icon && (
                <div
                  className={cn(
                    'p-3 rounded-lg transition-colors',
                    selected ? 'bg-blue-100' : 'bg-gray-100'
                  )}
                >
                  <Icon
                    className={cn(
                      'h-6 w-6 transition-colors',
                      selected ? 'text-blue-600' : 'text-gray-600'
                    )}
                  />
                </div>
              )}

              <div className="text-center">
                <div
                  className={cn(
                    'text-sm font-medium transition-colors',
                    selected ? 'text-blue-700' : 'text-gray-700'
                  )}
                >
                  {option.labelId || option.label}
                </div>
                {option.description && (
                  <div className="text-xs text-gray-500 mt-1">{option.description}</div>
                )}
              </div>
            </motion.button>
          )
        })}
      </div>

      {helperText && !error && <p className="text-xs text-gray-500 mt-2">{helperText}</p>}
      {error && <p className="text-xs text-red-500 mt-2">{error}</p>}
    </div>
  )
}
