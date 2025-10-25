'use client'

import { useState } from 'react'
import { X, Plus, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { motion, AnimatePresence } from 'framer-motion'

interface Ingredient {
  name: string
  inciName?: string
  percentage?: number
  purpose?: string
  notes?: string
}

interface TagIngredientsInputProps {
  value: Ingredient[]
  onChange: (value: Ingredient[]) => void
}

// Comprehensive ingredients database
const INGREDIENTS_DATABASE = [
  { name: 'Niacinamide', inciName: 'Niacinamide', purpose: 'Brightening, Pore minimizing' },
  { name: 'Hyaluronic Acid', inciName: 'Sodium Hyaluronate', purpose: 'Hydrating, Plumping' },
  { name: 'Vitamin C', inciName: 'Ascorbic Acid', purpose: 'Brightening, Antioxidant' },
  { name: 'Retinol', inciName: 'Retinol', purpose: 'Anti-aging, Skin renewal' },
  {
    name: 'Centella Asiatica',
    inciName: 'Centella Asiatica Extract',
    purpose: 'Soothing, Healing',
  },
  { name: 'Peptides', inciName: 'Palmitoyl Pentapeptide-4', purpose: 'Anti-aging, Firming' },
  { name: 'Alpha Arbutin', inciName: 'Alpha-Arbutin', purpose: 'Brightening, Even tone' },
  { name: 'Ceramides', inciName: 'Ceramide NP', purpose: 'Barrier repair, Moisturizing' },
  { name: 'Glycerin', inciName: 'Glycerin', purpose: 'Humectant, Moisturizing' },
  { name: 'Salicylic Acid', inciName: 'Salicylic Acid', purpose: 'Exfoliating, Acne treatment' },
  { name: 'AHA (Glycolic Acid)', inciName: 'Glycolic Acid', purpose: 'Exfoliating, Brightening' },
  { name: 'BHA', inciName: 'Beta Hydroxy Acid', purpose: 'Pore cleansing, Exfoliating' },
  {
    name: 'Tranexamic Acid',
    inciName: 'Tranexamic Acid',
    purpose: 'Brightening, Anti-pigmentation',
  },
  { name: 'Kojic Acid', inciName: 'Kojic Acid', purpose: 'Brightening, Melanin inhibitor' },
  { name: 'Azelaic Acid', inciName: 'Azelaic Acid', purpose: 'Acne treatment, Brightening' },
  { name: 'Vitamin E', inciName: 'Tocopherol', purpose: 'Antioxidant, Moisturizing' },
  { name: 'Collagen', inciName: 'Hydrolyzed Collagen', purpose: 'Anti-aging, Firming' },
  { name: 'Snail Mucin', inciName: 'Snail Secretion Filtrate', purpose: 'Hydrating, Repairing' },
  { name: 'Propolis', inciName: 'Propolis Extract', purpose: 'Antibacterial, Soothing' },
  {
    name: 'Tea Tree Oil',
    inciName: 'Melaleuca Alternifolia Leaf Oil',
    purpose: 'Antibacterial, Acne treatment',
  },
  { name: 'Aloe Vera', inciName: 'Aloe Barbadensis Leaf Extract', purpose: 'Soothing, Hydrating' },
  {
    name: 'Green Tea Extract',
    inciName: 'Camellia Sinensis Leaf Extract',
    purpose: 'Antioxidant, Anti-inflammatory',
  },
  { name: 'Caffeine', inciName: 'Caffeine', purpose: 'De-puffing, Energizing' },
  { name: 'Bakuchiol', inciName: 'Bakuchiol', purpose: 'Retinol alternative, Anti-aging' },
  { name: 'Squalane', inciName: 'Squalane', purpose: 'Moisturizing, Barrier repair' },
]

export function TagIngredientsInput({ value, onChange }: TagIngredientsInputProps) {
  const [isAdding, setIsAdding] = useState(false)
  const [currentIngredient, setCurrentIngredient] = useState<Partial<Ingredient>>({})
  const [searchQuery, setSearchQuery] = useState('')

  const filteredIngredients = INGREDIENTS_DATABASE.filter((ing) =>
    ing.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const addIngredient = () => {
    if (currentIngredient.name && value.length < 10) {
      onChange([...value, currentIngredient as Ingredient])
      setCurrentIngredient({})
      setSearchQuery('')
      setIsAdding(false)
    }
  }

  const removeIngredient = (index: number) => {
    onChange(value.filter((_, i) => i !== index))
  }

  const selectFromDatabase = (ing: (typeof INGREDIENTS_DATABASE)[0]) => {
    setCurrentIngredient({
      name: ing.name,
      inciName: ing.inciName,
      purpose: ing.purpose,
    })
    setSearchQuery(ing.name)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label className="text-sm font-medium text-gray-700">
          Bahan Aktif <span className="text-gray-400">(max 10)</span>
        </Label>
        <div className="flex items-center gap-2 text-xs text-blue-600">
          <Sparkles className="h-3 w-3" />
          <span>Database Lengkap</span>
        </div>
      </div>

      {/* Tags Display */}
      <div className="flex flex-wrap gap-2 min-h-[60px] p-4 bg-gray-50 rounded-xl border-2 border-gray-200">
        <AnimatePresence>
          {value.map((ingredient, index) => (
            <motion.div
              key={index}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-500 text-white rounded-full text-sm font-medium shadow-sm"
            >
              <span>{ingredient.name}</span>
              <button
                type="button"
                onClick={() => removeIngredient(index)}
                className="hover:bg-blue-600 rounded-full p-0.5 transition-colors"
              >
                <X className="h-3 w-3" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
        {value.length === 0 && (
          <p className="text-sm text-gray-400">Belum ada bahan yang ditambahkan</p>
        )}
      </div>

      {/* Add Ingredient Form */}
      {!isAdding && value.length < 10 && (
        <Button
          type="button"
          variant="outline"
          onClick={() => setIsAdding(true)}
          className="w-full border-2 border-dashed border-blue-300 text-blue-600 hover:bg-blue-50"
        >
          <Plus className="mr-2 h-4 w-4" />
          Tambah Bahan Aktif
        </Button>
      )}

      {isAdding && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-white rounded-xl border-2 border-blue-200 space-y-4"
        >
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium text-gray-700">Nama Bahan *</Label>
              <Select
                value=""
                onValueChange={(val) => {
                  const selected = INGREDIENTS_DATABASE.find((ing) => ing.name === val)
                  if (selected) {
                    selectFromDatabase(selected)
                  }
                }}
              >
                <SelectTrigger className="w-[200px] h-8 text-xs border-blue-300 text-blue-600">
                  <SelectValue placeholder="📚 Pilih dari database" />
                </SelectTrigger>
                <SelectContent className="max-h-[300px]">
                  {INGREDIENTS_DATABASE.map((ing, idx) => (
                    <SelectItem key={idx} value={ing.name}>
                      <div className="flex flex-col">
                        <span className="font-medium">{ing.name}</span>
                        <span className="text-xs text-gray-500">{ing.inciName}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Input
              value={currentIngredient.name || ''}
              onChange={(e) => setCurrentIngredient({ ...currentIngredient, name: e.target.value })}
              placeholder="Ketik nama bahan..."
              className="input-field bg-white border-2"
              autoFocus
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-sm text-gray-600">INCI Name</Label>
              <Input
                value={currentIngredient.inciName || ''}
                onChange={(e) =>
                  setCurrentIngredient({ ...currentIngredient, inciName: e.target.value })
                }
                placeholder="Nama internasional"
                className="input-field bg-white border-2"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-sm text-gray-600">Persentase (%)</Label>
              <Input
                type="number"
                value={currentIngredient.percentage || ''}
                onChange={(e) =>
                  setCurrentIngredient({
                    ...currentIngredient,
                    percentage: parseFloat(e.target.value),
                  })
                }
                placeholder="10"
                className="input-field bg-white border-2"
                step="0.1"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-sm text-gray-600">Fungsi</Label>
            <Input
              value={currentIngredient.purpose || ''}
              onChange={(e) =>
                setCurrentIngredient({ ...currentIngredient, purpose: e.target.value })
              }
              placeholder="Contoh: Brightening, Barrier repair"
              className="input-field bg-white border-2"
            />
          </div>

          <div className="flex gap-2">
            <Button
              type="button"
              onClick={addIngredient}
              disabled={!currentIngredient.name}
              className="flex-1 bg-blue-500 hover:bg-blue-600 text-white"
            >
              <Plus className="mr-2 h-4 w-4" />
              Simpan Bahan
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setIsAdding(false)
                setCurrentIngredient({})
                setSearchQuery('')
              }}
              className="border-2"
            >
              Batal
            </Button>
          </div>
        </motion.div>
      )}

      <div className="text-xs text-gray-500 bg-blue-50 p-3 rounded-lg border border-blue-100">
        💡 <strong>Tips:</strong> Pilih dari database lengkap atau input manual. Bahan akan
        ditampilkan sebagai tag.
      </div>
    </div>
  )
}
