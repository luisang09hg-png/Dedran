import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle2, AlertCircle, Sparkles, Loader2 } from 'lucide-react'
import { signUp, signIn } from '@/lib/auth'

interface AuthFormProps {
  mode: 'sign-in' | 'sign-up'
  onSuccess: () => void
  onSwitchMode: () => void
}

const cardVariants = {
  hidden: { opacity: 0, scale: 0.92, y: 20 },
  visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' as const } },
  exit: { opacity: 0, scale: 0.92, y: -20, transition: { duration: 0.25 } },
}

const itemVariants = {
  hidden: { opacity: 0, x: -12 },
  visible: { opacity: 1, x: 0 },
}

const errorVariants = {
  hidden: { opacity: 0, height: 0, marginBottom: 0 },
  visible: { opacity: 1, height: 'auto', marginBottom: 8 },
}

export default function AuthForm({ mode, onSuccess, onSwitchMode }: AuthFormProps) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const isSignUp = mode === 'sign-up'

  const passwordStrength = useMemo(() => {
    const checks = {
      minLength: password.length >= 8,
      hasUppercase: /[A-Z]/.test(password),
      hasLowercase: /[a-z]/.test(password),
      hasNumbers: /[0-9]/.test(password),
      hasSymbols: /[!@#$%^&*()_+=\[\]{};':"\\|,.<>?/~`]/.test(password),
    }
    const passed = Object.values(checks).filter(Boolean).length
    const strength = passed === 0 ? 0 : passed <= 2 ? 1 : passed <= 3 ? 2 : 3
    return { checks, strength, passed, total: Object.keys(checks).length }
  }, [password])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const result = isSignUp
      ? await signUp(name, email, password)
      : await signIn(email, password)

    setLoading(false)

    if (result.error) {
      setError(result.error)
      return
    }

    onSuccess()
  }

  return (
    <div className="min-h-screen bg-[#06091A] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' as const }}
          className="text-center mb-8"
        >
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="inline-flex items-center gap-2 text-2xl font-extrabold bg-gradient-to-r from-[#60A5FA] to-[#24476C] bg-clip-text text-transparent mb-3"
          >
            <Sparkles size={22} />
            Dedran
          </motion.div>
          <h1 className="text-xl font-bold text-[#E6E8E6] mt-2">
            {isSignUp ? 'Create your account' : 'Welcome back'}
          </h1>
          <p className="text-sm text-[#A8A9AD] mt-1 font-inter">
            {isSignUp ? 'Start your career journey today' : 'Sign in to continue your journey'}
          </p>
        </motion.div>

        <AnimatePresence mode="wait">
          <motion.div
            key={mode}
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="bg-[#0D1A31] rounded-2xl border border-[#1E3354] p-6"
          >
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <AnimatePresence>
                {isSignUp && (
                  <motion.div
                    variants={itemVariants}
                    initial="hidden"
                    animate="visible"
                    exit={{ opacity: 0, x: -12 }}
                    transition={{ duration: 0.25 }}
                    className="flex flex-col gap-2"
                  >
                    <label htmlFor="name" className="text-xs font-bold text-[#A8A9AD] uppercase tracking-wider">Full Name</label>
                    <input
                      id="name"
                      value={name}
                      onChange={e => setName(e.target.value)}
                      required
                      autoComplete="name"
                      className="w-full bg-[#0A122A] border border-[#1E3354] rounded-xl px-4 py-2.5 text-sm text-[#E6E8E6] placeholder-[#A8A9AD] focus:outline-none focus:border-[#24476C] transition-all duration-300 font-inter"
                      placeholder="e.g. Alex Rivera"
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              <motion.div
                variants={itemVariants}
                initial="hidden"
                animate="visible"
                transition={{ duration: 0.25, delay: 0.05 }}
                className="flex flex-col gap-2"
              >
                <label htmlFor="email" className="text-xs font-bold text-[#A8A9AD] uppercase tracking-wider">Email</label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                  className="w-full bg-[#0A122A] border border-[#1E3354] rounded-xl px-4 py-2.5 text-sm text-[#E6E8E6] placeholder-[#A8A9AD] focus:outline-none focus:border-[#24476C] transition-all duration-300 font-inter"
                  placeholder="you@example.com"
                />
              </motion.div>

              <motion.div
                variants={itemVariants}
                initial="hidden"
                animate="visible"
                transition={{ duration: 0.25, delay: 0.1 }}
                className="flex flex-col gap-2"
              >
                <label htmlFor="password" className="text-xs font-bold text-[#A8A9AD] uppercase tracking-wider">Password</label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  minLength={8}
                  autoComplete={isSignUp ? 'new-password' : 'current-password'}
                  className="w-full bg-[#0A122A] border border-[#1E3354] rounded-xl px-4 py-2.5 text-sm text-[#E6E8E6] placeholder-[#A8A9AD] focus:outline-none focus:border-[#24476C] transition-all duration-300 font-inter"
                  placeholder={isSignUp ? 'Create a strong password' : 'Enter your password'}
                />

                {isSignUp && password && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    transition={{ duration: 0.3 }}
                    className="mt-2 p-3 bg-[#0A122A] rounded-xl border border-[#1E3354] overflow-hidden"
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <div className="flex-1 bg-[#1E3354] rounded-full h-2">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{
                            width: passwordStrength.strength === 0 ? '0%' :
                                   passwordStrength.strength === 1 ? '33%' :
                                   passwordStrength.strength === 2 ? '66%' : '100%',
                          }}
                          transition={{ duration: 0.4, ease: 'easeOut' as const }}
                          className={`h-full rounded-full ${
                            passwordStrength.strength === 0 ? 'bg-red-500' :
                            passwordStrength.strength === 1 ? 'bg-yellow-500' :
                            passwordStrength.strength === 2 ? 'bg-blue-500' : 'bg-emerald-500'
                          }`}
                        />
                      </div>
                      <motion.span
                        key={passwordStrength.strength}
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-xs font-medium text-[#A8A9AD]"
                      >
                        {['Weak', 'Fair', 'Good', 'Strong'][passwordStrength.strength]}
                      </motion.span>
                    </div>

                    <div className="space-y-1.5 text-xs">
                      {[
                        { key: 'minLength' as const, label: 'At least 8 characters' },
                        { key: 'hasUppercase' as const, label: 'One uppercase letter (A-Z)' },
                        { key: 'hasLowercase' as const, label: 'One lowercase letter (a-z)' },
                        { key: 'hasNumbers' as const, label: 'One number (0-9)' },
                        { key: 'hasSymbols' as const, label: 'One symbol: ! @ # $ % ^ & * ( )' },
                      ].map((check, idx) => (
                        <motion.div
                          key={check.key}
                          initial={{ opacity: 0, x: -8 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.05, duration: 0.2 }}
                          className="flex items-center gap-2"
                        >
                          {passwordStrength.checks[check.key] ? (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ type: 'spring', stiffness: 400, damping: 10 }}
                            >
                              <CheckCircle2 size={12} className="text-emerald-500 shrink-0" />
                            </motion.div>
                          ) : (
                            <AlertCircle size={12} className="text-[#A8A9AD] shrink-0" />
                          )}
                          <span className={passwordStrength.checks[check.key] ? 'text-[#E6E8E6]' : 'text-[#A8A9AD] font-inter'}>
                            {check.label}
                          </span>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </motion.div>

              <AnimatePresence>
                {error && (
                  <motion.p
                    variants={errorVariants}
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                    transition={{ duration: 0.25 }}
                    className="text-sm text-red-400 bg-red-900/20 rounded-xl px-3 py-2 border border-red-900/40 font-inter"
                    role="alert"
                  >
                    {error}
                  </motion.p>
                )}
              </AnimatePresence>

              <motion.button
                type="submit"
                disabled={loading}
                whileHover={!loading ? { scale: 1.01 } : {}}
                whileTap={!loading ? { scale: 0.98 } : {}}
                className="w-full py-2.5 rounded-xl bg-[#24476C] hover:bg-[#2E5A8A] text-white text-sm font-bold disabled:opacity-40 transition-colors mt-1 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 size={16} className="animate-rotate-slow" />
                    Please wait...
                  </>
                ) : isSignUp ? (
                  'Create account'
                ) : (
                  'Sign in'
                )}
              </motion.button>
            </form>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-sm text-[#A8A9AD] text-center mt-6 font-inter"
            >
              {isSignUp ? 'Already have an account? ' : "Don't have an account? "}
              <motion.button
                onClick={onSwitchMode}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="text-[#60A5FA] font-semibold hover:underline underline-offset-4 inline-block"
              >
                {isSignUp ? 'Sign in' : 'Sign up'}
              </motion.button>
            </motion.p>

            {!isSignUp && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-center mt-3"
              >
                <motion.a
                  href="/auth/forgot-password"
                  whileHover={{ scale: 1.02 }}
                  className="text-xs text-[#A8A9AD] hover:text-[#60A5FA] transition-colors font-inter"
                >
                  Forgot your password?
                </motion.a>
              </motion.p>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}
