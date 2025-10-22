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
    case 'productHeader':
      return <ProductHeaderContent data={data} />
    case 'productDescription':
      return <ProductDescriptionContent data={data} />
    case 'ingredients':
      return <IngredientsContent data={data} />
    case 'pricing':
      return <PricingContent data={data} />
    default:
      return <DefaultContent data={data} />
  }
}

function ProductHeaderContent({ data }: { data: any }) {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-2xl font-bold text-gray-900 mb-2">{data.name}</h3>
        <p className="text-lg text-gray-600 italic">{data.tagline}</p>
      </div>
      <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-100">
        <div>
          <p className="text-xs text-gray-500 mb-1">Category</p>
          <p className="text-sm font-medium text-gray-900">{data.category}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500 mb-1">Subcategory</p>
          <p className="text-sm font-medium text-gray-900">{data.subcategory}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500 mb-1">Market Segment</p>
          <p className="text-sm font-medium text-gray-900">{data.marketSegment}</p>
        </div>
      </div>
    </div>
  )
}

function ProductDescriptionContent({ data }: { data: any }) {
  return (
    <div className="space-y-4">
      <div>
        <h4 className="text-sm font-semibold text-gray-700 mb-2">Description</h4>
        <p className="text-gray-700 leading-relaxed">{data.description}</p>
      </div>
      {data.keyBenefits && data.keyBenefits.length > 0 && (
        <div>
          <h4 className="text-sm font-semibold text-gray-700 mb-2">Key Benefits</h4>
          <ul className="space-y-2">
            {data.keyBenefits.map((benefit: string, index: number) => (
              <li key={index} className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                <span className="text-sm text-gray-700">{benefit}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
      {data.howToUse && (
        <div>
          <h4 className="text-sm font-semibold text-gray-700 mb-2">How to Use</h4>
          <p className="text-sm text-gray-700">{data.howToUse}</p>
        </div>
      )}
    </div>
  )
}

function IngredientsContent({ data }: { data: any }) {
  return (
    <div className="space-y-4">
      {data.list && data.list.length > 0 && (
        <div>
          <h4 className="text-sm font-semibold text-gray-700 mb-3">
            Ingredient List ({data.totalIngredients})
          </h4>
          <div className="space-y-2">
            {data.list.slice(0, 5).map((ingredient: any, index: number) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div>
                  <p className="text-sm font-medium text-gray-900">{ingredient.name}</p>
                  <p className="text-xs text-gray-500">{ingredient.inciName}</p>
                </div>
                <span className="text-sm font-semibold text-blue-600">
                  {ingredient.percentage}%
                </span>
              </div>
            ))}
            {data.list.length > 5 && (
              <p className="text-xs text-gray-500 text-center pt-2">
                + {data.list.length - 5} more ingredients
              </p>
            )}
          </div>
        </div>
      )}
      {data.analysis && (
        <div className="pt-4 border-t border-gray-100">
          <h4 className="text-sm font-semibold text-gray-700 mb-2">Formulation Analysis</h4>
          <p className="text-sm text-gray-700">{data.analysis.overallAssessment}</p>
        </div>
      )}
    </div>
  )
}

function PricingContent({ data }: { data: any }) {
  return (
    <div className="space-y-4">
      {data.cogs && (
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-blue-50 rounded-lg">
            <p className="text-xs text-blue-600 mb-1">COGS per Unit</p>
            <p className="text-2xl font-bold text-blue-900">
              Rp {data.cogs.perUnit?.toLocaleString()}
            </p>
          </div>
          <div className="p-4 bg-green-50 rounded-lg">
            <p className="text-xs text-green-600 mb-1">Retail Price</p>
            <p className="text-2xl font-bold text-green-900">
              Rp {data.pricing?.retail?.toLocaleString()}
            </p>
          </div>
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
    productHeader: 'Product Header',
    productDescription: 'Product Description',
    alternativeNames: 'Alternative Product Names',
    ingredients: 'Ingredients Analysis',
    marketAnalysis: 'Market Analysis',
    competitorAnalysis: 'Competitor Analysis',
    copywriting: 'Marketing Copy',
    pricing: 'Pricing Strategy',
    compliance: 'Regulatory Compliance',
    productionTimeline: 'Production Timeline',
    sustainability: 'Sustainability Assessment',
    nextSteps: 'Next Steps & Recommendations',
  }

  return titles[sectionType] || sectionType.replace(/([A-Z])/g, ' $1').trim()
}
