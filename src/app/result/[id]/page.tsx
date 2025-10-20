'use client'

import { use, Suspense } from 'react'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, Download, FileJson, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { useWorkflowStatus } from '@/hooks/useWorkflowStatus'
import { GlassCard } from '@/components/common/GlassCard'
import { GlowButton } from '@/components/common/GlowButton'
import { NeonBadge } from '@/components/common/NeonBadge'
import { Button } from '@/components/ui/button'
import { ProductReport } from '@/components/report/ProductReport'
import type { ReportData } from '@/types/submission'

function ResultPageContent({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)
  const [reportData, setReportData] = useState<ReportData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { status } = useWorkflowStatus(resolvedParams.id)

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const response = await fetch(`/api/result/${resolvedParams.id}`)
        if (!response.ok) {
          throw new Error('Failed to fetch report')
        }
        const data = await response.json()
        setReportData(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error')
      } finally {
        setIsLoading(false)
      }
    }

    fetchReport()
  }, [resolvedParams.id])

  const handleExportJSON = () => {
    if (!reportData) return
    const dataStr = JSON.stringify(reportData, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = `lbf-report-${resolvedParams.id}.json`
    link.click()
    URL.revokeObjectURL(url)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-brand-offWhite flex items-center justify-center">
        <GlassCard className="text-center p-12">
          <Loader2 className="h-12 w-12 animate-spin text-brand-blue mx-auto mb-4" />
          <p className="text-brand-primary">Loading report...</p>
        </GlassCard>
      </div>
    )
  }

  if (error || !reportData) {
    return (
      <div className="min-h-screen bg-brand-offWhite flex items-center justify-center p-4">
        <GlassCard className="text-center p-12 max-w-md">
          <div className="text-red-500 mb-4">⚠️</div>
          <h2 className="text-xl font-semibold text-brand-secondary mb-2">Report Not Found</h2>
          <p className="text-brand-primary mb-6">{error || 'The requested report could not be loaded.'}</p>
          <Link href="/">
            <Button className="button-primary">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Simulator
            </Button>
          </Link>
        </GlassCard>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-brand-offWhite">
      {/* Header */}
      <div className="sticky top-0 z-50 glass-effect border-b border-white/20">
        <div className="container mx-auto max-w-7xl px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/">
                <Button variant="ghost" size="sm" className="glass-effect">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back
                </Button>
              </Link>
              <div>
                <h1 className="text-xl font-bold text-brand-secondary">{reportData.brandName}</h1>
                <p className="text-sm text-brand-primary">Submission ID: {resolvedParams.id.slice(0, 8)}...</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <NeonBadge
                variant={reportData.status === 'completed' ? 'blue' : 'cyan'}
                pulse={reportData.status !== 'completed'}
              >
                {reportData.status}
              </NeonBadge>
              
              <Button variant="outline" size="sm" onClick={handleExportJSON} className="glass-effect">
                <FileJson className="mr-2 h-4 w-4" />
                Export JSON
              </Button>
              
              <GlowButton size="sm">
                <Download className="mr-2 h-4 w-4" />
                Export PDF
              </GlowButton>
            </div>
          </div>
        </div>
      </div>

      {/* Workflow Status Banner */}
      {status && status.status !== 'completed' && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-brand-blue/10 border-b border-brand-blue/20 py-3"
        >
          <div className="container mx-auto max-w-7xl px-4">
            <div className="flex items-center gap-3">
              <Loader2 className="h-4 w-4 animate-spin text-brand-blue" />
              <span className="text-sm text-brand-secondary">
                {status.message || 'Processing your submission...'}
              </span>
            </div>
          </div>
        </motion.div>
      )}

      {/* Report Content */}
      <div className="container mx-auto max-w-7xl px-4 py-8">
        <ProductReport data={reportData} />
      </div>
    </div>
  )
}

export default function ResultPage({ params }: { params: Promise<{ id: string }> }) {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-brand-offWhite flex items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-brand-blue" />
      </div>
    }>
      <ResultPageContent params={params} />
    </Suspense>
  )
}
