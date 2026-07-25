import { supabase } from '../lib/supabase'

export function getUser() {
  return supabase.auth.getUser().then(({ data: { user } }) => user)
}

export function signIn(email, password) {
  return supabase.auth.signInWithPassword({ email, password }).then(({ data, error }) => {
    if (error) throw error
    return data
  })
}

export function signUp(email, password, fullName) {
  return supabase.auth.signUp({
    email,
    password,
    options: { data: { full_name: fullName } },
  }).then(({ data, error }) => {
    if (error) throw error
    return data
  })
}

export function signOut() {
  return supabase.auth.signOut().then(({ error }) => {
    if (error) throw error
  })
}

export function updateUser(updates) {
  return supabase.auth.updateUser(updates).then(({ data, error }) => {
    if (error) throw error
    return data
  })
}

export function subscribeToAuth(onChange) {
  const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
    onChange(session?.user ?? null)
  })
  return () => subscription.unsubscribe()
}