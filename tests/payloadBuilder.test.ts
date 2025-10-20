import { buildSubmissionPayload, type FormValues } from '@/lib/payloadBuilder'

describe('buildSubmissionPayload', () => {
  const mockFormValues: FormValues = {
    brandName: 'Test Brand',
    brandVoice: 'professional',
    brandValues: 'Quality and innovation',
    functions: ['brightening', 'hydrating'],
    formType: 'Serum',
    packagingType: 'dropper',
    nettoValue: 30,
    nettoUnit: 'ml',
    colorDescription: 'Clear',
    gender: 'all',
    ageRanges: ['26-35'],
    country: 'ID',
    region: 'JK',
    city: 'JP',
    formulaNarrative: 'Test formula',
    ingredients: [
      {
        name: 'Niacinamide',
        percentage: 10,
        purpose: 'Brightening',
      },
    ],
    distributionFocus: 'Domestic Retail',
    sustainabilityPriority: 50,
    regulatoryPriority: ['BPOM'],
    requiresClinicalStudy: false,
    needsHalalCertification: true,
    preferredChannels: ['Email'],
    requestedDeliverables: ['AI concept deck'],
    targetEnvironment: 'test',
  }

  it('should generate valid submission payload', () => {
    const payload = buildSubmissionPayload(mockFormValues)

    expect(payload).toHaveProperty('submissionId')
    expect(payload).toHaveProperty('submittedAt')
    expect(payload.targetEnvironment).toBe('test')
    expect(payload.brand.name).toBe('Test Brand')
    expect(payload.productBlueprint.functions).toContain('brightening')
    expect(payload.ingredients).toHaveLength(1)
  })

  it('should include system metadata', () => {
    const payload = buildSubmissionPayload(mockFormValues)

    expect(payload.systemMetadata).toHaveProperty('formVersion')
    expect(payload.systemMetadata).toHaveProperty('appVersion')
    expect(payload.systemMetadata).toHaveProperty('language')
  })

  it('should handle optional fields', () => {
    const minimalValues: FormValues = {
      ...mockFormValues,
      benchmark: undefined,
      additionalNotes: undefined,
      launchTimeline: undefined,
    }

    const payload = buildSubmissionPayload(minimalValues)

    expect(payload.concept.benchmark).toBeUndefined()
    expect(payload.concept.additionalNotes).toBeUndefined()
    expect(payload.productBlueprint.launchTimeline).toBeUndefined()
  })

  it('should preserve ingredient details', () => {
    const payload = buildSubmissionPayload(mockFormValues)

    expect(payload.ingredients[0].name).toBe('Niacinamide')
    expect(payload.ingredients[0].percentage).toBe(10)
    expect(payload.ingredients[0].purpose).toBe('Brightening')
  })
})
