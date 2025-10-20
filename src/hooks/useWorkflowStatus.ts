'use client'

import { useEffect, useState } from 'react'
import type { WorkflowStatus } from '@/types/submission'

export function useWorkflowStatus(submissionId: string | null, pollInterval: number = 5000) {
  const [status, setStatus] = useState<WorkflowStatus | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!submissionId) return

    const fetchStatus = async () => {
      try {
        const response = await fetch(`/api/result/${submissionId}?fields=status`)
        if (!response.ok) {
          throw new Error('Failed to fetch status')
        }
        const data = await response.json()
        setStatus(data.status)
        setError(null)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error')
      }
    }

    fetchStatus()
    const interval = setInterval(fetchStatus, pollInterval)

    return () => clearInterval(interval)
  }, [submissionId, pollInterval])

  return { status, error }
}
