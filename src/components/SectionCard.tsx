'use client'

import { motion } from 'framer-motion'
import { CheckCircle, AlertCircle, Loader2 } from 'lucide-react'

interface SectionCardProps {
  section: {
    sectionType: string
    order: number
    data: any
    metadata?: any
  }
  status?: 'loading' | 'completed' | 'error'
  error?: string
}

export function SectionCard({ section, status = 'completed', error }: SectionCardProps) {
  const sectionTitle = formatSectionTitle(section.sectionType)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        duration: 0.5,
        ease: [0.4, 0, 0.2, 1],
        delay: 0.1,
      }}
      className="mb-6 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow"
    >
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Status Icon */}
            {status === 'completed' && (
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              >
                <CheckCircle className="w-6 h-6 text-green-600" />
              </motion.div>
            )}
            {status === 'loading' && <Loader2 className="w-6 h-6 text-blue-600 animate-spin" />}
            {status === 'error' && <AlertCircle className="w-6 h-6 text-red-600" />}

            {/* Title */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900">{sectionTitle}</h2>
              {section.metadata?.ai_model && (
                <p className="text-xs text-gray-500 mt-0.5">
                  Generated with {section.metadata.ai_model}
                </p>
              )}
            </div>
          </div>

          {/* Order Badge */}
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-full">
              Section {section.order}
            </span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-6 py-5">
        {status === 'loading' && (
          <div className="flex items-center justify-center py-8">
            <div className="text-center">
              <Loader2 className="w-8 h-8 text-blue-600 animate-spin mx-auto mb-2" />
              <p className="text-sm text-gray-600">Processing {sectionTitle.toLowerCase()}...</p>
            </div>
          </div>
        )}

        {status === 'error' && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-sm text-red-800 font-medium mb-1">Failed to generate this section</p>
            <p className="text-xs text-red-600">{error || 'An error occurred during processing'}</p>
          </div>
        )}

        {status === 'completed' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
            <SectionContent sectionType={section.sectionType} data={section.data} />
          </motion.div>
        )}
      </div>

      {/* Footer with metadata */}
      {status === 'completed' && section.metadata && (
        <div className="px-6 py-3 bg-gray-50 border-t border-gray-100">
          <div className="flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center gap-4">
              {section.metadata.generated_at && (
                <span>
                  Generated {new Date(section.metadata.generated_at).toLocaleTimeString()}
                </span>
              )}
              {section.metadata.mcp_sources && section.metadata.mcp_sources.length > 0 && (
                <span className="flex items-center gap-1">
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4"
                    />
                  </svg>
                  {section.metadata.mcp_sources.length} data source(s)
                </span>
              )}
            </div>
          </div>
        </div>
      )}
    </motion.div>
  )
}

// Section-specific content renderers
function SectionContent({ sectionType, data }: { sectionType: string; data: any }) {
  switch (sectionType) {
    case 'productOverview':
      return <ProductOverviewContent data={data} />
    case 'formulaTexture':
      return <FormulaTextureContent data={data} />
    case 'packagingDesign':
      return <PackagingDesignContent data={data} />
    case 'sensoryExperience':
      return <SensoryExperienceContent data={data} />
    case 'pricingStrategy':
      return <PricingStrategyContent data={data} />
    case 'productionMOQ':
      return <ProductionMOQContent data={data} />
    case 'targetMarketAnalysis':
      return <TargetMarketAnalysisContent data={data} />
    case 'marketingCopy':
      return <MarketingCopyContent data={data} />
    case 'competitorAnalysis':
      return <CompetitorAnalysisContent data={data} />
    case 'goToMarketStrategy':
      return <GoToMarketStrategyContent data={data} />
    case 'brandIdentity':
      return <BrandIdentityContent data={data} />
    default:
      return <DefaultContent data={data} />
  }
}

// New Section Content Renderers based on actual form data

