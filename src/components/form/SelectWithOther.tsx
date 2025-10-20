'use client'

import { useState, useEffect } from 'react'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'

interface SelectWithOtherProps {
  label: string
  value: string
  onChange: (value: string) => void
  options: Array<{ value: string; label: string; labelId?: string }>
  placeholder?: string
  error?: string
  helperText?: string
  otherLabel?: string
  otherPlaceholder?: string
  hideOther?: boolean
}

export function SelectWithOther({
  label,
  value,
  onChange,
  options,
  placeholder = 'Pilih...',
  error,
  helperText,
  otherLabel = 'Lainnya',
  otherPlaceholder = 'Ketik pilihan Anda...',
  hideOther = false,
}: SelectWithOtherProps) {
  const [showOtherInput, setShowOtherInput] = useState(false)
  const [otherValue, setOtherValue] = useState('')

  // Check if current value is not in options (means it's a custom value)
  useEffect(() => {
    const isInOptions = options.some((opt) => opt.value === value)
    if (!isInOptions && value) {
      setShowOtherInput(true)
      setOtherValue(value)
    } else {
      setShowOtherInput(false)
      setOtherValue('')
    }
  }, [value, options])

  const handleSelectChange = (selectedValue: string) => {
    if (selectedValue === '__other__') {
      setShowOtherInput(true)
      onChange('')
    } else {
      setShowOtherInput(false)
      setOtherValue('')
      onChange(selectedValue)
    }
  }

  const handleOtherInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    setOtherValue(newValue)
    onChange(newValue)
  }

  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium text-gray-700">{label}</Label>
      
      <Select
        value={showOtherInput ? '__other__' : value}
        onValueChange={handleSelectChange}
      >
        <SelectTrigger className="input-field bg-white">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.labelId || option.label}
            </SelectItem>
          ))}
          {!hideOther && (
            <SelectItem value="__other__" className="text-blue-600 font-medium">
              ✏️ {otherLabel}
            </SelectItem>
          )}
        </SelectContent>
      </Select>

      {showOtherInput && (
        <Input
          value={otherValue}
          onChange={handleOtherInputChange}
          placeholder={otherPlaceholder}
          className="input-field bg-white mt-2"
          autoFocus
        />
      )}

      {helperText && !error && (
        <p className="text-xs text-gray-500">{helperText}</p>
      )}
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  )
}
