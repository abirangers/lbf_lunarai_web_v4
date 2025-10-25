'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useRouter } from 'next/navigation'
import {
  Loader2,
  Droplets,
  Package,
  Sparkles,
  User,
  Users,
  Beaker,
  Settings,
  Lightbulb,
  Heart,
  Palette,
  Pipette,
  Container,
  Cylinder,
  Box,
  CircleDot,
  Boxes,
  TrendingUp,
  Zap,
  Sun,
  Waves,
  Layers,
  Circle,
  Pill,
  FlaskConical,
  Disc,
  Wind,
} from 'lucide-react'
import { useSimulator } from '@/contexts/SimulatorContext'
import { buildSubmissionPayload, type FormValues } from '@/lib/payloadBuilder'
import { useToast } from '@/hooks/use-toast'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { IconSelector } from './IconSelector'
import { SelectWithOther } from './SelectWithOther'
import { TagIngredientsInput } from './TagIngredientsInput'
import { FunctionSelector } from './FunctionSelector'
import { GlowButton } from '@/components/common/GlowButton'
import { formatCurrency } from '@/lib/utils'

const formSchema = z.object({
  brandName: z.string().min(1, 'Nama brand wajib diisi'),
  productName: z.string().min(1, 'Nama produk wajib diisi'),
  functions: z.array(z.string()).min(1, 'Pilih minimal 1 fungsi'),
  formType: z.string().min(1, 'Tipe produk wajib dipilih'),
  packagingType: z.string().min(1, 'Jenis kemasan wajib dipilih'),
  packagingFinish: z.string().optional(),
  packagingMaterialNotes: z.string().optional(),
  nettoValue: z.number().positive('Netto harus lebih dari 0'),
  nettoUnit: z.enum(['ml', 'g']),
  colorDescription: z.string().min(1, 'Deskripsi warna wajib diisi'),
  colorHex: z.string().optional(),
  gender: z.string().min(1, 'Target gender wajib dipilih'),
  ageRanges: z.array(z.string()).min(1, 'Pilih minimal 1 rentang usia'),
  formulaNarrative: z.string().min(10, 'Deskripsi konsep minimal 10 karakter'),
  benchmark: z.string().optional(),
  additionalNotes: z.string().optional(),
  ingredients: z.array(
    z.object({
      name: z.string(),
      inciName: z.string().optional(),
      percentage: z.number().optional(),
      purpose: z.string().optional(),
      notes: z.string().optional(),
    })
  ),
  targetRetailPrice: z.number().optional(),
  moqExpectation: z.number().optional(),
  texturePreference: z.string().optional(),
  fragranceProfile: z.string().optional(),
  aiImageStyle: z.string().optional(),
  notesForDesignTeam: z.string().optional(),
})

