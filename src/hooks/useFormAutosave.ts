'use client'

import { useEffect } from 'react'
import { debounce } from '@/lib/utils'

export function useFormAutosave<T>(key: string, values: T, delay: number = 1000) {
  useEffect(() => {
    const saveToStorage = debounce(() => {
      try {
        localStorage.setItem(key, JSON.stringify(values))
      } catch (error) {
        console.error('Failed to save form data:', error)
      }
    }, delay)

    saveToStorage()
  }, [key, values, delay])
}
