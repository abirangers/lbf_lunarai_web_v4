'use client'

import { motion } from 'framer-motion'
import { useSimulator } from '@/contexts/SimulatorContext'
import { GlassCard } from '@/components/common/GlassCard'
import { NeonBadge } from '@/components/common/NeonBadge'
import { Package, Target, Calendar, Leaf, Sparkles, Users, Globe, Droplets, Shield, Award, TrendingUp, Zap } from 'lucide-react'

export function LiveBrief() {
  const { formValues } = useSimulator()

  if (!formValues.brandName) {
    return (
      <GlassCard className="h-full">
        <div className="flex items-center justify-center h-full text-center p-8">
          <div>
            <Package className="h-12 w-12 mx-auto mb-4 text-brand-primary opacity-50" />
            <p className="text-brand-primary">
              Start filling the form to see your product brief preview
            </p>
          </div>
        </div>
      </GlassCard>
    )
  }

  return (
    <div className="space-y-3">
      {/* Header Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative group"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-lg blur-md" />
        <GlassCard className="relative border-2 border-blue-500/30 py-2.5 px-3">
          <div className="flex items-start gap-2.5">
            <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg">
              <Sparkles className="h-4 w-4 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-base font-bold text-brand-secondary mb-1">
                {formValues.brandName || 'Your Brand'}
              </h3>
              <div className="flex flex-wrap gap-2">
                {formValues.formType && (
                  <NeonBadge variant="blue" pulse>
                    <Droplets className="h-3 w-3" />
                    {formValues.formType}
                  </NeonBadge>
                )}
                {formValues.country && (
                  <NeonBadge variant="cyan">
                    <Globe className="h-3 w-3" />
                    {formValues.country}
                  </NeonBadge>
                )}
              </div>
            </div>
          </div>
        </GlassCard>
      </motion.div>

      {/* Functions Card */}
      {formValues.functions && formValues.functions.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <GlassCard className="border border-cyan-500/30 py-2.5 px-3">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-1.5 bg-cyan-500/20 rounded-md">
                <Target className="h-3.5 w-3.5 text-cyan-600" />
              </div>
              <h4 className="text-sm font-semibold text-brand-secondary">Key Functions</h4>
              <span className="ml-auto text-xs text-brand-primary">{formValues.functions.length}</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {formValues.functions.map((func, idx) => (
                <motion.div
                  key={func}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.1 + idx * 0.05 }}
                >
                  <NeonBadge variant="cyan">
                    <Zap className="h-3 w-3" />
                    {func}
                  </NeonBadge>
                </motion.div>
              ))}
            </div>
          </GlassCard>
        </motion.div>
      )}

      {/* Target Audience */}
      {formValues.ageRanges && formValues.ageRanges.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <GlassCard className="border border-purple-500/30 py-2.5 px-3">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-1.5 bg-purple-500/20 rounded-md">
                <Users className="h-3.5 w-3.5 text-purple-600" />
              </div>
              <h4 className="text-sm font-semibold text-brand-secondary">Target Audience</h4>
            </div>
            <div className="flex flex-wrap gap-2">
              {formValues.ageRanges.map((age) => (
                <NeonBadge key={age} variant="gray">
                  {age}
                </NeonBadge>
              ))}
            </div>
          </GlassCard>
        </motion.div>
      )}

      {/* Packaging Info */}
      {formValues.packagingType && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <GlassCard className="border border-blue-500/30 py-2.5 px-3">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-1.5 bg-blue-500/20 rounded-md">
                <Package className="h-3.5 w-3.5 text-blue-600" />
              </div>
              <h4 className="text-sm font-semibold text-brand-secondary">Packaging</h4>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="p-1.5 bg-gray-50 rounded-md">
                <div className="text-xs text-brand-primary mb-1">Type</div>
                <div className="text-sm font-medium text-brand-secondary">{formValues.packagingType}</div>
              </div>
              {formValues.nettoValue && (
                <div className="p-1.5 bg-gray-50 rounded-md">
                  <div className="text-xs text-brand-primary mb-1">Volume</div>
                  <div className="text-sm font-medium text-brand-secondary">
                    {formValues.nettoValue} {formValues.nettoUnit}
                  </div>
                </div>
              )}
            </div>
          </GlassCard>
        </motion.div>
      )}

      {/* Launch Timeline */}
      {formValues.launchTimeline && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <GlassCard className="border border-green-500/30 py-2.5 px-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-green-500/20 rounded-md">
                  <Calendar className="h-3.5 w-3.5 text-green-600" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-brand-secondary">Launch Timeline</h4>
                  <p className="text-sm text-brand-primary">{formValues.launchTimeline}</p>
                </div>
              </div>
              <TrendingUp className="h-4 w-4 text-green-600" />
            </div>
          </GlassCard>
        </motion.div>
      )}

      {/* Sustainability Score */}
      {formValues.sustainabilityPriority !== undefined && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <GlassCard className="border border-green-500/30 py-2.5 px-3">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-1.5 bg-green-500/20 rounded-md">
                <Leaf className="h-3.5 w-3.5 text-green-600" />
              </div>
              <h4 className="text-sm font-semibold text-brand-secondary">Sustainability Priority</h4>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${formValues.sustainabilityPriority}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className="h-full bg-gradient-to-r from-green-500 to-emerald-500"
                />
              </div>
              <span className="text-sm font-bold text-green-600">
                {formValues.sustainabilityPriority}%
              </span>
            </div>
          </GlassCard>
        </motion.div>
      )}

      {/* Regulatory Focus */}
      {formValues.regulatoryPriority && formValues.regulatoryPriority.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <GlassCard className="border border-orange-500/30 py-2.5 px-3">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-1.5 bg-orange-500/20 rounded-md">
                <Shield className="h-3.5 w-3.5 text-orange-600" />
              </div>
              <h4 className="text-sm font-semibold text-brand-secondary">Regulatory Compliance</h4>
            </div>
            <div className="flex flex-wrap gap-2">
              {formValues.regulatoryPriority.map((reg) => (
                <NeonBadge key={reg} variant="gray">
                  <Shield className="h-3 w-3" />
                  {reg}
                </NeonBadge>
              ))}
            </div>
          </GlassCard>
        </motion.div>
      )}

      {/* Claims */}
      {formValues.claimEmphasis && formValues.claimEmphasis.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <GlassCard className="border border-pink-500/30 py-2.5 px-3">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-1.5 bg-pink-500/20 rounded-md">
                <Award className="h-3.5 w-3.5 text-pink-600" />
              </div>
              <h4 className="text-sm font-semibold text-brand-secondary">Product Claims</h4>
            </div>
            <div className="flex flex-wrap gap-2">
              {formValues.claimEmphasis.map((claim) => (
                <NeonBadge key={claim} variant="cyan">
                  <Award className="h-3 w-3" />
                  {claim}
                </NeonBadge>
              ))}
            </div>
          </GlassCard>
        </motion.div>
      )}
    </div>
  )
}