function ProductOverviewContent({ data }: { data: any }) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-3 bg-blue-50 rounded-lg">
          <p className="text-xs text-blue-600 mb-1">Product Type</p>
          <p className="text-sm font-semibold text-gray-900">{data.productType || '-'}</p>
        </div>
        <div className="p-3 bg-purple-50 rounded-lg">
          <p className="text-xs text-purple-600 mb-1">Target Gender</p>
          <p className="text-sm font-semibold text-gray-900">{data.targetGender || '-'}</p>
        </div>
        <div className="p-3 bg-cyan-50 rounded-lg">
          <p className="text-xs text-cyan-600 mb-1">Target Age</p>
          <p className="text-sm font-semibold text-gray-900">{data.targetAge || '-'}</p>
        </div>
        <div className="p-3 bg-green-50 rounded-lg">
          <p className="text-xs text-green-600 mb-1">Net Weight</p>
          <p className="text-sm font-semibold text-gray-900">{data.netWeight || '-'}</p>
        </div>
      </div>
      {data.keyFunctions && data.keyFunctions.length > 0 && (
        <div>
          <h4 className="text-sm font-semibold text-gray-700 mb-2">Key Functions</h4>
          <div className="flex flex-wrap gap-2">
            {data.keyFunctions.map((func: string, idx: number) => (
              <span
                key={idx}
                className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium"
              >
                {func}
              </span>
            ))}
          </div>
        </div>
      )}
      {data.summary && (
        <div className="pt-3 border-t border-gray-100">
          <p className="text-sm text-gray-700 leading-relaxed">{data.summary}</p>
        </div>
      )}
    </div>
  )
}

function FormulaTextureContent({ data }: { data: any }) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <h4 className="text-sm font-semibold text-gray-700 mb-2">Form Type</h4>
          <p className="text-gray-700">{data.formType || '-'}</p>
        </div>
        <div>
          <h4 className="text-sm font-semibold text-gray-700 mb-2">Consistency</h4>
          <p className="text-gray-700">{data.expectedConsistency || '-'}</p>
        </div>
      </div>
      {data.textureDescription && (
        <div>
          <h4 className="text-sm font-semibold text-gray-700 mb-2">Texture Description</h4>
          <p className="text-sm text-gray-700 leading-relaxed">{data.textureDescription}</p>
        </div>
      )}
      {data.recommendedIngredients && data.recommendedIngredients.length > 0 && (
        <div>
          <h4 className="text-sm font-semibold text-gray-700 mb-2">Recommended Ingredients</h4>
          <ul className="space-y-2">
            {data.recommendedIngredients.map((ingredient: string, idx: number) => (
              <li key={idx} className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                <span className="text-sm text-gray-700">{ingredient}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

function PackagingDesignContent({ data }: { data: any }) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 bg-gray-50 rounded-lg">
          <p className="text-xs text-gray-600 mb-1">Packaging Type</p>
          <p className="text-lg font-semibold text-gray-900">{data.packagingType || '-'}</p>
        </div>
        <div className="p-4 bg-gray-50 rounded-lg">
          <p className="text-xs text-gray-600 mb-1">Material</p>
          <p className="text-lg font-semibold text-gray-900">{data.material || '-'}</p>
        </div>
      </div>
      {data.colorScheme && (
        <div>
          <h4 className="text-sm font-semibold text-gray-700 mb-2">Color Scheme</h4>
          <div className="flex items-center gap-3">
            <div
              className="w-12 h-12 rounded-lg border-2 border-gray-200"
              style={{ backgroundColor: data.colorScheme.primary }}
            />
            <div>
              <p className="text-sm font-medium text-gray-900">{data.colorScheme.primary}</p>
              <p className="text-xs text-gray-600">{data.colorScheme.description}</p>
            </div>
          </div>
        </div>
      )}
      {data.designNotes && (
        <div>
          <h4 className="text-sm font-semibold text-gray-700 mb-2">Design Notes</h4>
          <p className="text-sm text-gray-700">{data.designNotes}</p>
        </div>
      )}
    </div>
  )
}

function SensoryExperienceContent({ data }: { data: any }) {
  return (
    <div className="space-y-4">
      {data.fragrance && (
        <div className="p-4 bg-purple-50 rounded-lg">
          <h4 className="text-sm font-semibold text-purple-900 mb-2">Fragrance Profile</h4>
          <p className="text-sm text-gray-700 mb-2">{data.fragrance.profile}</p>
          {data.fragrance.notes && data.fragrance.notes.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {data.fragrance.notes.map((note: string, idx: number) => (
                <span key={idx} className="px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs">
                  {note}
                </span>
              ))}
            </div>
          )}
        </div>
      )}
      {data.texture && (
        <div>
          <h4 className="text-sm font-semibold text-gray-700 mb-2">Texture & Feel</h4>
          <div className="grid grid-cols-2 gap-3">
            <div className="text-sm">
              <span className="text-gray-600">Feel:</span>{' '}
              <span className="text-gray-900 font-medium">{data.texture.feel}</span>
            </div>
            <div className="text-sm">
              <span className="text-gray-600">Absorption:</span>{' '}
              <span className="text-gray-900 font-medium">{data.texture.absorption}</span>
            </div>
          </div>
        </div>
      )}
      {data.userExperience && (
        <div className="pt-3 border-t border-gray-100">
          <p className="text-sm text-gray-700 italic">{data.userExperience}</p>
        </div>
      )}
    </div>
  )
}

function PricingStrategyContent({ data }: { data: any }) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 bg-blue-50 rounded-lg">
          <p className="text-xs text-blue-600 mb-1">Target Retail Price</p>
          <p className="text-2xl font-bold text-blue-900">{data.targetRetailPrice || '-'}</p>
        </div>
        <div className="p-4 bg-green-50 rounded-lg">
          <p className="text-xs text-green-600 mb-1">Price per Gram</p>
          <p className="text-2xl font-bold text-green-900">{data.pricePerGram || '-'}</p>
        </div>
      </div>
      {data.marketSegment && (
        <div className="p-3 bg-purple-50 rounded-lg">
          <p className="text-xs text-purple-600 mb-1">Market Segment</p>
          <p className="text-lg font-semibold text-purple-900">{data.marketSegment}</p>
        </div>
      )}
      {data.valueProposition && (
        <div className="pt-3 border-t border-gray-100">
          <h4 className="text-sm font-semibold text-gray-700 mb-2">Value Proposition</h4>
          <p className="text-sm text-gray-700">{data.valueProposition}</p>
        </div>
      )}
    </div>
  )
}

