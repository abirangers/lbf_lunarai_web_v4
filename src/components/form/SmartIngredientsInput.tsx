'use client'

import { useState } from 'react'
import { Plus, Trash2, Sparkles, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { GlassCard } from '@/components/common/GlassCard'
import { motion, AnimatePresence } from 'framer-motion'

interface Ingredient {
  name: string
  inciName?: string
  percentage?: number
  purpose?: string
  notes?: string
}

interface SmartIngredientsInputProps {
  value: Ingredient[]
  onChange: (value: Ingredient[]) => void
}

// Popular ingredients database untuk suggestions
const POPULAR_INGREDIENTS = [
  { name: 'Niacinamide', inciName: 'Niacinamide', purpose: 'Brightening, Pore minimizing', typical: '2-10%' },
  { name: 'Hyaluronic Acid', inciName: 'Sodium Hyaluronate', purpose: 'Hydrating, Plumping', typical: '0.5-2%' },
  { name: 'Vitamin C', inciName: 'Ascorbic Acid', purpose: 'Brightening, Antioxidant', typical: '5-20%' },
  { name: 'Retinol', inciName: 'Retinol', purpose: 'Anti-aging, Skin renewal', typical: '0.1-1%' },
  { name: 'Centella Asiatica', inciName: 'Centella Asiatica Extract', purpose: 'Soothing, Healing', typical: '1-5%' },
  { name: 'Peptides', inciName: 'Palmitoyl Pentapeptide-4', purpose: 'Anti-aging, Firming', typical: '2-5%' },
  { name: 'Alpha Arbutin', inciName: 'Alpha-Arbutin', purpose: 'Brightening, Even tone', typical: '1-2%' },
  { name: 'Ceramides', inciName: 'Ceramide NP', purpose: 'Barrier repair, Moisturizing', typical: '0.5-5%' },
  { name: 'Glycerin', inciName: 'Glycerin', purpose: 'Humectant, Moisturizing', typical: '3-10%' },
  { name: 'Salicylic Acid', inciName: 'Salicylic Acid', purpose: 'Exfoliating, Acne treatment', typical: '0.5-2%' },
]

export function SmartIngredientsInput({ value, onChange }: SmartIngredientsInputProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [showSuggestions, setShowSuggestions] = useState(false)

  const addIngredient = (ingredient?: Partial<Ingredient>) => {
    onChange([...value, { name: ingredient?.name || '', ...ingredient }])
    setSearchQuery('')
    setShowSuggestions(false)
  }

  const updateIngredient = (index: number, field: keyof Ingredient, fieldValue: any) => {
    const updated = [...value]
    updated[index] = { ...updated[index], [field]: fieldValue }
    onChange(updated)
  }

  const removeIngredient = (index: number) => {
    onChange(value.filter((_, i) => i !== index))
  }

  const filteredSuggestions = POPULAR_INGREDIENTS.filter((ing) =>
    ing.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label className="text-sm font-medium text-gray-700">
          Bahan Aktif <span className="text-gray-400">(max 5)</span>
        </Label>
        <div className="flex items-center gap-2 text-xs text-blue-600">
          <Sparkles className="h-3 w-3" />
          <span>AI Suggestions</span>
        </div>
      </div>

      {/* Search & Suggestions */}
      {value.length < 5 && (
        <div className="relative">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value)
                setShowSuggestions(true)
              }}
              onFocus={() => setShowSuggestions(true)}
              placeholder="Cari atau ketik nama bahan..."
              className="input-field bg-white pl-10"
            />
          </div>

          {/* Suggestions Dropdown */}
          <AnimatePresence>
            {showSuggestions && searchQuery && filteredSuggestions.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute z-50 w-full mt-2 glass-effect rounded-xl border border-blue-200 shadow-xl max-h-64 overflow-y-auto"
              >
                {filteredSuggestions.map((ing, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => addIngredient({
                      name: ing.name,
                      inciName: ing.inciName,
                      purpose: ing.purpose,
                      notes: `Konsentrasi umum: ${ing.typical}`,
                    })}
                    className="w-full text-left px-4 py-3 hover:bg-blue-50 transition-colors border-b border-gray-100 last:border-0"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="font-medium text-gray-900">{ing.name}</div>
                        <div className="text-xs text-gray-500">{ing.inciName}</div>
                        <div className="text-xs text-blue-600 mt-1">{ing.purpose}</div>
                      </div>
                      <div className="text-xs text-gray-400">{ing.typical}</div>
                    </div>
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* Quick Add Popular Ingredients */}
      {value.length === 0 && !searchQuery && (
        <div className="space-y-2">
          <div className="text-xs text-gray-500">Bahan populer:</div>
          <div className="flex flex-wrap gap-2">
            {POPULAR_INGREDIENTS.slice(0, 6).map((ing, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => addIngredient({
                  name: ing.name,
                  inciName: ing.inciName,
                  purpose: ing.purpose,
                  notes: `Konsentrasi umum: ${ing.typical}`,
                })}
                className="px-3 py-1.5 text-xs bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors border border-blue-200"
              >
                + {ing.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Ingredient List */}
      <div className="space-y-3">
        <AnimatePresence>
          {value.map((ingredient, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
            >
              <GlassCard className="p-4 bg-white border border-gray-200" hover={false}>
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 space-y-3">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                          <Label className="text-xs text-gray-600">Nama Bahan *</Label>
                          <Input
                            value={ingredient.name}
                            onChange={(e) => updateIngredient(index, 'name', e.target.value)}
                            placeholder="Contoh: Niacinamide"
                            className="input-field bg-white h-9 mt-1"
                          />
                        </div>
                        <div>
                          <Label className="text-xs text-gray-600">INCI Name</Label>
                          <Input
                            value={ingredient.inciName || ''}
                            onChange={(e) => updateIngredient(index, 'inciName', e.target.value)}
                            placeholder="Nama internasional"
                            className="input-field bg-white h-9 mt-1"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div>
                          <Label className="text-xs text-gray-600">Persentase (%)</Label>
                          <Input
                            type="number"
                            value={ingredient.percentage || ''}
                            onChange={(e) =>
                              updateIngredient(index, 'percentage', parseFloat(e.target.value))
                            }
                            placeholder="10"
                            className="input-field bg-white h-9 mt-1"
                            step="0.1"
                          />
                        </div>
                        <div className="md:col-span-2">
                          <Label className="text-xs text-gray-600">Fungsi</Label>
                          <Input
                            value={ingredient.purpose || ''}
                            onChange={(e) => updateIngredient(index, 'purpose', e.target.value)}
                            placeholder="Contoh: Brightening, Barrier repair"
                            className="input-field bg-white h-9 mt-1"
                          />
                        </div>
                      </div>

                      <div>
                        <Label className="text-xs text-gray-600">Catatan</Label>
                        <Input
                          value={ingredient.notes || ''}
                          onChange={(e) => updateIngredient(index, 'notes', e.target.value)}
                          placeholder="Informasi tambahan atau batasan"
                          className="input-field bg-white h-9 mt-1"
                        />
                      </div>
                    </div>

                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeIngredient(index)}
                      className="h-9 w-9 text-red-500 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Add Button */}
      {value.length < 5 && value.length > 0 && (
        <Button
          type="button"
          variant="outline"
          onClick={() => addIngredient()}
          className="w-full glass-effect border-dashed border-2 border-blue-300 text-blue-600 hover:bg-blue-50"
        >
          <Plus className="mr-2 h-4 w-4" />
          Tambah Bahan Lain
        </Button>
      )}

      {value.length === 0 && (
        <div className="text-center py-8 glass-effect rounded-xl border-2 border-dashed border-gray-300">
          <Sparkles className="h-8 w-8 mx-auto mb-2 text-gray-400" />
          <p className="text-sm text-gray-500 mb-2">Belum ada bahan yang ditambahkan</p>
          <p className="text-xs text-gray-400">Cari atau pilih dari bahan populer di atas</p>
        </div>
      )}

      <div className="text-xs text-gray-500 bg-blue-50 p-3 rounded-lg border border-blue-100">
        💡 <strong>Tips:</strong> Gunakan pencarian untuk menemukan bahan dengan cepat. Sistem akan
        menyarankan konsentrasi umum dan fungsi bahan.
      </div>
    </div>
  )
}