export function SimulatorForm() {
  const router = useRouter()
  const { toast } = useToast()
  const { environment, incrementSubmissionCount, updateFormValues } = useSimulator()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      functions: [],
      formType: '',
      nettoUnit: 'ml',
      ageRanges: [],
      ingredients: [],
    },
  })
  const targetRetailPriceValue = form.watch('targetRetailPrice')
  const showTargetRetailPrice =
    typeof targetRetailPriceValue === 'number' &&
    !Number.isNaN(targetRetailPriceValue) &&
    targetRetailPriceValue > 0

  // Sync form values to context for LiveBrief preview
  useEffect(() => {
    const subscription = form.watch((values) => {
      updateFormValues(values as Partial<FormValues>)
    })
    return () => subscription.unsubscribe()
  }, [form, updateFormValues])

  const onSubmit = async (values: FormValues) => {
    setIsSubmitting(true)
    try {
      const payload = buildSubmissionPayload({ ...values, targetEnvironment: environment })

      const response = await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        let errorMessage = 'Submission failed'
        try {
          const error = await response.json()
          errorMessage = error.message || errorMessage
        } catch {
          // If response is not JSON, use status text
          errorMessage = `Server error: ${response.statusText}`
        }
        throw new Error(errorMessage)
      }

      // Check if response is JSON
      const contentType = response.headers.get('content-type')
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Server returned invalid response format')
      }

      const result = await response.json()
      incrementSubmissionCount()

      // Show different message for mock mode
      if (result.mockMode) {
        toast({
          title: '✅ Form Submitted (Demo Mode)',
          description: result.message || 'Data tersimpan di console. Backend belum dikonfigurasi.',
        })
        // Don't redirect in mock mode, just show success
        console.log('📋 Submission Data:', payload)
      } else {
        toast({
          title: '✅ Berhasil!',
          description: 'Brief produk Anda sedang diproses oleh AI',
        })
        router.push(`/result/${result.submissionId}`)
      }
    } catch (error) {
      toast({
        title: '❌ Gagal',
        description: error instanceof Error ? error.message : 'Terjadi kesalahan',
        variant: 'destructive',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="simulator-form space-y-6">
      {/* Brand Identity Section */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 space-y-5">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Sparkles className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Identitas Brand</h3>
            <p className="text-sm text-gray-500">Informasi dasar tentang brand Anda</p>
          </div>
        </div>

        {/* //_new_nama brand */}
        <div className="space-y-2">
          <Label htmlFor="brandName" className="text-sm font-medium text-gray-700">
            Nama Brand *
          </Label>
          <Input
            id="brandName"
            {...form.register('brandName')}
            placeholder="Contoh: Glowing Skin Co."
            className="input-field bg-white"
          />
          {form.formState.errors.brandName && (
            <p className="text-sm text-red-500">{form.formState.errors.brandName.message}</p>
          )}
        </div>

        {/* //_new_nama produk */}
        <div className="space-y-2">
          <Label htmlFor="productName" className="text-sm font-medium text-gray-700">
            Nama Produk *
          </Label>
          <Input
            id="productName"
            {...form.register('productName')}
            placeholder="Contoh: Brightening Serum"
            className="input-field bg-white"
          />
          {form.formState.errors.productName && (
            <p className="text-sm text-red-500">{form.formState.errors.productName.message}</p>
          )}
        </div>
      </div>

      {/* Product Blueprint Section */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 space-y-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-cyan-100 rounded-lg">
            <Package className="h-5 w-5 text-cyan-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Blueprint Produk</h3>
            <p className="text-sm text-gray-500">Spesifikasi detail produk kosmetik Anda</p>
          </div>
        </div>

        {/* // Select form type */}
        <IconSelector
          label="Tipe Produk *"
          value={form.watch('formType') || ''}
          onChange={(value) => form.setValue('formType', value as string)}
          options={[
            { value: 'Serum', label: 'Serum', icon: Droplets },
            { value: 'Cream', label: 'Krim', icon: Heart },
            { value: 'Gel', label: 'Gel', icon: Beaker },
            { value: 'Lotion', label: 'Lotion', icon: Package },
            { value: 'Essence', label: 'Essence', icon: Sparkles },
            { value: 'Mist', label: 'Mist', icon: Wind },
            { value: 'Toner', label: 'Toner', icon: Droplets },
            { value: 'Foam', label: 'Busa', icon: Waves },
            { value: 'Oil', label: 'Oil', icon: Circle },
            { value: 'Balm', label: 'Balm', icon: Heart },
            { value: 'Stick', label: 'Stick', icon: Cylinder },
            { value: 'Sunscreen', label: 'Sunscreen', icon: Sun },
            { value: 'Compact', label: 'Compact', icon: Disc },
            { value: 'Powder', label: 'Powder', icon: Sparkles },
            { value: 'Mask', label: 'Mask', icon: Layers },
            { value: 'Scrub', label: 'Scrub', icon: CircleDot },
            { value: 'Cleanser', label: 'Cleanser', icon: Droplets },
            { value: 'Emulsion', label: 'Emulsion', icon: Beaker },
            { value: 'Ampoule', label: 'Ampoule', icon: FlaskConical },
            { value: 'Capsule', label: 'Kapsul', icon: Pill },
          ]}
          error={form.formState.errors.formType?.message}
          horizontal
        />

        {/* // Fill product function */}
        <FunctionSelector
          value={form.watch('functions') || []}
          onChange={(value) => form.setValue('functions', value)}
          error={form.formState.errors.functions?.message}
        />

        {/* //_new_packaging primer */}
        <IconSelector
          label="Jenis Kemasan *"
          value={form.watch('packagingType') || ''}
          onChange={(value) => form.setValue('packagingType', value as string)}
          options={[
            { value: 'airless-pump', label: 'Airless Pump', icon: Cylinder },
            { value: 'dropper', label: 'Dropper', icon: Pipette },
            { value: 'jar', label: 'Jar', icon: Container },
            { value: 'tube', label: 'Tube', icon: Cylinder },
            { value: 'spray', label: 'Spray', icon: Droplets },
            { value: 'pump-bottle', label: 'Pump Bottle', icon: Boxes },
            { value: 'bottle', label: 'Bottle', icon: Package },
            { value: 'stick', label: 'Stick', icon: CircleDot },
            { value: 'sachet', label: 'Sachet', icon: Box },
            { value: 'pouch', label: 'Pouch', icon: Box },
            { value: 'compact', label: 'Compact', icon: Disc },
            { value: 'cushion', label: 'Cushion', icon: Circle },
            { value: 'palette', label: 'Palette', icon: Palette },
            { value: 'pen', label: 'Pen', icon: Pipette },
            { value: 'roll-on', label: 'Roll-On', icon: Circle },
            { value: 'ampoule', label: 'Ampoule', icon: FlaskConical },
          ]}
          error={form.formState.errors.packagingType?.message}
          horizontal
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <SelectWithOther
            label="Finishing Kemasan"
            value={form.watch('packagingFinish') || ''}
            onChange={(value) => form.setValue('packagingFinish', value)}
            options={[
              { value: 'matte', label: 'Matte (tidak mengkilap)' },
              { value: 'glossy', label: 'Glossy (mengkilap)' },
              { value: 'frosted', label: 'Frosted (buram)' },
              { value: 'metallic', label: 'Metallic (metalik)' },
            ]}
            placeholder="Pilih finishing..."
            otherPlaceholder="Ketik finishing lainnya..."
          />

          <div className="space-y-2">
            <Label htmlFor="packagingMaterialNotes" className="text-sm font-medium text-gray-700">
              Catatan Material
            </Label>
            <Input
              id="packagingMaterialNotes"
              {...form.register('packagingMaterialNotes')}
              placeholder="Contoh: PCR plastic, Glass"
              className="input-field bg-white border-2"
            />
          </div>
        </div>

        {/* //_new_netto */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="nettoValue" className="text-sm font-medium text-gray-700">
              Netto *
            </Label>
            <Input
              id="nettoValue"
              type="number"
              {...form.register('nettoValue', { valueAsNumber: true })}
              placeholder="30"
              className="input-field bg-white border-2"
            />
            {form.formState.errors.nettoValue && (
              <p className="text-sm text-red-500">{form.formState.errors.nettoValue.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="nettoUnit" className="text-sm font-medium text-gray-700">
              Satuan *
            </Label>
            <Select
              value={form.watch('nettoUnit') || 'ml'}
              onValueChange={(value) => form.setValue('nettoUnit', value as 'ml' | 'g')}
            >
              <SelectTrigger className="input-field bg-white border-2">
                <SelectValue placeholder="Pilih satuan..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ml">ml (mililiter)</SelectItem>
                <SelectItem value="g">g (gram)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* //_new_warna */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="colorDescription" className="text-sm font-medium text-gray-700">
              Profil Warna *
            </Label>
            <Input
              id="colorDescription"
              {...form.register('colorDescription')}
              placeholder="Contoh: Putih mutiara, Gel transparan"
              className="input-field bg-white border-2"
            />
            {form.formState.errors.colorDescription && (
              <p className="text-sm text-red-500">
                {form.formState.errors.colorDescription.message}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="colorHex" className="text-sm font-medium text-gray-700">
              Kode Warna (opsional)
            </Label>
            <div className="flex gap-2">
              <Input
                id="colorHex"
                {...form.register('colorHex')}
                placeholder="#FFFFFF"
                className="input-field"
              />
              <input
                type="color"
                value={form.watch('colorHex') || '#FFFFFF'}
                onChange={(e) => form.setValue('colorHex', e.target.value)}
                className="h-10 w-20 rounded-md border cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* // Select gender */}
        <IconSelector
          label="Target Gender *"
          value={form.watch('gender') || ''}
          onChange={(value) => form.setValue('gender', value as string)}
          options={[
            { value: 'all', label: 'Semua Gender', icon: Users },
            { value: 'female', label: 'Wanita', icon: User },
            { value: 'male', label: 'Pria', icon: User },
            { value: 'non-binary', label: 'Non-Binary', icon: Users },
          ]}
          error={form.formState.errors.gender?.message}
          columns={4}
        />

        {/* // Select age range */}
        <IconSelector
          label="Rentang Usia *"
          value={form.watch('ageRanges') || []}
          onChange={(value) => form.setValue('ageRanges', value as string[])}
          options={[
            { value: 'Infant', label: 'Bayi (0-2 thn)' },
            { value: 'Child', label: 'Anak (3-12 thn)' },
            { value: 'Teen', label: 'Remaja (13-17 thn)' },
            { value: '18-25', label: '18-25 tahun' },
            { value: '26-35', label: '26-35 tahun' },
            { value: '36-50', label: '36-50 tahun' },
            { value: '50+', label: '50+ tahun' },
            { value: 'All Age', label: 'Semua Usia' },
          ]}
          multiple
          error={form.formState.errors.ageRanges?.message}
          columns={4}
        />
      </div>

      {/* Concept & Formula Section */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 space-y-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-purple-100 rounded-lg">
            <Beaker className="h-5 w-5 text-purple-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Konsep & Formula</h3>
            <p className="text-sm text-gray-500">Deskripsikan produk Anda</p>
          </div>
        </div>

        {/* // Fill concept formula */}
        <div className="space-y-2">
          <Label htmlFor="formulaNarrative" className="text-sm font-medium text-gray-700">
            Deskripsi Konsep Produk *
          </Label>
          <Textarea
            id="formulaNarrative"
            {...form.register('formulaNarrative')}
            placeholder="Contoh: Serum brightening dengan niacinamide 10% untuk mencerahkan dan meratakan warna kulit. Cocok untuk kulit kusam dan bekas jerawat. Tekstur ringan, cepat menyerap."
            className="input-field bg-white min-h-[120px]"
          />
          <p className="text-xs text-gray-500">
            💡 Jelaskan manfaat utama, masalah yang diatasi, dan tekstur yang diinginkan
          </p>
          {form.formState.errors.formulaNarrative && (
            <p className="text-sm text-red-500">{form.formState.errors.formulaNarrative.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="benchmark" className="text-sm font-medium text-gray-700">
            Produk Referensi (opsional)
          </Label>
          <Input
            id="benchmark"
            {...form.register('benchmark')}
            placeholder="Contoh: The Ordinary Niacinamide 10%"
            className="input-field bg-white"
          />
          <p className="text-xs text-gray-500">
            Produk existing yang menjadi inspirasi atau benchmark
          </p>
        </div>

        {/* // Add ingredients */}
        <TagIngredientsInput
          value={form.watch('ingredients') || []}
          onChange={(value) => form.setValue('ingredients', value)}
        />

        <div className="space-y-2">
          <Label htmlFor="additionalNotes" className="text-sm font-medium text-gray-700">
            Catatan Tambahan
          </Label>
          <Textarea
            id="additionalNotes"
            {...form.register('additionalNotes')}
            placeholder="Batasan, preferensi, atau informasi penting lainnya"
            className="input-field bg-white"
          />
        </div>
      </div>

      {/* Extended Product Details */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 space-y-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-green-100 rounded-lg">
            <Settings className="h-5 w-5 text-green-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Detail Produksi</h3>
            <p className="text-sm text-gray-500">Informasi harga dan MOQ</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* //_new_target HPP price */}
          <div className="space-y-2">
            <Label htmlFor="targetRetailPrice" className="text-sm font-medium text-gray-700">
              Target Harga HPP (IDR)
            </Label>
            <Input
              id="targetRetailPrice"
              type="number"
              {...form.register('targetRetailPrice', { valueAsNumber: true })}
              placeholder="150000"
              className="input-field bg-white border-2"
            />
            {showTargetRetailPrice && (
              <p className="text-xs text-blue-600 font-medium">
                {formatCurrency(targetRetailPriceValue)}
              </p>
            )}
          </div>

          {/* //_new_moq expectation */}
          <div className="space-y-2">
            <Label htmlFor="moqExpectation" className="text-sm font-medium text-gray-700">
              MOQ (unit)
            </Label>
            <Input
              id="moqExpectation"
              type="number"
              {...form.register('moqExpectation', { valueAsNumber: true })}
              placeholder="1000"
              className="input-field bg-white border-2"
            />
            <p className="text-xs text-gray-500">Minimum order quantity</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* //_new_texture preference */}
          <div className="space-y-2">
            <Label htmlFor="texturePreference" className="text-sm font-medium text-gray-700">
              Preferensi Tekstur
            </Label>
            <Textarea
              id="texturePreference"
              {...form.register('texturePreference')}
              placeholder="Contoh: Ringan, cepat menyerap, tidak lengket"
              className="input-field bg-white min-h-[80px]"
            />
          </div>

          {/* //_new_fragrance profile */}
          <div className="space-y-2">
            <Label htmlFor="fragranceProfile" className="text-sm font-medium text-gray-700">
              Profil Aroma
            </Label>
            <Textarea
              id="fragranceProfile"
              {...form.register('fragranceProfile')}
              placeholder="Contoh: Floral ringan, atau tanpa pewangi"
              className="input-field bg-white min-h-[80px]"
            />
          </div>
        </div>

        {/* //_new_ai image style */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="aiImageStyle" className="text-sm font-medium text-gray-700">
              Gaya Visual AI (opsional)
            </Label>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="border-purple-300 text-purple-700 hover:bg-purple-50"
              onClick={() => {
                // TODO: Implement AI suggestion based on brand voice and product type
                const suggestions = [
                  'Minimalist modern photography',
                  'Botanical luxury illustration',
                  'Clean clinical aesthetic',
                  'Vibrant tropical vibes',
                ]
                const random = suggestions[Math.floor(Math.random() * suggestions.length)]
                form.setValue('aiImageStyle', random)
              }}
            >
              <Sparkles className="h-3 w-3 mr-1" />
              Suggest AI
            </Button>
          </div>
          <Input
            id="aiImageStyle"
            {...form.register('aiImageStyle')}
            placeholder="Contoh: Minimalist product photography, Botanical illustration"
            className="input-field bg-white"
          />
          <p className="text-xs text-gray-500">Deskripsi untuk generasi gambar/packaging AI</p>
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex justify-center items-center">
        <GlowButton
          type="submit"
          disabled={isSubmitting}
          className="px-12 py-4 text-lg font-semibold"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Memproses...
            </>
          ) : (
            <>Generate Analysis</>
          )}
        </GlowButton>
      </div>
    </form>
  )
}
