'use client'

import { useState } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { GlassCard } from '@/components/common/GlassCard'

interface Ingredient {
  name: string
  inciName?: string
  percentage?: number
  purpose?: string
  notes?: string
}

interface IngredientsInputProps {
  value: Ingredient[]
  onChange: (value: Ingredient[]) => void
}

export function IngredientsInput({ value, onChange }: IngredientsInputProps) {
  const addIngredient = () => {
    onChange([...value, { name: '' }])
  }

  const updateIngredient = (index: number, field: keyof Ingredient, fieldValue: any) => {
    const updated = [...value]
    updated[index] = { ...updated[index], [field]: fieldValue }
    onChange(updated)
  }

  const removeIngredient = (index: number) => {
    onChange(value.filter((_, i) => i !== index))
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label>Active Ingredients (max 5)</Label>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={addIngredient}
          disabled={value.length >= 5}
          className="glass-effect"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Ingredient
        </Button>
      </div>

      <div className="space-y-3">
        {value.map((ingredient, index) => (
          <GlassCard key={index} className="p-4" hover={false}>
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label className="text-xs">Ingredient Name *</Label>
                    <Input
                      value={ingredient.name}
                      onChange={(e) => updateIngredient(index, 'name', e.target.value)}
                      placeholder="e.g., Niacinamide"
                      className="input-field h-9"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">INCI Name</Label>
                    <Input
                      value={ingredient.inciName || ''}
                      onChange={(e) => updateIngredient(index, 'inciName', e.target.value)}
                      placeholder="e.g., Niacinamide"
                      className="input-field h-9"
                    />
                  </div>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removeIngredient(index)}
                  className="h-9 w-9 text-red-500 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <Label className="text-xs">Percentage (%)</Label>
                  <Input
                    type="number"
                    value={ingredient.percentage || ''}
                    onChange={(e) =>
                      updateIngredient(index, 'percentage', parseFloat(e.target.value))
                    }
                    placeholder="10"
                    className="input-field h-9"
                    step="0.1"
                  />
                </div>
                <div className="space-y-1 md:col-span-2">
                  <Label className="text-xs">Purpose</Label>
                  <Input
                    value={ingredient.purpose || ''}
                    onChange={(e) => updateIngredient(index, 'purpose', e.target.value)}
                    placeholder="e.g., Brightening, Barrier repair"
                    className="input-field h-9"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <Label className="text-xs">Notes</Label>
                <Input
                  value={ingredient.notes || ''}
                  onChange={(e) => updateIngredient(index, 'notes', e.target.value)}
                  placeholder="Additional details or constraints"
                  className="input-field h-9"
                />
              </div>
            </div>
          </GlassCard>
        ))}
      </div>

      {value.length === 0 && (
        <div className="text-center py-8 text-sm text-brand-primary">
          No ingredients added yet. Click "Add Ingredient" to start.
        </div>
      )}
    </div>
  )
}
