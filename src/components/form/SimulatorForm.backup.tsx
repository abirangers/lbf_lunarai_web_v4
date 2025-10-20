'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import { useSimulator } from '@/contexts/SimulatorContext'
import { buildSubmissionPayload, type FormValues } from '@/lib/payloadBuilder'
import { useToast } from '@/hooks/use-toast'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Slider } from '@/components/ui/slider'
import { Checkbox } from '@/components/ui/checkbox'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { LocationSelector } from './LocationSelector'
import { IngredientsInput } from './IngredientsInput'
import { FunctionSelector } from './FunctionSelector'
import { GlowButton } from '@/components/common/GlowButton'
import { formatCurrency, generateQuarters } from '@/lib/utils'

const formSchema = z.object({
  brandName: z.string().min(1, 'Brand name is required'),
  brandVoice: z.string().min(1, 'Brand voice is required'),
  brandValues: z.string().min(1, 'Brand values are required'),
  functions: z.array(z.string()).min(1, 'Select at least one function'),
  formType: z.string().min(1, 'Form type is required'),
  packagingType: z.string().min(1, 'Packaging type is required'),
  packagingFinish: z.string().optional(),
  packagingMaterialNotes: z.string().optional(),
  nettoValue: z.number().positive('Netto value must be positive'),
  nettoUnit: z.enum(['ml', 'g']),
  colorDescription: z.string().min(1, 'Color description is required'),
  colorHex: z.string().optional(),
  gender: z.string().min(1, 'Gender is required'),
  ageRanges: z.array(z.string()).min(1, 'Select at least one age range'),
  country: z.string().min(1, 'Country is required'),
  region: z.string().min(1, 'Region is required'),
  city: z.string().min(1, 'City is required'),
  formulaNarrative: z.string().min(1, 'Formula narrative is required'),
  benchmark: z.string().optional(),
  additionalNotes: z.string().optional(),
  ingredients: z.array(z.object({
    name: z.string(),
    inciName: z.string().optional(),
    percentage: z.number().optional(),
    purpose: z.string().optional(),
    notes: z.string().optional(),
  })),
  launchTimeline: z.string().optional(),
  targetRetailPrice: z.number().optional(),
  pilotBatchSize: z.number().optional(),
  moqExpectation: z.number().optional(),
  distributionFocus: z.enum(['Domestic Retail', 'ASEAN Export', 'Global Prestige', 'D2C Online']),
  sustainabilityPriority: z.number().min(0).max(100),
  regulatoryPriority: z.array(z.string()),
  texturePreference: z.string().optional(),
  fragranceProfile: z.string().optional(),
  claimEmphasis: z.array(z.string()).optional(),
  aiImageStyle: z.string().optional(),
  requiresClinicalStudy: z.boolean(),
  needsHalalCertification: z.boolean(),
  preferredChannels: z.array(z.string()).min(1, 'Select at least one channel'),
  requestedDeliverables: z.array(z.string()).min(1, 'Select at least one deliverable'),
  notesForDesignTeam: z.string().optional(),
})

