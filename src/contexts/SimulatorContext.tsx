'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import type { FormValues } from '@/lib/payloadBuilder'

interface SimulatorContextType {
  formValues: Partial<FormValues>
  updateFormValues: (values: Partial<FormValues>) => void
  environment: 'test' | 'production'
  setEnvironment: (env: 'test' | 'production') => void
  submissionCount: number
  incrementSubmissionCount: () => void
}

const SimulatorContext = createContext<SimulatorContextType | undefined>(undefined)

export function SimulatorProvider({ children }: { children: React.ReactNode }) {
  const [formValues, setFormValues] = useState<Partial<FormValues>>({})
  const [environment, setEnvironment] = useState<'test' | 'production'>('production')
  const [submissionCount, setSubmissionCount] = useState(0)

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('lbf-simulator-draft')
    if (saved) {
      try {
        setFormValues(JSON.parse(saved))
      } catch (e) {
        console.error('Failed to parse saved form data', e)
      }
    }

    const savedCount = localStorage.getItem('lbf-submission-count')
    if (savedCount) {
      setSubmissionCount(parseInt(savedCount, 10))
    }
  }, [])

  const updateFormValues = (values: Partial<FormValues>) => {
    setFormValues((prev) => {
      const updated = { ...prev, ...values }
      localStorage.setItem('lbf-simulator-draft', JSON.stringify(updated))
      return updated
    })
  }

  const incrementSubmissionCount = () => {
    setSubmissionCount((prev) => {
      const newCount = prev + 1
      localStorage.setItem('lbf-submission-count', newCount.toString())
      return newCount
    })
  }

  return (
    <SimulatorContext.Provider
      value={{
        formValues,
        updateFormValues,
        environment,
        setEnvironment,
        submissionCount,
        incrementSubmissionCount,
      }}
    >
      {children}
    </SimulatorContext.Provider>
  )
}

export function useSimulator() {
  const context = useContext(SimulatorContext)
  if (!context) {
    throw new Error('useSimulator must be used within SimulatorProvider')
  }
  return context
}
