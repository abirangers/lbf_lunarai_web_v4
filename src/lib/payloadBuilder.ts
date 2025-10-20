import { v4 as uuidv4 } from 'uuid'
import type { SubmissionPayload } from '@/types/submission'

export interface FormValues {
  brandName: string
  brandVoice: string
  brandValues: string
  functions: string[]
  formType: string
  packagingType: string
  packagingFinish?: string
  packagingMaterialNotes?: string
  nettoValue: number
  nettoUnit: 'ml' | 'g'
  colorDescription: string
  colorHex?: string
  gender: string
  ageRanges: string[]
  country: string
  region: string
  city: string
  launchTimeline?: string
  launchYear?: string
  targetRetailPrice?: number
  pilotBatchSize?: number
  moqExpectation?: number
  distributionFocus: 'Domestic Retail' | 'ASEAN Export' | 'Global Prestige' | 'D2C Online'
  sustainabilityPriority: number
  regulatoryPriority: string[]
  texturePreference?: string
  fragranceProfile?: string
  claimEmphasis?: string[]
  aiImageStyle?: string
  requiresClinicalStudy: boolean
  needsHalalCertification: boolean
  preferredChannels: string[]
  requestedDeliverables: string[]
  notesForDesignTeam?: string
  formulaNarrative: string
  benchmark?: string
  additionalNotes?: string
  ingredients: Array<{
    name: string
    inciName?: string
    percentage?: number
    purpose?: string
    notes?: string
  }>
  referenceFiles?: Array<{
    filename: string
    url: string
    mediaType?: string
  }>
  targetEnvironment: 'test' | 'production'
}

export function buildSubmissionPayload(formValues: FormValues): SubmissionPayload {
  const submissionId = uuidv4()
  const submittedAt = new Date().toISOString()

  return {
    submissionId,
    submittedAt,
    targetEnvironment: formValues.targetEnvironment,
    brand: {
      name: formValues.brandName,
      voice: formValues.brandVoice,
      values: formValues.brandValues,
    },
    productBlueprint: {
      functions: formValues.functions,
      formType: formValues.formType,
      packagingPrimer: {
        type: formValues.packagingType,
        finish: formValues.packagingFinish,
        materialNotes: formValues.packagingMaterialNotes,
      },
      netto: {
        value: formValues.nettoValue,
        unit: formValues.nettoUnit,
      },
      colorProfile: {
        description: formValues.colorDescription,
        hex: formValues.colorHex,
      },
      gender: formValues.gender,
      ageRanges: formValues.ageRanges,
      location: {
        country: formValues.country,
        region: formValues.region,
        city: formValues.city,
      },
      launchTimeline: formValues.launchTimeline,
      targetRetailPrice: formValues.targetRetailPrice,
      pilotBatchSize: formValues.pilotBatchSize,
      moqExpectation: formValues.moqExpectation,
      distributionFocus: formValues.distributionFocus,
      sustainabilityPriority: formValues.sustainabilityPriority,
      regulatoryPriority: formValues.regulatoryPriority,
      texturePreference: formValues.texturePreference,
      fragranceProfile: formValues.fragranceProfile,
      claimEmphasis: formValues.claimEmphasis,
      aiImageStyle: formValues.aiImageStyle,
      requiresClinicalStudy: formValues.requiresClinicalStudy,
      needsHalalCertification: formValues.needsHalalCertification,
      referenceUpload: formValues.referenceFiles,
    },
    collaboration: {
      preferredChannels: formValues.preferredChannels,
      requestedDeliverables: formValues.requestedDeliverables,
      notesForDesignTeam: formValues.notesForDesignTeam,
    },
    concept: {
      formulaNarrative: formValues.formulaNarrative,
      benchmark: formValues.benchmark,
      additionalNotes: formValues.additionalNotes,
    },
    ingredients: formValues.ingredients,
    systemMetadata: {
      formVersion: process.env.NEXT_PUBLIC_FORM_VERSION || '1.0.0',
      appVersion: process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0',
      language: process.env.NEXT_PUBLIC_DEFAULT_LANGUAGE || 'id',
    },
  }
}
