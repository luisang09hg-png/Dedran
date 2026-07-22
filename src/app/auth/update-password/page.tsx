'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Lock, Sparkles, Loader2, CheckCircle2 } from 'lucide-react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function UpdatePasswordPage() {
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [validSession, setValidSession] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getSession().then(({ data: { session } }) => {
      setValidSession(!!session)
    })
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const supabase = createClient()
    const { error: updateError } = await supabase.auth.updateUser({ password })

    setLoading(false)

    if (updateError) {
      setError(updateError.message)
      return
    }

    setDone(true)
    setTimeout(() => router.push('/dashboard'), 3000)
  }

  if (!validSession) {
    return (
      <div className="min-h-screen bg-[#06091A] flex items-center justify-center px-4">
        <div className="text-center">
          <p className="text-[#A8A9AD] mb-4">This link has expired or is invalid.</p>
          <Link href="/auth/forgot-password" className="text-[#60A5FA] font-semibold hover:underline">
            Request a new reset link
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#06091A] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 text-2xl font-extrabold bg-gradient-to-r from-[#60A5FA] to-[#24476C] bg-clip-text text-transparent mb-3">
            <Sparkles size={22} /> Dedran
          </Link>
          <h1 className="text-xl font-bold text-[#E6E8E6] mt-2">Set new password</h1>
        </motion.div>

        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }} className="bg-[#0D1A31] rounded-2xl border border-[#1E3354] p-6">
          {done ? (
            <div className="text-center py-4">
              <CheckCircle2 size={48} className="text-emerald-500 mx-auto mb-4" />
              <h2 className="text-lg font-bold text-[#E6E8E6] mb-2">Password updated!</h2>
              <p className="text-sm text-[#A8A9AD]">Redirecting to dashboard...</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <label htmlFor="password" className="text-xs font-bold text-[#A8A9AD] uppercase tracking-wider">New Password</label>
                <div className="relative">
                  <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A8A9AD]" />
                  <input
                    id="password" type="password" value={password} onChange={e => setPassword(e.target.value)}
                    required minLength={8} autoComplete="new-password"
                    className="w-full bg-[#0A122A] border border-[#1E3354] rounded-xl pl-10 pr-4 py-2.5 text-sm text-[#E6E8E6] placeholder-[#A8A9AD] focus:outline-none focus:border-[#24476C] transition-all font-inter"
                    placeholder="Min. 8 characters"
                  />
                </div>
              </div>

              {error && <p className="text-sm text-red-400 bg-red-900/20 rounded-xl px-3 py-2 border border-red-900/40">{error}</p>}

              <motion.button type="submit" disabled={loading}
                whileHover={!loading ? { scale: 1.01 } : {}}
                whileTap={!loading ? { scale: 0.98 } : {}}
                className="w-full py-2.5 rounded-xl bg-[#24476C] hover:bg-[#2E5A8A] text-white text-sm font-bold disabled:opacity-40 transition-colors flex items-center justify-center gap-2"
              >
                {loading ? <><Loader2 size={16} className="animate-rotate-slow" /> Updating...</> : 'Update password'}
              </motion.button>
            </form>
          )}
        </motion.div>
      </div>
    </div>
  )
}
