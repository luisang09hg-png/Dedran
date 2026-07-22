'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter, useSearchParams } from 'next/navigation'
import { Loader2, CheckCircle2, XCircle } from 'lucide-react'
import Link from 'next/link'
import { Suspense } from 'react'

function ConfirmContent() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const supabase = createClient()
    const code = searchParams.get('code')

    if (code) {
      supabase.auth.exchangeCodeForSession(code).then(({ error }) => {
        if (error) {
          setStatus('error')
        } else {
          setStatus('success')
          setTimeout(() => router.push('/dashboard'), 1500)
        }
      })
    } else {
      setStatus('error')
    }
  }, [searchParams, router])

  return (
    <div className="min-h-screen bg-[#06091A] flex items-center justify-center px-4">
      <div className="text-center">
        {status === 'loading' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center gap-4">
            <Loader2 size={40} className="text-[#60A5FA] animate-spin" />
            <p className="text-[#A8A9AD]">Confirming your account...</p>
          </motion.div>
        )}
        {status === 'success' && (
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center gap-4">
            <CheckCircle2 size={48} className="text-emerald-500" />
            <p className="text-[#E6E8E6] font-bold">Account confirmed!</p>
            <p className="text-sm text-[#A8A9AD]">Redirecting to dashboard...</p>
          </motion.div>
        )}
        {status === 'error' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center gap-4">
            <XCircle size={48} className="text-red-400" />
            <p className="text-[#E6E8E6] font-bold">Confirmation failed</p>
            <p className="text-sm text-[#A8A9AD]">The link may have expired.</p>
            <Link href="/auth" className="text-[#60A5FA] font-semibold hover:underline text-sm">Try signing in again</Link>
          </motion.div>
        )}
      </div>
    </div>
  )
}

import { motion } from 'framer-motion'

export default function ConfirmPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#06091A] flex items-center justify-center">
        <Loader2 size={40} className="text-[#60A5FA] animate-spin" />
      </div>
    }>
      <ConfirmContent />
    </Suspense>
  )
}
