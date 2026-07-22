'use client'

import { useState, useCallback } from 'react'

interface ApiState<T> {
  data: T | null
  loading: boolean
  error: string | null
}

interface UseApiOptions {
  method?: string
  headers?: Record<string, string>
}

export function useApi<T = unknown>(url: string, options: UseApiOptions = {}) {
  const [state, setState] = useState<ApiState<T>>({
    data: null,
    loading: false,
    error: null,
  })

  const execute = useCallback(async (body?: unknown) => {
    setState(prev => ({ ...prev, loading: true, error: null }))

    try {
      const res = await fetch(url, {
        method: options.method || 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        body: body ? JSON.stringify(body) : undefined,
      })

      const data = await res.json()

      if (!res.ok) {
        setState({ data: null, loading: false, error: data.error || 'Request failed' })
        return { data: null, error: data.error }
      }

      setState({ data, loading: false, error: null })
      return { data, error: null }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Network error'
      setState({ data: null, loading: false, error: message })
      return { data: null, error: message }
    }
  }, [url, options.method, options.headers])

  const reset = useCallback(() => {
    setState({ data: null, loading: false, error: null })
  }, [])

  return { ...state, execute, reset }
}

export function useApiMutation<T = unknown>(url: string) {
  const [state, setState] = useState<ApiState<T>>({
    data: null,
    loading: false,
    error: null,
  })

  const mutate = useCallback(async (body?: unknown, method = 'POST') => {
    setState(prev => ({ ...prev, loading: true, error: null }))

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: body ? JSON.stringify(body) : undefined,
      })

      const data = await res.json()

      if (!res.ok) {
        setState({ data: null, loading: false, error: data.error || 'Request failed' })
        return { data: null, error: data.error }
      }

      setState({ data, loading: false, error: null })
      return { data, error: null }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Network error'
      setState({ data: null, loading: false, error: message })
      return { data: null, error: message }
    }
  }, [url])

  return { ...state, mutate, reset: () => setState({ data: null, loading: false, error: null }) }
}
