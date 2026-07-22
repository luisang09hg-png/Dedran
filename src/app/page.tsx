'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import Landing from '@/components/Landing'
import AuthForm from '@/components/AuthForm'
import Dashboard from '@/components/Dashboard'

type Page = 'landing' | 'sign-in' | 'sign-up' | 'dashboard'

export default function HomePage() {
  const [page, setPage] = useState<Page>('landing')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) setPage('dashboard')
      setMounted(true)
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) setPage('dashboard')
      else setPage('landing')
    })
    return () => subscription.unsubscribe()
  }, [])

  if (!mounted) {
    return (
      <div className="min-h-screen bg-[#06091A] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#24476C] border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (page === 'dashboard') {
    return <Dashboard onSignOut={() => setPage('landing')} />
  }

  if (page === 'sign-in' || page === 'sign-up') {
    return (
      <AuthForm
        mode={page === 'sign-in' ? 'sign-in' : 'sign-up'}
        onSuccess={() => setPage('dashboard')}
        onSwitchMode={() => setPage(page === 'sign-in' ? 'sign-up' : 'sign-in')}
      />
    )
  }

  return <Landing onNavigate={(p) => setPage(p as Page)} />
}
