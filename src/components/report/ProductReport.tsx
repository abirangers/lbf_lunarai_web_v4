'use client'

import { GlassCard } from '@/components/common/GlassCard'
import { SectionHeader } from '@/components/common/SectionHeader'
import type { ReportData } from '@/types/submission'

interface ProductReportProps {
  data: ReportData
}

export function ProductReport({ data }: ProductReportProps) {
  const { sections, payload } = data

  return (
    <div className="space-y-8">
      {/* Product Header */}
      {sections?.productHeader && (
        <GlassCard>
          <h2 className="text-3xl font-bold text-brand-secondary mb-4">
            {sections.productHeader.name || payload?.brand?.name}
          </h2>
          <p className="text-brand-primary">{sections.productHeader.tagline}</p>
        </GlassCard>
      )}

      {/* Product Description */}
      {sections?.productDescription && (
        <GlassCard>
          <SectionHeader title="Product Description" />
          <div className="prose prose-sm max-w-none">
            <p className="text-brand-primary">{sections.productDescription.description}</p>
          </div>
        </GlassCard>
      )}

      {/* Alternative Names */}
      {sections?.alternativeNames && (
        <GlassCard>
          <SectionHeader title="Alternative Product Names" />
          <div className="flex flex-wrap gap-2">
            {sections.alternativeNames.names?.map((name: string, idx: number) => (
              <span key={idx} className="glass-effect px-4 py-2 rounded-lg text-sm">
                {name}
              </span>
            ))}
          </div>
        </GlassCard>
      )}

      {/* Ingredients */}
      {sections?.ingredients && (
        <GlassCard>
          <SectionHeader title="Ingredient Breakdown" />
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-brand-lightGray">
                  <th className="text-left py-2 text-brand-secondary">Ingredient</th>
                  <th className="text-left py-2 text-brand-secondary">INCI Name</th>
                  <th className="text-left py-2 text-brand-secondary">%</th>
                  <th className="text-left py-2 text-brand-secondary">Purpose</th>
                </tr>
              </thead>
              <tbody>
                {sections.ingredients.list?.map((ing: any, idx: number) => (
                  <tr key={idx} className="border-b border-brand-lightGray/50">
                    <td className="py-2 text-brand-primary">{ing.name}</td>
                    <td className="py-2 text-brand-primary">{ing.inciName}</td>
                    <td className="py-2 text-brand-primary">{ing.percentage}%</td>
                    <td className="py-2 text-brand-primary">{ing.purpose}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </GlassCard>
      )}

      {/* Market Analysis */}
      {sections?.marketAnalysis && (
        <GlassCard>
          <SectionHeader title="Market Analysis" />
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold text-brand-secondary mb-2">Target Market</h4>
              <p className="text-brand-primary">{sections.marketAnalysis.targetMarket}</p>
            </div>
            <div>
              <h4 className="font-semibold text-brand-secondary mb-2">Market Size</h4>
              <p className="text-brand-primary">{sections.marketAnalysis.marketSize}</p>
            </div>
            <div>
              <h4 className="font-semibold text-brand-secondary mb-2">Growth Potential</h4>
              <p className="text-brand-primary">{sections.marketAnalysis.growthPotential}</p>
            </div>
          </div>
        </GlassCard>
      )}

      {/* Copywriting */}
      {sections?.copywriting && (
        <GlassCard>
          <SectionHeader title="Marketing Copy" />
          <div className="space-y-4">
            {sections.copywriting.headline && (
              <div>
                <h4 className="font-semibold text-brand-secondary mb-2">Headline</h4>
                <p className="text-lg text-brand-primary italic">{sections.copywriting.headline}</p>
              </div>
            )}
            {sections.copywriting.bodyCopy && (
              <div>
                <h4 className="font-semibold text-brand-secondary mb-2">Body Copy</h4>
                <p className="text-brand-primary">{sections.copywriting.bodyCopy}</p>
              </div>
            )}
            {sections.copywriting.cta && (
              <div>
                <h4 className="font-semibold text-brand-secondary mb-2">Call to Action</h4>
                <p className="text-brand-primary font-medium">{sections.copywriting.cta}</p>
              </div>
            )}
          </div>
        </GlassCard>
      )}

      {/* Pricing Structure */}
      {sections?.pricing && (
        <GlassCard>
          <SectionHeader title="Pricing Structure" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="glass-effect p-4 rounded-lg">
              <div className="text-sm text-brand-primary mb-1">Retail Price</div>
              <div className="text-2xl font-bold text-brand-blue">{sections.pricing.retail}</div>
            </div>
            <div className="glass-effect p-4 rounded-lg">
              <div className="text-sm text-brand-primary mb-1">Wholesale Price</div>
              <div className="text-2xl font-bold text-brand-cyan">{sections.pricing.wholesale}</div>
            </div>
            <div className="glass-effect p-4 rounded-lg">
              <div className="text-sm text-brand-primary mb-1">Cost of Goods</div>
              <div className="text-2xl font-bold text-brand-secondary">{sections.pricing.cogs}</div>
            </div>
          </div>
        </GlassCard>
      )}

      {/* Regulatory Checklist */}
      {sections?.regulatory && (
        <GlassCard>
          <SectionHeader title="Regulatory Compliance" />
          <div className="space-y-2">
            {sections.regulatory.checklist?.map((item: any, idx: number) => (
              <div key={idx} className="flex items-center gap-3 glass-effect p-3 rounded-lg">
                <div className={`h-5 w-5 rounded-full flex items-center justify-center ${item.status === 'compliant' ? 'bg-green-500/20 text-green-600' : 'bg-yellow-500/20 text-yellow-600'}`}>
                  {item.status === 'compliant' ? '✓' : '!'}
                </div>
                <div className="flex-1">
                  <div className="font-medium text-brand-secondary">{item.requirement}</div>
                  <div className="text-sm text-brand-primary">{item.notes}</div>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>
      )}

      {/* Production Timeline */}
      {sections?.productionTimeline && (
        <GlassCard>
          <SectionHeader title="Production Timeline" />
          <div className="space-y-3">
            {sections.productionTimeline.phases?.map((phase: any, idx: number) => (
              <div key={idx} className="glass-effect p-4 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-brand-secondary">{phase.name}</h4>
                  <span className="text-sm text-brand-primary">{phase.duration}</span>
                </div>
                <p className="text-sm text-brand-primary">{phase.description}</p>
              </div>
            ))}
          </div>
        </GlassCard>
      )}

      {/* Sustainability Score */}
      {sections?.sustainability && (
        <GlassCard>
          <SectionHeader title="Sustainability Assessment" />
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-brand-primary">Overall Score</span>
                  <span className="text-sm font-medium text-brand-blue">{sections.sustainability.score}/100</span>
                </div>
                <div className="h-3 bg-brand-lightGray rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-brand-blue to-brand-cyan"
                    style={{ width: `${sections.sustainability.score}%` }}
                  />
                </div>
              </div>
            </div>
            {sections.sustainability.recommendations && (
              <div>
                <h4 className="font-semibold text-brand-secondary mb-2">Recommendations</h4>
                <ul className="space-y-1">
                  {sections.sustainability.recommendations.map((rec: string, idx: number) => (
                    <li key={idx} className="text-sm text-brand-primary flex items-start gap-2">
                      <span className="text-brand-blue">•</span>
                      {rec}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </GlassCard>
      )}

      {/* Next Steps */}
      {sections?.nextSteps && (
        <GlassCard glow>
          <SectionHeader title="Next Steps" />
          <div className="space-y-3">
            {sections.nextSteps.actions?.map((action: any, idx: number) => (
              <div key={idx} className="flex items-start gap-3">
                <div className="h-8 w-8 rounded-full bg-brand-blue/20 flex items-center justify-center flex-shrink-0 text-brand-blue font-semibold">
                  {idx + 1}
                </div>
                <div>
                  <h4 className="font-semibold text-brand-secondary">{action.title}</h4>
                  <p className="text-sm text-brand-primary">{action.description}</p>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>
      )}

      {/* Fallback for empty sections */}
      {(!sections || Object.keys(sections).length === 0) && (
        <GlassCard className="text-center py-12">
          <div className="text-brand-primary">
            <p className="mb-4">Report sections are being generated...</p>
            <p className="text-sm">This usually takes 5-10 minutes. Please check back shortly.</p>
          </div>
        </GlassCard>
      )}
    </div>
  )
}
