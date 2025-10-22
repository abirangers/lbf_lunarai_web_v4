'use client'

import { Suspense } from 'react'
import { useEffect, useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, Download, FileJson, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { useWorkflowStatus } from '@/hooks/useWorkflowStatus'
import { GlassCard } from '@/components/common/GlassCard'
import { GlowButton } from '@/components/common/GlowButton'
import { NeonBadge } from '@/components/common/NeonBadge'
import { Button } from '@/components/ui/button'
import { ProductReport } from '@/components/report/ProductReport'
import { ProgressBar } from '@/components/ProgressBar'
import { SectionCard } from '@/components/SectionCard'
import type { ReportData } from '@/types/submission'

interface SectionData {
  sectionType: string
  order: number
  data: any
  metadata?: any
}

interface ProgressData {
  completed: number
  total: number
  failed: number
  percentage: number
}

function ResultPageContent({ params }: { params: { id: string } }) {
  const resolvedParams = params
  const [sections, setSections] = useState<Record<string, SectionData>>({})
  const [progress, setProgress] = useState<ProgressData>({
    completed: 0,
    total: 12,
    failed: 0,
    percentage: 0,
  })
  const [isComplete, setIsComplete] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [connectionStatus, setConnectionStatus] = useState<
    'connecting' | 'connected' | 'disconnected'
  >('connecting')
  const eventSourceRef = useRef<EventSource | null>(null)
  const { status } = useWorkflowStatus(resolvedParams.id)

  useEffect(() => {
    // Connect to SSE stream for real-time updates
    console.log('🔌 Connecting to SSE stream...')
    setConnectionStatus('connecting')

    const eventSource = new EventSource(`/api/result/${resolvedParams.id}/stream`)
    eventSourceRef.current = eventSource

    eventSource.onopen = () => {
      console.log('✅ SSE connection established')
      setConnectionStatus('connected')
      setIsLoading(false)
    }

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data)
        console.log('📨 SSE event received:', data.type)

        switch (data.type) {
          case 'connection_established':
            console.log('🎯 Connection established, current progress:', data.currentProgress)
            setProgress({
              completed: data.currentProgress.completed,
              total: data.currentProgress.total,
              failed: data.currentProgress.failed || 0,
              percentage: data.currentProgress.percentage,
            })

            // If already completed, load existing sections
            if (
              data.currentProgress.status === 'completed' ||
              data.currentProgress.status === 'partial_complete'
            ) {
              setIsComplete(true)
            }
            break

          case 'section_complete':
            console.log('✅ Section completed:', data.section.sectionType)

            // Add section to state
            setSections((prev) => ({
              ...prev,
              [data.section.sectionType]: data.section,
            }))

            // Update progress
            setProgress({
              completed: data.progress.completed,
              total: data.progress.total,
              failed: data.progress.failed || 0,
              percentage: data.progress.percentage,
            })
            break

          case 'section_error':
            console.error('❌ Section error:', data.section.sectionType, data.section.error)

            // Add error section
            setSections((prev) => ({
              ...prev,
              [data.section.sectionType]: {
                ...data.section,
                status: 'error',
              },
            }))

            // Update progress
            setProgress({
              completed: data.progress.completed,
              total: data.progress.total,
              failed: data.progress.failed || 0,
              percentage: data.progress.percentage || 0,
            })
            break

          case 'workflow_complete':
            console.log('🏁 Workflow complete!')
            setIsComplete(true)
            setProgress((prev) => ({ ...prev, completed: prev.total }))
            break

          case 'heartbeat':
            // Keep-alive ping, no action needed
            break

          case 'timeout':
            console.warn('⏱️ SSE connection timeout')
            setConnectionStatus('disconnected')
            setError('Connection timeout. Please refresh the page.')
            break

          case 'error':
            console.error('❌ SSE error:', data.error)
            setError(data.error)
            break

          default:
            console.warn('Unknown SSE event type:', data.type)
        }
      } catch (err) {
        console.error('Error parsing SSE event:', err)
      }
    }

    eventSource.onerror = (err) => {
      console.error('❌ SSE connection error:', err)
      setConnectionStatus('disconnected')

      // Auto-reconnect after 3 seconds if not complete
      if (!isComplete) {
        setTimeout(() => {
          console.log('🔄 Attempting to reconnect...')
          window.location.reload()
        }, 3000)
      }
    }

    // Cleanup on unmount
    return () => {
      console.log('🔌 Closing SSE connection')
      eventSource.close()
    }
  }, [resolvedParams.id, isComplete])

  const handleExportJSON = () => {
    const dataStr = JSON.stringify({ sections, progress }, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = `lbf-report-${resolvedParams.id}.json`
    link.click()
    URL.revokeObjectURL(url)
  }

  // Get brand name from first section or use submission ID
  const brandName = sections.productHeader?.data?.name || 'Product Report'

  // Sort sections by order
  const sortedSections = Object.values(sections).sort((a, b) => a.order - b.order)

  if (isLoading) {
    return (
      <div className="min-h-screen bg-brand-offWhite flex items-center justify-center">
        <GlassCard className="text-center p-12">
          <Loader2 className="h-12 w-12 animate-spin text-brand-blue mx-auto mb-4" />
          <p className="text-brand-primary">Connecting to report stream...</p>
        </GlassCard>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-brand-offWhite flex items-center justify-center p-4">
        <GlassCard className="text-center p-12 max-w-md">
          <div className="text-red-500 mb-4">⚠️</div>
          <h2 className="text-xl font-semibold text-brand-secondary mb-2">Connection Error</h2>
          <p className="text-brand-primary mb-6">{error}</p>
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
                <h1 className="text-xl font-bold text-brand-secondary">{brandName}</h1>
                <p className="text-sm text-brand-primary">
                  Submission ID: {resolvedParams.id.slice(0, 8)}...
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <NeonBadge
                variant={connectionStatus === 'connected' ? 'blue' : 'cyan'}
                pulse={connectionStatus === 'connecting'}
              >
                {connectionStatus}
              </NeonBadge>

              <Button
                variant="outline"
                size="sm"
                onClick={handleExportJSON}
                className="glass-effect"
                disabled={sortedSections.length === 0}
              >
                <FileJson className="mr-2 h-4 w-4" />
                Export JSON
              </Button>

              <GlowButton size="sm" disabled={!isComplete}>
                <Download className="mr-2 h-4 w-4" />
                Export PDF
              </GlowButton>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      {!isComplete && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white border-b border-gray-200 py-4"
        >
          <div className="container mx-auto max-w-7xl px-4">
            <ProgressBar
              completed={progress.completed}
              total={progress.total}
              failed={progress.failed}
            />
          </div>
        </motion.div>
      )}

      {/* Completion Banner */}
      {isComplete && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-green-50 border-b border-green-200 py-3"
        >
          <div className="container mx-auto max-w-7xl px-4">
            <div className="flex items-center gap-3">
              <svg
                className="w-5 h-5 text-green-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <span className="text-sm font-medium text-green-800">
                Report generation complete! {progress.completed} of {progress.total} sections
                generated.
              </span>
            </div>
          </div>
        </motion.div>
      )}

      {/* Sections */}
      <div className="container mx-auto max-w-7xl px-4 py-8">
        {sortedSections.length === 0 && !isComplete && (
          <div className="text-center py-12">
            <Loader2 className="w-12 h-12 animate-spin text-brand-blue mx-auto mb-4" />
            <p className="text-brand-primary">Waiting for sections to generate...</p>
            <p className="text-sm text-gray-500 mt-2">This usually takes 5-10 minutes</p>
          </div>
        )}

        <AnimatePresence mode="popLayout">
          {sortedSections.map((section) => (
            <SectionCard key={section.sectionType} section={section} status="completed" />
          ))}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default function ResultPage({ params }: { params: { id: string } }) {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-brand-offWhite flex items-center justify-center">
          <Loader2 className="h-12 w-12 animate-spin text-brand-blue" />
        </div>
      }
    >
      <ResultPageContent params={params} />
    </Suspense>
  )
}
