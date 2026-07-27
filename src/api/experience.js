import { supabase } from '../lib/supabase'

export function getExperience(profileId) {
  return supabase
    .from('experience')
    .select('*')
    .eq('profile_id', profileId)
    .order('start_date', { ascending: false })
    .then(({ data, error }) => {
      if (error) throw error
      return data || []
    })
}

export function createExperience(data) {
  return supabase
    .from('experience')
    .insert(data)
    .select()
    .single()
    .then(({ data, error }) => {
      if (error) throw error
      return data
    })
}

export function updateExperience(id, data) {
  return supabase
    .from('experience')
    .update(data)
    .eq('id', id)
    .select()
    .single()
    .then(({ data, error }) => {
      if (error) throw error
      return data
    })
}

export function deleteExperience(id) {
  return supabase
    .from('experience')
    .delete()
    .eq('id', id)
    .then(({ error }) => {
      if (error) throw error
    })
}

export const api = { getExperience, createExperience, updateExperience, deleteExperience }
