'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Mail, ArrowLeft, Sparkles, Loader2, CheckCircle2 } from 'lucide-react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const supabase = createClient()
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/update-password`,
    })

    setLoading(false)

    if (resetError) {
      setError(resetError.message)
      return
    }

    setSent(true)
  }

  return (
    <div className="min-h-screen bg-[#06091A] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <Link href="/" className="inline-flex items-center gap-2 text-2xl font-extrabold bg-gradient-to-r from-[#60A5FA] to-[#24476C] bg-clip-text text-transparent mb-3">
            <Sparkles size={22} />
            Dedran
          </Link>
          <h1 className="text-xl font-bold text-[#E6E8E6] mt-2">Reset your password</h1>
          <p className="text-sm text-[#A8A9AD] mt-1 font-inter">
            Enter your email and we&apos;ll send you a reset link
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="bg-[#0D1A31] rounded-2xl border border-[#1E3354] p-6"
        >
          {sent ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-4"
            >
              <CheckCircle2 size={48} className="text-emerald-500 mx-auto mb-4" />
              <h2 className="text-lg font-bold text-[#E6E8E6] mb-2">Check your email</h2>
              <p className="text-sm text-[#A8A9AD] font-inter mb-6">
                We sent a password reset link to <span className="text-[#E6E8E6]">{email}</span>
              </p>
              <Link
                href="/auth"
                className="inline-flex items-center gap-2 text-[#60A5FA] font-semibold text-sm hover:underline"
              >
                <ArrowLeft size={14} />
                Back to sign in
              </Link>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <label htmlFor="email" className="text-xs font-bold text-[#A8A9AD] uppercase tracking-wider">
                  Email
                </label>
                <div className="relative">
                  <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A8A9AD]" />
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                    autoComplete="email"
                    className="w-full bg-[#0A122A] border border-[#1E3354] rounded-xl pl-10 pr-4 py-2.5 text-sm text-[#E6E8E6] placeholder-[#A8A9AD] focus:outline-none focus:border-[#24476C] transition-all font-inter"
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              {error && (
                <motion.p
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="text-sm text-red-400 bg-red-900/20 rounded-xl px-3 py-2 border border-red-900/40"
                >
                  {error}
                </motion.p>
              )}

              <motion.button
                type="submit"
                disabled={loading}
                whileHover={!loading ? { scale: 1.01 } : {}}
                whileTap={!loading ? { scale: 0.98 } : {}}
                className="w-full py-2.5 rounded-xl bg-[#24476C] hover:bg-[#2E5A8A] text-white text-sm font-bold disabled:opacity-40 transition-colors flex items-center justify-center gap-2"
              >
                {loading ? <><Loader2 size={16} className="animate-rotate-slow" /> Sending...</> : 'Send reset link'}
              </motion.button>

              <Link
                href="/auth"
                className="text-sm text-[#A8A9AD] text-center mt-2 hover:text-[#60A5FA] transition-colors flex items-center justify-center gap-1"
              >
                <ArrowLeft size={14} />
                Back to sign in
              </Link>
            </form>
          )}
        </motion.div>
      </div>
    </div>
  )
}
