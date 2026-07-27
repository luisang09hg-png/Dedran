import { supabase } from '../lib/supabase'

export function getPublications(profileId) {
  return supabase
    .from('publications')
    .select('*')
    .eq('profile_id', profileId)
    .order('published_at', { ascending: false })
    .then(({ data, error }) => {
      if (error) throw error
      return data || []
    })
}

export function createPublication(data) {
  return supabase
    .from('publications')
    .insert(data)
    .select()
    .single()
    .then(({ data, error }) => {
      if (error) throw error
      return data
    })
}

export function updatePublication(id, data) {
  return supabase
    .from('publications')
    .update(data)
    .eq('id', id)
    .select()
    .single()
    .then(({ data, error }) => {
      if (error) throw error
      return data
    })
}

export function deletePublication(id) {
  return supabase
    .from('publications')
    .delete()
    .eq('id', id)
    .then(({ error }) => {
      if (error) throw error
    })
}

export const api = { getPublications, createPublication, updatePublication, deletePublication }
