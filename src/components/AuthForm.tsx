import { useState, useMemo } from 'react'
import { CheckCircle2, AlertCircle, Sparkles } from 'lucide-react'
import { signUp, signIn } from '@/lib/auth'

interface AuthFormProps {
  mode: 'sign-in' | 'sign-up'
  onSuccess: () => void
  onSwitchMode: () => void
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

    await new Promise(r => setTimeout(r, 600))

    const result = isSignUp
      ? signUp(name, email, password)
      : signIn(email, password)

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
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 text-2xl font-extrabold bg-gradient-to-r from-[#60A5FA] to-[#24476C] bg-clip-text text-transparent mb-3">
            <Sparkles size={22} />
            Dedran
          </div>
          <h1 className="text-xl font-bold text-[#E6E8E6] mt-2">
            {isSignUp ? 'Create your account' : 'Welcome back'}
          </h1>
          <p className="text-sm text-[#A8A9AD] mt-1 font-inter">
            {isSignUp ? 'Start your career journey today' : 'Sign in to continue your journey'}
          </p>
        </div>

        <div className="bg-[#0D1A31] rounded-2xl border border-[#1E3354] p-6">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {isSignUp && (
              <div className="flex flex-col gap-2">
                <label htmlFor="name" className="text-xs font-bold text-[#A8A9AD] uppercase tracking-wider">Full Name</label>
                <input
                  id="name"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  required
                  autoComplete="name"
                  className="w-full bg-[#0A122A] border border-[#1E3354] rounded-xl px-4 py-2.5 text-sm text-[#E6E8E6] placeholder-[#A8A9AD] focus:outline-none focus:border-[#24476C] transition-colors font-inter"
                  placeholder="e.g. Alex Rivera"
                />
              </div>
            )}

            <div className="flex flex-col gap-2">
              <label htmlFor="email" className="text-xs font-bold text-[#A8A9AD] uppercase tracking-wider">Email</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                autoComplete="email"
                className="w-full bg-[#0A122A] border border-[#1E3354] rounded-xl px-4 py-2.5 text-sm text-[#E6E8E6] placeholder-[#A8A9AD] focus:outline-none focus:border-[#24476C] transition-colors font-inter"
                placeholder="you@example.com"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="password" className="text-xs font-bold text-[#A8A9AD] uppercase tracking-wider">Password</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                minLength={8}
                autoComplete={isSignUp ? 'new-password' : 'current-password'}
                className="w-full bg-[#0A122A] border border-[#1E3354] rounded-xl px-4 py-2.5 text-sm text-[#E6E8E6] placeholder-[#A8A9AD] focus:outline-none focus:border-[#24476C] transition-colors font-inter"
                placeholder={isSignUp ? 'Create a strong password' : 'Enter your password'}
              />

              {isSignUp && password && (
                <div className="mt-2 p-3 bg-[#0A122A] rounded-xl border border-[#1E3354]">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex-1 bg-[#1E3354] rounded-full h-2">
                      <div
                        className={`h-full rounded-full transition-all ${
                          passwordStrength.strength === 0 ? 'w-0 bg-red-500' :
                          passwordStrength.strength === 1 ? 'w-1/3 bg-yellow-500' :
                          passwordStrength.strength === 2 ? 'w-2/3 bg-blue-500' : 'w-full bg-emerald-500'
                        }`}
                      />
                    </div>
                    <span className="text-xs font-medium text-[#A8A9AD]">
                      {['Weak', 'Fair', 'Good', 'Strong'][passwordStrength.strength]}
                    </span>
                  </div>

                  <div className="space-y-1.5 text-xs">
                    {[
                      { key: 'minLength' as const, label: 'At least 8 characters' },
                      { key: 'hasUppercase' as const, label: 'One uppercase letter (A-Z)' },
                      { key: 'hasLowercase' as const, label: 'One lowercase letter (a-z)' },
                      { key: 'hasNumbers' as const, label: 'One number (0-9)' },
                      { key: 'hasSymbols' as const, label: 'One symbol: ! @ # $ % ^ & * ( )' },
                    ].map(check => (
                      <div key={check.key} className="flex items-center gap-2">
                        {passwordStrength.checks[check.key] ? (
                          <CheckCircle2 size={12} className="text-emerald-500 shrink-0" />
                        ) : (
                          <AlertCircle size={12} className="text-[#A8A9AD] shrink-0" />
                        )}
                        <span className={passwordStrength.checks[check.key] ? 'text-[#E6E8E6]' : 'text-[#A8A9AD] font-inter'}>
                          {check.label}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {error && (
              <p className="text-sm text-red-400 bg-red-900/20 rounded-xl px-3 py-2 border border-red-900/40 font-inter" role="alert">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-xl bg-[#24476C] hover:bg-[#2E5A8A] text-white text-sm font-bold disabled:opacity-40 transition-all mt-1"
            >
              {loading ? 'Please wait...' : isSignUp ? 'Create account' : 'Sign in'}
            </button>
          </form>

          <p className="text-sm text-[#A8A9AD] text-center mt-6 font-inter">
            {isSignUp ? 'Already have an account? ' : "Don't have an account? "}
            <button
              onClick={onSwitchMode}
              className="text-[#60A5FA] font-semibold hover:underline underline-offset-4"
            >
              {isSignUp ? 'Sign in' : 'Sign up'}
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}
