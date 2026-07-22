'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { authClient } from '@/lib/auth-client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card } from '@/components/ui/card'
import { CheckCircle2, AlertCircle } from 'lucide-react'

export function AuthForm({ mode }: { mode: 'sign-in' | 'sign-up' }) {
  const router = useRouter()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const isSignUp = mode === 'sign-up'

  // Password strength validation
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

    const { error } = isSignUp
      ? await authClient.signUp.email({ email, password, name })
      : await authClient.signIn.email({ email, password })

    setLoading(false)

    if (error) {
      setError(error.message ?? 'Something went wrong')
      return
    }

    router.push('/')
    router.refresh()
  }

  return (
    <main className="min-h-svh bg-background flex items-center justify-center px-4">
      <Card className="w-full max-w-sm p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            {isSignUp ? 'Create an account' : 'Welcome back'}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {isSignUp
              ? 'Sign up to get started'
              : 'Sign in to your account to continue'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {isSignUp && (
            <div className="flex flex-col gap-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                autoComplete="name"
              />
            </div>
          )}
          <div className="flex flex-col gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
              autoComplete={isSignUp ? 'new-password' : 'current-password'}
            />
            
            {isSignUp && password && (
              <div className="mt-2 p-3 bg-card rounded-lg border border-border">
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex-1 bg-muted rounded-full h-2">
                    <div
                      className={`h-full rounded-full transition-all ${
                        passwordStrength.strength === 0
                          ? 'w-0 bg-destructive'
                          : passwordStrength.strength === 1
                            ? 'w-1/3 bg-yellow-500'
                            : passwordStrength.strength === 2
                              ? 'w-2/3 bg-blue-500'
                              : 'w-full bg-green-500'
                      }`}
                    />
                  </div>
                  <span className="text-xs font-medium text-muted-foreground">
                    {passwordStrength.strength === 0
                      ? 'Weak'
                      : passwordStrength.strength === 1
                        ? 'Fair'
                        : passwordStrength.strength === 2
                          ? 'Good'
                          : 'Strong'}
                  </span>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex items-center gap-2">
                    {passwordStrength.checks.minLength ? (
                      <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                    )}
                    <span
                      className={
                        passwordStrength.checks.minLength
                          ? 'text-foreground'
                          : 'text-muted-foreground'
                      }
                    >
                      At least 8 characters
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {passwordStrength.checks.hasUppercase ? (
                      <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                    )}
                    <span
                      className={
                        passwordStrength.checks.hasUppercase
                          ? 'text-foreground'
                          : 'text-muted-foreground'
                      }
                    >
                      One uppercase letter (A-Z)
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {passwordStrength.checks.hasLowercase ? (
                      <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                    )}
                    <span
                      className={
                        passwordStrength.checks.hasLowercase
                          ? 'text-foreground'
                          : 'text-muted-foreground'
                      }
                    >
                      One lowercase letter (a-z)
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {passwordStrength.checks.hasNumbers ? (
                      <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                    )}
                    <span
                      className={
                        passwordStrength.checks.hasNumbers
                          ? 'text-foreground'
                          : 'text-muted-foreground'
                      }
                    >
                      One number (0-9)
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {passwordStrength.checks.hasSymbols ? (
                      <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                    )}
                    <span
                      className={
                        passwordStrength.checks.hasSymbols
                          ? 'text-foreground'
                          : 'text-muted-foreground'
                      }
                    >
                      One symbol: ! @ # $ % ^ & * ( ) + = [ ] &#123; &#125; ; &quot; : | , . ? /
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {error && (
            <p className="text-sm text-destructive" role="alert">
              {error}
            </p>
          )}

          <Button type="submit" disabled={loading} className="w-full">
            {loading
              ? 'Please wait...'
              : isSignUp
                ? 'Create account'
                : 'Sign in'}
          </Button>
        </form>

        <p className="text-sm text-muted-foreground text-center mt-6">
          {isSignUp ? 'Already have an account? ' : "Don't have an account? "}
          <Link
            href={isSignUp ? '/sign-in' : '/sign-up'}
            className="text-foreground font-medium underline-offset-4 hover:underline"
          >
            {isSignUp ? 'Sign in' : 'Sign up'}
          </Link>
        </p>
      </Card>
    </main>
  )
}
