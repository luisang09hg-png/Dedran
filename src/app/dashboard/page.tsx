'use client'

import { useState } from 'react'
import Dashboard from '@/components/Dashboard'

export default function DashboardPage() {
  return <Dashboard onSignOut={() => window.location.href = '/'} />
}