function ProductionMOQContent({ data }: { data: any }) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 bg-cyan-50 rounded-lg">
          <p className="text-xs text-cyan-600 mb-1">Minimum Order Quantity</p>
          <p className="text-2xl font-bold text-cyan-900">
            {data.minimumOrderQuantity?.toLocaleString() || '-'} units
          </p>
        </div>
        <div className="p-4 bg-blue-50 rounded-lg">
          <p className="text-xs text-blue-600 mb-1">Total Production</p>
          <p className="text-lg font-semibold text-blue-900">{data.totalProduction || '-'}</p>
        </div>
      </div>
      {data.estimatedLeadTime && (
        <div className="p-3 bg-yellow-50 rounded-lg">
          <p className="text-xs text-yellow-700 mb-1">Estimated Lead Time</p>
          <p className="text-lg font-semibold text-yellow-900">{data.estimatedLeadTime}</p>
        </div>
      )}
      {data.productionPhases && data.productionPhases.length > 0 && (
        <div>
          <h4 className="text-sm font-semibold text-gray-700 mb-3">Production Phases</h4>
          <div className="space-y-2">
            {data.productionPhases.map((phase: any, idx: number) => (
              <div
                key={idx}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <span className="text-sm font-medium text-gray-900">{phase.phase}</span>
                <span className="text-sm text-gray-600">{phase.duration}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function TargetMarketAnalysisContent({ data }: { data: any }) {
  return (
    <div className="space-y-4">
      {data.demographics && (
        <div className="p-4 bg-blue-50 rounded-lg">
          <h4 className="text-sm font-semibold text-blue-900 mb-3">Demographics</h4>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <span className="text-blue-700">Gender:</span>{' '}
              <span className="text-gray-900 font-medium">{data.demographics.gender}</span>
            </div>
            <div>
              <span className="text-blue-700">Age:</span>{' '}
              <span className="text-gray-900 font-medium">{data.demographics.ageRange}</span>
            </div>
            <div>
              <span className="text-blue-700">Income:</span>{' '}
              <span className="text-gray-900 font-medium">{data.demographics.incomeLevel}</span>
            </div>
            <div>
              <span className="text-blue-700">Location:</span>{' '}
              <span className="text-gray-900 font-medium">{data.demographics.location}</span>
            </div>
          </div>
        </div>
      )}
      {data.psychographics && (
        <div>
          <h4 className="text-sm font-semibold text-gray-700 mb-2">Psychographics</h4>
          {data.psychographics.concerns && (
            <div className="mb-2">
              <p className="text-xs text-gray-600 mb-1">Key Concerns:</p>
              <div className="flex flex-wrap gap-2">
                {data.psychographics.concerns.map((concern: string, idx: number) => (
                  <span key={idx} className="px-2 py-1 bg-red-100 text-red-700 rounded text-xs">
                    {concern}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
      {data.marketSize && (
        <div className="pt-3 border-t border-gray-100">
          <h4 className="text-sm font-semibold text-gray-700 mb-2">Market Size</h4>
          <p className="text-sm text-gray-700">{data.marketSize.indonesia}</p>
        </div>
      )}
    </div>
  )
}

function MarketingCopyContent({ data }: { data: any }) {
  return (
    <div className="space-y-4">
      {data.productName && (
        <div>
          <h3 className="text-2xl font-bold text-gray-900 mb-1">{data.productName}</h3>
          {data.tagline && <p className="text-lg text-gray-600 italic">{data.tagline}</p>}
        </div>
      )}
      {data.headline && (
        <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
          <p className="text-lg font-semibold text-gray-900">{data.headline}</p>
        </div>
      )}
      {data.bodyCopy && (
        <div>
          <h4 className="text-sm font-semibold text-gray-700 mb-2">Body Copy</h4>
          <p className="text-sm text-gray-700 leading-relaxed">{data.bodyCopy}</p>
        </div>
      )}
      {data.keyBenefits && data.keyBenefits.length > 0 && (
        <div>
          <h4 className="text-sm font-semibold text-gray-700 mb-2">Key Benefits</h4>
          <ul className="space-y-2">
            {data.keyBenefits.map((benefit: string, idx: number) => (
              <li key={idx} className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                <span className="text-sm text-gray-700">{benefit}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
      {data.callToAction && (
        <div className="p-4 bg-blue-600 text-white rounded-lg text-center">
          <p className="font-semibold">{data.callToAction}</p>
        </div>
      )}
    </div>
  )
}

function CompetitorAnalysisContent({ data }: { data: any }) {
  return (
    <div className="space-y-4">
      {data.competitors && data.competitors.length > 0 && (
        <div>
          <h4 className="text-sm font-semibold text-gray-700 mb-3">Key Competitors</h4>
          <div className="space-y-3">
            {data.competitors.map((competitor: any, idx: number) => (
              <div key={idx} className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-start justify-between mb-2">
                  <h5 className="font-semibold text-gray-900">{competitor.name}</h5>
                  {competitor.priceRange && (
                    <span className="text-sm text-gray-600">{competitor.priceRange}</span>
                  )}
                </div>
                {competitor.strengths && (
                  <div className="mb-2">
                    <p className="text-xs text-green-700 font-medium mb-1">Strengths:</p>
                    <ul className="text-sm text-gray-700 space-y-1">
                      {competitor.strengths.map((strength: string, i: number) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="text-green-600">+</span>
                          <span>{strength}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {competitor.weaknesses && (
                  <div>
                    <p className="text-xs text-red-700 font-medium mb-1">Weaknesses:</p>
                    <ul className="text-sm text-gray-700 space-y-1">
                      {competitor.weaknesses.map((weakness: string, i: number) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="text-red-600">-</span>
                          <span>{weakness}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
      {data.competitiveAdvantage && (
        <div className="p-4 bg-blue-50 rounded-lg">
          <h4 className="text-sm font-semibold text-blue-900 mb-2">Our Competitive Advantage</h4>
          <p className="text-sm text-gray-700">{data.competitiveAdvantage}</p>
        </div>
      )}
      {data.marketPositioning && (
        <div className="pt-3 border-t border-gray-100">
          <h4 className="text-sm font-semibold text-gray-700 mb-2">Market Positioning</h4>
          <p className="text-sm text-gray-700">{data.marketPositioning}</p>
        </div>
      )}
    </div>
  )
}

function GoToMarketStrategyContent({ data }: { data: any }) {
  return (
    <div className="space-y-4">
      {data.launchPlan && (
        <div className="p-4 bg-purple-50 rounded-lg">
          <h4 className="text-sm font-semibold text-purple-900 mb-2">Launch Plan</h4>
          <p className="text-sm text-gray-700">{data.launchPlan}</p>
        </div>
      )}
      {data.marketingChannels && data.marketingChannels.length > 0 && (
        <div>
          <h4 className="text-sm font-semibold text-gray-700 mb-3">Marketing Channels</h4>
          <div className="grid grid-cols-2 gap-3">
            {data.marketingChannels.map((channel: any, idx: number) => (
              <div key={idx} className="p-3 bg-gray-50 rounded-lg">
                <p className="font-medium text-gray-900 text-sm">{channel.name}</p>
                {channel.budget && (
                  <p className="text-xs text-gray-600 mt-1">Budget: {channel.budget}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
      {data.keyMessages && data.keyMessages.length > 0 && (
        <div>
          <h4 className="text-sm font-semibold text-gray-700 mb-2">Key Messages</h4>
          <ul className="space-y-2">
            {data.keyMessages.map((message: string, idx: number) => (
              <li key={idx} className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                <span className="text-sm text-gray-700">{message}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
      {data.promotionalActivities && (
        <div className="pt-3 border-t border-gray-100">
          <h4 className="text-sm font-semibold text-gray-700 mb-2">Promotional Activities</h4>
          <p className="text-sm text-gray-700">{data.promotionalActivities}</p>
        </div>
      )}
    </div>
  )
}

function BrandIdentityContent({ data }: { data: any }) {
  return (
    <div className="space-y-4">
      {data.brandName && (
        <div className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg">
          <h3 className="text-2xl font-bold text-gray-900 mb-2">{data.brandName}</h3>
          {data.brandTagline && <p className="text-lg text-gray-600 italic">{data.brandTagline}</p>}
        </div>
      )}
      {data.brandStory && (
        <div>
          <h4 className="text-sm font-semibold text-gray-700 mb-2">Brand Story</h4>
          <p className="text-sm text-gray-700 leading-relaxed">{data.brandStory}</p>
        </div>
      )}
      {data.uniqueValueProposition && (
        <div className="p-4 bg-yellow-50 rounded-lg">
          <h4 className="text-sm font-semibold text-yellow-900 mb-2">Unique Value Proposition</h4>
          <p className="text-sm text-gray-700">{data.uniqueValueProposition}</p>
        </div>
      )}
      {data.brandValues && data.brandValues.length > 0 && (
        <div>
          <h4 className="text-sm font-semibold text-gray-700 mb-2">Brand Values</h4>
          <div className="flex flex-wrap gap-2">
            {data.brandValues.map((value: string, idx: number) => (
              <span
                key={idx}
                className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium"
              >
                {value}
              </span>
            ))}
          </div>
        </div>
      )}
      {data.brandPersonality && (
        <div className="pt-3 border-t border-gray-100">
          <h4 className="text-sm font-semibold text-gray-700 mb-2">Brand Personality</h4>
          <p className="text-sm text-gray-700">{data.brandPersonality}</p>
        </div>
      )}
      {data.brandPositioning && (
        <div className="p-4 bg-green-50 rounded-lg">
          <h4 className="text-sm font-semibold text-green-900 mb-2">Brand Positioning</h4>
          <p className="text-sm text-gray-700">{data.brandPositioning}</p>
        </div>
      )}
    </div>
  )
}

function DefaultContent({ data }: { data: any }) {
  return (
    <div className="prose prose-sm max-w-none">
      <pre className="bg-gray-50 p-4 rounded-lg overflow-x-auto text-xs">
        {JSON.stringify(data, null, 2)}
      </pre>
    </div>
  )
}

function formatSectionTitle(sectionType: string): string {
  const titles: Record<string, string> = {
    productOverview: 'Product Overview',
    formulaTexture: 'Formula & Texture',
    packagingDesign: 'Packaging Design',
    sensoryExperience: 'Sensory Experience',
    pricingStrategy: 'Pricing Strategy',
    productionMOQ: 'Production & MOQ',
    targetMarketAnalysis: 'Target Market Analysis',
    marketingCopy: 'Marketing Copy',
    competitorAnalysis: 'Competitor Analysis',
    goToMarketStrategy: 'Go-to-Market Strategy',
    brandIdentity: 'Brand Identity',
  }

  return titles[sectionType] || sectionType.replace(/([A-Z])/g, ' $1').trim()
}
