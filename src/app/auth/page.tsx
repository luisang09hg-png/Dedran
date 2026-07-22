'use client'

import { useState } from 'react'
import AuthForm from '@/components/AuthForm'

type AuthMode = 'sign-in' | 'sign-up'

export default function AuthPage() {
  const [mode, setMode] = useState<AuthMode>('sign-in')

  return (
    <AuthForm
      mode={mode}
      onSuccess={() => window.location.href = '/dashboard'}
      onSwitchMode={() => setMode(mode === 'sign-in' ? 'sign-up' : 'sign-in')}
    />
  )
}
