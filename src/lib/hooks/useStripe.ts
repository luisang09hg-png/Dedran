'use client'

import { useState, useCallback } from 'react'

interface StripeProduct {
  id: string
  name: string
  price: number
  currency: string
  description?: string
}

export function useStripe() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const checkout = useCallback(async (product: StripeProduct) => {
    setLoading(true)
    setError(null)

    try {
      const res = await fetch('/api/payments/stripe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          product_name: product.name,
          amount: Math.round(product.price * 100),
          currency: product.currency,
          description: product.description,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Checkout failed')
        setLoading(false)
        return { error: data.error }
      }

      if (data.url) {
        window.location.href = data.url
      }

      return { data, error: null }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Network error'
      setError(message)
      setLoading(false)
      return { error: message }
    }
  }, [])

  const createPayPalOrder = useCallback(async (product: StripeProduct) => {
    setLoading(true)
    setError(null)

    try {
      const res = await fetch('/api/payments/paypal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          product_name: product.name,
          amount: String(product.price),
          currency: 'USD',
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Payment failed')
        setLoading(false)
        return { error: data.error }
      }

      setLoading(false)
      return { data, error: null }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Network error'
      setError(message)
      setLoading(false)
      return { error: message }
    }
  }, [])

  return { checkout, createPayPalOrder, loading, error }
}
