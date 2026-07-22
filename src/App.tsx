import { useState } from 'react'
import { getSession } from '@/lib/auth'
import Landing from '@/components/Landing'
import AuthForm from '@/components/AuthForm'
import Dashboard from '@/components/Dashboard'

type Page = 'landing' | 'sign-in' | 'sign-up' | 'dashboard'

export default function App() {
  const [page, setPage] = useState<Page>(() => getSession() ? 'dashboard' : 'landing')

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
