import { z } from 'zod'

export const SubmissionPayloadSchema = z.object({
  submissionId: z.string().uuid(),
  submittedAt: z.string().datetime(),
  targetEnvironment: z.enum(['test', 'production']),
  brand: z.object({
    name: z.string().min(1, 'Brand name is required'),
    voice: z.string().min(1, 'Brand voice is required'),
    values: z.string().min(1, 'Brand values are required'),
  }),
  productBlueprint: z.object({
    functions: z.array(z.string()).min(1, 'Select at least one function'),
    formType: z.string().min(1, 'Form type is required'),
    packagingPrimer: z.object({
      type: z.string().min(1, 'Packaging type is required'),
      finish: z.string().optional(),
      materialNotes: z.string().optional(),
    }),
    netto: z.object({
      value: z.number().positive('Netto value must be positive'),
      unit: z.enum(['ml', 'g']),
    }),
    colorProfile: z.object({
      description: z.string().min(1, 'Color description is required'),
      hex: z.string().optional(),
    }),
    gender: z.string().min(1, 'Gender is required'),
    ageRanges: z.array(z.string()).min(1, 'Select at least one age range'),
    location: z.object({
      country: z.string().min(1, 'Country is required'),
      region: z.string().min(1, 'Region is required'),
      city: z.string().min(1, 'City is required'),
    }),
    launchTimeline: z.string().optional(),
    targetRetailPrice: z.number().optional(),
    pilotBatchSize: z.number().optional(),
    moqExpectation: z.number().optional(),
    distributionFocus: z.enum([
      'Domestic Retail',
      'ASEAN Export',
      'Global Prestige',
      'D2C Online',
    ]),
    sustainabilityPriority: z.number().min(0).max(100),
    regulatoryPriority: z.array(z.string()),
    texturePreference: z.string().optional(),
    fragranceProfile: z.string().optional(),
    claimEmphasis: z.array(z.string()).optional(),
    aiImageStyle: z.string().optional(),
    requiresClinicalStudy: z.boolean(),
    needsHalalCertification: z.boolean(),
    referenceUpload: z
      .array(
        z.object({
          filename: z.string(),
          url: z.string(),
          mediaType: z.string().optional(),
        })
      )
      .optional(),
  }),
  collaboration: z.object({
    preferredChannels: z.array(z.string()).min(1, 'Select at least one channel'),
    requestedDeliverables: z.array(z.string()).min(1, 'Select at least one deliverable'),
    notesForDesignTeam: z.string().optional(),
  }),
  concept: z.object({
    formulaNarrative: z.string().min(1, 'Formula narrative is required'),
    benchmark: z.string().optional(),
    additionalNotes: z.string().optional(),
  }),
  ingredients: z.array(
    z.object({
      name: z.string().min(1, 'Ingredient name is required'),
      inciName: z.string().optional(),
      percentage: z.number().optional(),
      purpose: z.string().optional(),
      notes: z.string().optional(),
    })
  ),
  systemMetadata: z.object({
    formVersion: z.string(),
    appVersion: z.string(),
    language: z.string(),
  }),
})

export type SubmissionPayload = z.infer<typeof SubmissionPayloadSchema>

export interface ReportData {
  submissionId: string
  status: string
  brandName?: string
  payload?: SubmissionPayload
  sections: {
    productHeader?: any
    productDescription?: any
    alternativeNames?: any
    ingredients?: any
    scientificReferences?: any
    marketAnalysis?: any
    competitors?: any
    copywriting?: any
    packaging?: any
    pricing?: any
    regulatory?: any
    productionTimeline?: any
    stabilityTesting?: any
    sensoryProfile?: any
    sustainability?: any
    riskMitigation?: any
    marketingCampaign?: any
    distributionPlan?: any
    digitalAssets?: any
    faq?: any
    nextSteps?: any
  }
}

export interface WorkflowStatus {
  status: 'queued' | 'running' | 'completed' | 'error'
  progress?: number
  message?: string
  lastUpdated: string
}
