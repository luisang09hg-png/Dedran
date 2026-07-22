import { createClient } from './supabase/client'

export async function getSession() {
  const supabase = createClient()
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) return null
  return {
    userId: session.user.id,
    name: session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'User',
    email: session.user.email || '',
  }
}

export async function signUp(name: string, email: string, password: string): Promise<{ error?: string }> {
  const supabase = createClient()
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name: name },
    },
  })
  if (error) return { error: error.message }
  return {}
}

export async function signIn(email: string, password: string): Promise<{ error?: string }> {
  const supabase = createClient()
  const { error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) return { error: error.message }
  return {}
}

export async function signOut() {
  const supabase = createClient()
  await supabase.auth.signOut()
}