export function SimulatorForm() {
  const router = useRouter()
  const { toast } = useToast()
  const { environment, incrementSubmissionCount } = useSimulator()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      functions: [],
      formType: '',
      nettoUnit: 'ml',
      ageRanges: [],
      ingredients: [],
      distributionFocus: 'Domestic Retail',
      sustainabilityPriority: 50,
      regulatoryPriority: [],
      requiresClinicalStudy: false,
      needsHalalCertification: false,
      preferredChannels: [],
      requestedDeliverables: [],
      claimEmphasis: [],
    },
  })

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
        const error = await response.json()
        throw new Error(error.message || 'Submission failed')
      }

      const result = await response.json()
      incrementSubmissionCount()
      
      toast({
        title: 'Submission Successful',
        description: `Your product brief has been queued for processing.`,
      })

      router.push(`/result/${result.submissionId}`)
    } catch (error) {
      toast({
        title: 'Submission Failed',
        description: error instanceof Error ? error.message : 'Unknown error',
        variant: 'destructive',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="simulator-form space-y-8">
      {/* Brand Identity Section */}
      <div className="glass-effect rounded-xl p-6 space-y-4">
        <h3 className="text-xl font-semibold text-brand-secondary mb-4">Brand Identity</h3>
        
        {/* //_new_nama brand */}
        <div className="space-y-2">
          <Label htmlFor="brandName">Brand Name *</Label>
          <Input
            id="brandName"
            {...form.register('brandName')}
            placeholder="Enter your brand name"
            className="input-field"
          />
          {form.formState.errors.brandName && (
            <p className="text-sm text-red-500">{form.formState.errors.brandName.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="brandVoice">Brand Voice *</Label>
          <Select onValueChange={(value) => form.setValue('brandVoice', value)}>
            <SelectTrigger className="input-field">
              <SelectValue placeholder="Select brand voice" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="professional">Professional & Clinical</SelectItem>
              <SelectItem value="friendly">Friendly & Approachable</SelectItem>
              <SelectItem value="luxury">Luxury & Sophisticated</SelectItem>
              <SelectItem value="playful">Playful & Youthful</SelectItem>
              <SelectItem value="natural">Natural & Organic</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="brandValues">Brand Values *</Label>
          <Textarea
            id="brandValues"
            {...form.register('brandValues')}
            placeholder="Describe your brand's core values and mission"
            className="input-field min-h-[100px]"
          />
        </div>
      </div>

      {/* Product Blueprint Section */}
      <div className="glass-effect rounded-xl p-6 space-y-6">
        <h3 className="text-xl font-semibold text-brand-secondary mb-4">Product Blueprint</h3>

        {/* // Fill product function */}
        <FunctionSelector
          value={form.watch('functions') || []}
          onChange={(value) => form.setValue('functions', value)}
          error={form.formState.errors.functions?.message}
        />

        {/* // Select form type */}
        <div className="space-y-2">
          <Label>Form Type *</Label>
          <ToggleGroup
            type="single"
            value={form.watch('formType')}
            onValueChange={(value) => form.setValue('formType', value)}
            className="flex flex-wrap gap-2"
          >
            {['Serum', 'Cream', 'Gel', 'Lotion', 'Stick', 'Foam', 'Essence', 'Mist'].map((type) => (
              <ToggleGroupItem key={type} value={type} className="glass-effect">
                {type}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        </div>

        {/* //_new_packaging primer */}
        <div className="space-y-2">
          <Label htmlFor="packagingType">Packaging Type *</Label>
          <Select onValueChange={(value) => form.setValue('packagingType', value)}>
            <SelectTrigger className="input-field">
              <SelectValue placeholder="Select packaging type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="airless-pump">Airless Pump (preserves actives)</SelectItem>
              <SelectItem value="dropper">Dropper Bottle (precision dosing)</SelectItem>
              <SelectItem value="jar">Jar (luxe texture experience)</SelectItem>
              <SelectItem value="tube">Tube (travel-friendly)</SelectItem>
              <SelectItem value="spray">Spray Bottle (even application)</SelectItem>
              <SelectItem value="stick">Stick (on-the-go)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="packagingFinish">Packaging Finish</Label>
            <Input
              id="packagingFinish"
              {...form.register('packagingFinish')}
              placeholder="e.g., Matte, Glossy, Frosted"
              className="input-field"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="packagingMaterialNotes">Material Notes</Label>
            <Input
              id="packagingMaterialNotes"
              {...form.register('packagingMaterialNotes')}
              placeholder="e.g., PCR plastic, Glass"
              className="input-field"
            />
          </div>
        </div>

        {/* //_new_netto */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="nettoValue">Netto Value *</Label>
            <Input
              id="nettoValue"
              type="number"
              {...form.register('nettoValue', { valueAsNumber: true })}
              placeholder="30"
              className="input-field"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="nettoUnit">Unit *</Label>
            <Select onValueChange={(value: 'ml' | 'g') => form.setValue('nettoUnit', value)} defaultValue="ml">
              <SelectTrigger className="input-field">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ml">ml</SelectItem>
                <SelectItem value="g">g</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* //_new_warna */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="colorDescription">Color Profile *</Label>
            <Input
              id="colorDescription"
              {...form.register('colorDescription')}
              placeholder="e.g., Pearl white, Translucent gel"
              className="input-field"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="colorHex">Color Hex (Optional)</Label>
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
        <div className="space-y-2">
          <Label>Target Gender *</Label>
          <Select onValueChange={(value) => form.setValue('gender', value)}>
            <SelectTrigger className="input-field">
              <SelectValue placeholder="Select target gender" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Genders</SelectItem>
              <SelectItem value="female">Female</SelectItem>
              <SelectItem value="male">Male</SelectItem>
              <SelectItem value="non-binary">Non-Binary</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* // Select age range */}
        <div className="space-y-2">
          <Label>Age Ranges *</Label>
          <div className="flex flex-wrap gap-2">
            {['Infant', 'Child', 'Teen', '18-25', '26-35', '36-50', '50+', 'All Age'].map((age) => (
              <label key={age} className="flex items-center gap-2 glass-effect px-4 py-2 rounded-lg cursor-pointer">
                <Checkbox
                  checked={form.watch('ageRanges')?.includes(age)}
                  onCheckedChange={(checked) => {
                    const current = form.watch('ageRanges') || []
                    form.setValue(
                      'ageRanges',
                      checked ? [...current, age] : current.filter((a) => a !== age)
                    )
                  }}
                />
                <span className="text-sm">{age}</span>
              </label>
            ))}
          </div>
        </div>

        {/* // Fill country > region provinsi > kota */}
        <LocationSelector
          value={{
            country: form.watch('country') || '',
            region: form.watch('region') || '',
            city: form.watch('city') || '',
          }}
          onChange={(location) => {
            form.setValue('country', location.country)
            form.setValue('region', location.region)
            form.setValue('city', location.city)
          }}
        />
      </div>

      {/* Concept & Formula Section */}
      <div className="glass-effect rounded-xl p-6 space-y-4">
        <h3 className="text-xl font-semibold text-brand-secondary mb-4">Concept & Formula</h3>

        {/* // Fill concept formula */}
        <div className="space-y-2">
          <Label htmlFor="formulaNarrative">Formula Narrative *</Label>
          <Textarea
            id="formulaNarrative"
            {...form.register('formulaNarrative')}
            placeholder="Describe the product concept, key benefits, and formulation approach"
            className="input-field min-h-[120px]"
          />
          <p className="text-xs text-brand-primary">
            Explain how this formula addresses target concerns and manufacturing considerations
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="benchmark">Benchmark Product (Optional)</Label>
          <Input
            id="benchmark"
            {...form.register('benchmark')}
            placeholder="e.g., The Ordinary Niacinamide 10%"
            className="input-field"
          />
        </div>

        {/* // Add ingredients */}
        <IngredientsInput
          value={form.watch('ingredients') || []}
          onChange={(value) => form.setValue('ingredients', value)}
        />

        <div className="space-y-2">
          <Label htmlFor="additionalNotes">Additional Notes</Label>
          <Textarea
            id="additionalNotes"
            {...form.register('additionalNotes')}
            placeholder="Any other formulation requirements or constraints"
            className="input-field"
          />
        </div>
      </div>

      {/* Extended Product Details */}
      <div className="glass-effect rounded-xl p-6 space-y-6">
        <h3 className="text-xl font-semibold text-brand-secondary mb-4">Extended Product Details</h3>

        {/* //_new_requires clinical study */}
        <div className="flex items-center justify-between glass-effect p-4 rounded-lg">
          <div>
            <Label htmlFor="requiresClinicalStudy">Requires Clinical Study</Label>
            <p className="text-xs text-brand-primary">Will this product need clinical efficacy testing?</p>
          </div>
          <Switch
            id="requiresClinicalStudy"
            checked={form.watch('requiresClinicalStudy')}
            onCheckedChange={(checked) => form.setValue('requiresClinicalStudy', checked)}
          />
        </div>

        {/* //_new_needs halal certification */}
        <div className="flex items-center justify-between glass-effect p-4 rounded-lg">
          <div>
            <Label htmlFor="needsHalalCertification">Needs Halal Certification</Label>
            <p className="text-xs text-brand-primary">Target markets requiring halal compliance</p>
          </div>
          <Switch
            id="needsHalalCertification"
            checked={form.watch('needsHalalCertification')}
            onCheckedChange={(checked) => form.setValue('needsHalalCertification', checked)}
          />
        </div>

        {/* //_new_preferred launch timeline */}
        <div className="space-y-2">
          <Label htmlFor="launchTimeline">Preferred Launch Timeline</Label>
          <Select onValueChange={(value) => form.setValue('launchTimeline', value)}>
            <SelectTrigger className="input-field">
              <SelectValue placeholder="Select quarter" />
            </SelectTrigger>
            <SelectContent>
              {generateQuarters().map((q) => (
                <SelectItem key={q.value} value={q.value}>
                  {q.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* //_new_target retail price */}
        <div className="space-y-2">
          <Label htmlFor="targetRetailPrice">Target Retail Price (IDR)</Label>
          <Input
            id="targetRetailPrice"
            type="number"
            {...form.register('targetRetailPrice', { valueAsNumber: true })}
            placeholder="150000"
            className="input-field"
          />
          {form.watch('targetRetailPrice') && (
            <p className="text-xs text-brand-primary">
              {formatCurrency(form.watch('targetRetailPrice') || 0)}
            </p>
          )}
        </div>

        {/* //_new_pilot batch size */}
        <div className="space-y-2">
          <Label htmlFor="pilotBatchSize">Pilot Batch Size (units)</Label>
          <Input
            id="pilotBatchSize"
            type="number"
            {...form.register('pilotBatchSize', { valueAsNumber: true })}
            placeholder="500"
            className="input-field"
          />
          <p className="text-xs text-brand-primary">Initial production run for testing</p>
        </div>

        {/* //_new_moq expectation */}
        <div className="space-y-2">
          <Label htmlFor="moqExpectation">MOQ Expectation (units)</Label>
          <Input
            id="moqExpectation"
            type="number"
            {...form.register('moqExpectation', { valueAsNumber: true })}
            placeholder="1000"
            className="input-field"
          />
          <p className="text-xs text-brand-primary">Minimum order quantity for production</p>
        </div>

        {/* //_new_distribution focus */}
        <div className="space-y-2">
          <Label>Distribution Focus *</Label>
          <Select
            onValueChange={(value: any) => form.setValue('distributionFocus', value)}
            defaultValue="Domestic Retail"
          >
            <SelectTrigger className="input-field">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Domestic Retail">Domestic Retail</SelectItem>
              <SelectItem value="ASEAN Export">ASEAN Export</SelectItem>
              <SelectItem value="Global Prestige">Global Prestige</SelectItem>
              <SelectItem value="D2C Online">D2C Online</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* //_new_sustainability priority */}
        <div className="space-y-2">
          <Label htmlFor="sustainabilityPriority">
            Sustainability Priority: {form.watch('sustainabilityPriority')}
          </Label>
          <Slider
            value={[form.watch('sustainabilityPriority') || 50]}
            onValueChange={(value) => form.setValue('sustainabilityPriority', value[0])}
            max={100}
            step={1}
            className="py-4"
          />
          <div className="flex justify-between text-xs text-brand-primary">
            <span>Standard</span>
            <span>Eco-Conscious</span>
            <span>Zero-Waste</span>
          </div>
        </div>

        {/* //_new_regulatory priority */}
        <div className="space-y-2">
          <Label>Regulatory Priority</Label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {['BPOM', 'ASEAN Cosmetic Directive', 'EU CPNP', 'US FDA OTC', 'Halal MUI', 'Vegan Society'].map((reg) => (
              <label key={reg} className="flex items-center gap-2 glass-effect px-4 py-2 rounded-lg cursor-pointer">
                <Checkbox
                  checked={form.watch('regulatoryPriority')?.includes(reg)}
                  onCheckedChange={(checked) => {
                    const current = form.watch('regulatoryPriority') || []
                    form.setValue(
                      'regulatoryPriority',
                      checked ? [...current, reg] : current.filter((r) => r !== reg)
                    )
                  }}
                />
                <span className="text-sm">{reg}</span>
              </label>
            ))}
          </div>
        </div>

        {/* //_new_texture preference */}
        <div className="space-y-2">
          <Label htmlFor="texturePreference">Texture Preference</Label>
          <Textarea
            id="texturePreference"
            {...form.register('texturePreference')}
            placeholder="Describe desired finish, absorption rate, cooling effect, etc."
            className="input-field"
          />
        </div>

        {/* //_new_fragrance profile */}
        <div className="space-y-2">
          <Label htmlFor="fragranceProfile">Fragrance Profile</Label>
          <Textarea
            id="fragranceProfile"
            {...form.register('fragranceProfile')}
            placeholder="Scent direction, intensity level, allergen considerations"
            className="input-field"
          />
        </div>

        {/* //_new_claim emphasis */}
        <div className="space-y-2">
          <Label>Claim Emphasis</Label>
          <div className="flex flex-wrap gap-2">
            {['Dermatologically Tested', 'Reef Safe', 'Blue Light Shield', 'Pregnancy Safe', 'Cruelty-Free', 'Vegan'].map((claim) => (
              <label key={claim} className="flex items-center gap-2 glass-effect px-4 py-2 rounded-lg cursor-pointer">
                <Checkbox
                  checked={form.watch('claimEmphasis')?.includes(claim)}
                  onCheckedChange={(checked) => {
                    const current = form.watch('claimEmphasis') || []
                    form.setValue(
                      'claimEmphasis',
                      checked ? [...current, claim] : current.filter((c) => c !== claim)
                    )
                  }}
                />
                <span className="text-sm">{claim}</span>
              </label>
            ))}
          </div>
        </div>

        {/* //_new_ai image style */}
        <div className="space-y-2">
          <Label htmlFor="aiImageStyle">AI Image Style</Label>
          <Input
            id="aiImageStyle"
            {...form.register('aiImageStyle')}
            placeholder="e.g., Minimalist product photography, Botanical illustration"
            className="input-field"
          />
          <p className="text-xs text-brand-primary">Prompt descriptor for future image/packaging generation</p>
        </div>

        {/* //_new_notes for design team */}
        <div className="space-y-2">
          <Label htmlFor="notesForDesignTeam">Notes for Design Team</Label>
          <Textarea
            id="notesForDesignTeam"
            {...form.register('notesForDesignTeam')}
            placeholder="Freeform creative brief, mood boards, references"
            className="input-field min-h-[100px]"
          />
        </div>
      </div>

      {/* Collaboration Preferences */}
      <div className="glass-effect rounded-xl p-6 space-y-4">
        <h3 className="text-xl font-semibold text-brand-secondary mb-4">Collaboration Preferences</h3>

        <div className="space-y-2">
          <Label>Preferred Channels *</Label>
          <div className="flex flex-wrap gap-2">
            {['Email', 'WhatsApp', 'Slack', 'Teams'].map((channel) => (
              <label key={channel} className="flex items-center gap-2 glass-effect px-4 py-2 rounded-lg cursor-pointer">
                <Checkbox
                  checked={form.watch('preferredChannels')?.includes(channel)}
                  onCheckedChange={(checked) => {
                    const current = form.watch('preferredChannels') || []
                    form.setValue(
                      'preferredChannels',
                      checked ? [...current, channel] : current.filter((c) => c !== channel)
                    )
                  }}
                />
                <span className="text-sm">{channel}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <Label>Requested Deliverables *</Label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {['AI concept deck', 'Packaging mockups', 'Campaign prompts', 'Ingredient dossier', 'Regulatory dossier'].map((deliverable) => (
              <label key={deliverable} className="flex items-center gap-2 glass-effect px-4 py-2 rounded-lg cursor-pointer">
                <Checkbox
                  checked={form.watch('requestedDeliverables')?.includes(deliverable)}
                  onCheckedChange={(checked) => {
                    const current = form.watch('requestedDeliverables') || []
                    form.setValue(
                      'requestedDeliverables',
                      checked ? [...current, deliverable] : current.filter((d) => d !== deliverable)
                    )
                  }}
                />
                <span className="text-sm">{deliverable}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex justify-end">
        <GlowButton type="submit" disabled={isSubmitting} className="px-8 py-4 text-lg">
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Processing...
            </>
          ) : (
            'Generate Product Brief'
          )}
        </GlowButton>
      </div>
    </form>
  )
}
